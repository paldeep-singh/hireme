import {
  LeftHandSideExpression,
  Project,
  SourceFile,
  SyntaxKind,
  ts,
  Node,
  VariableDeclarationKind,
  Writers,
} from "ts-morph";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routeFiles = fs.readdirSync(
  path.resolve(__dirname, "../../api/src/routes"),
  {
    withFileTypes: true,
  },
);

routeFiles.forEach((file) => {
  extractRouteInfo(file);
  extractRouteReturnTypes(file);
});

formatWithPrettier("generated/routes/*");

interface RouteInfo {
  method: string;
  path: string;
  schema?: string;
}

type Routes = Record<string, RouteInfo>;

function extractRouteInfo(file: fs.Dirent) {
  if (file.isDirectory()) {
    return;
  }

  const project = new Project();
  const outputPath = path.resolve(
    __dirname,
    `../generated/routes/${file.name}`,
  );

  const outputSourceFile = project.createSourceFile(outputPath, "", {
    overwrite: true,
  });

  const sourceFile = project.addSourceFileAtPath(
    `${file.parentPath}/${file.name}`,
  );

  const imports = getImportDeclarations(sourceFile);

  const routes = getRouteData(sourceFile);

  const schemas = Object.entries(routes).reduce((acc, [_, { schema }]) => {
    if (!schema) {
      return acc;
    }

    return [...acc, schema];
  }, [] as string[]);

  const requiredImports = getRequiredImports(schemas, imports);

  addImportDeclarations(outputSourceFile, requiredImports);

  addRoutesDeclaration(outputSourceFile, routes);

  outputSourceFile.saveSync();
}

function extractRouteReturnTypes(file: fs.Dirent) {
  if (file.isDirectory()) {
    return;
  }

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(
    `${file.parentPath}/${file.name}`,
  );
  const outputPath = path.resolve(
    __dirname,
    `../generated/routes/${file.name}`,
  );

  const outputSourceFile = project.addSourceFileAtPath(outputPath);

  const handlers = sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .map((exp) => {
      return exp
        .getArguments()
        .find((arg) => arg.getText().startsWith("handle"));
    })
    .filter((arg) => !!arg);

  handlers.forEach((handler) => {
    const action = handler.getFullText().replace("handle", "").trim();

    if (!handler.isKind(SyntaxKind.Identifier)) {
      throw new Error(`route ${path} has no handler`);
    }
    const handlerDefinition = handler.getDefinitionNodes()[0];

    const imports = getImportDeclarations(handlerDefinition.getSourceFile());

    const handlerType = handlerDefinition
      .getChildren()
      .find((child) => child.getText().startsWith("RequestHandler"));

    if (!handlerType || !handlerType.isKind(SyntaxKind.TypeReference)) {
      throw new Error(`route ${path}'s handler declaration type is incorrect`);
    }

    const responseBodyType = handlerType.getTypeArguments()[0];

    if (
      !responseBodyType.isKind(SyntaxKind.TypeLiteral) &&
      !responseBodyType.isKind(SyntaxKind.TypeReference) &&
      !responseBodyType.isKind(SyntaxKind.ArrayType)
    ) {
      throw new Error(
        `Response body type for route ${path} is of type ${responseBodyType.getKindName}, which has not been implemented.`,
      );
    }

    // TODO: Improve on these if statements and figure out how to avoid duplicate imports

    if (responseBodyType.isKind(SyntaxKind.TypeLiteral)) {
      const properties = responseBodyType.getDescendantsOfKind(
        SyntaxKind.PropertySignature,
      );

      const propertyList = properties.map((property) => {
        const name = property.getName();
        const type = property.getChildAtIndex(2);

        const typeText = type.getText();

        const typeImportIsDefault = !!imports.defaultImports.get(typeText);

        if (typeImportIsDefault) {
          outputSourceFile.addImportDeclaration({
            moduleSpecifier: (imports.defaultImports.get(typeText) as string)
              .replace("shared/generated/", "../")
              .replace("shared/types/", "../../types/")
              .replace(/\\/g, "/"),
            defaultImport: typeText,
          });
        } else {
          outputSourceFile.addImportDeclaration({
            moduleSpecifier: (imports.namedImports.get(typeText) as string)
              .replace("shared/generated/", "../")
              .replace("shared/types/", "../../types/")
              .replace(/\\/g, "/"),
            namedImports: [typeText],
          });
        }

        return {
          name,
          type: typeText,
        };
      });

      outputSourceFile.addInterface({
        name: `${action}ReturnType`,
        properties: propertyList,
        isExported: true,
      });

      outputSourceFile.saveSync();
    }

    if (responseBodyType.isKind(SyntaxKind.TypeReference)) {
      const typeText = responseBodyType.getText();

      const typeImportIsDefault = !!imports.defaultImports.get(typeText);

      if (typeImportIsDefault) {
        outputSourceFile.addImportDeclaration({
          moduleSpecifier: (imports.defaultImports.get(typeText) as string)
            .replace("shared/generated/", "../")
            .replace("shared/types/", "../../types/")
            .replace(/\\/g, "/"),
          defaultImport: typeText,
        });
      } else {
        outputSourceFile.addImportDeclaration({
          moduleSpecifier: (imports.namedImports.get(typeText) as string)
            .replace("shared/generated/", "../")
            .replace("shared/types/", "../../types/")
            .replace(/\\/g, "/"),
          namedImports: [typeText],
        });
      }

      outputSourceFile.addTypeAlias({
        name: `${action}ReturnType`,
        type: typeText,
        isExported: true,
      });

      outputSourceFile.saveSync();
    }

    if (responseBodyType.isKind(SyntaxKind.ArrayType)) {
      const typeText = responseBodyType.getText();

      const typeTextWithoutSquareBrackets = typeText.replace("[]", "");

      const typeImportIsDefault = !!imports.defaultImports.get(
        typeTextWithoutSquareBrackets,
      );

      if (typeImportIsDefault) {
        outputSourceFile.addImportDeclaration({
          moduleSpecifier: (
            imports.defaultImports.get(typeTextWithoutSquareBrackets) as string
          )
            .replace("shared/generated/", "../")
            .replace("shared/types/", "../../types/")
            .replace(/\\/g, "/"),
          defaultImport: typeTextWithoutSquareBrackets,
        });
      } else {
        outputSourceFile.addImportDeclaration({
          moduleSpecifier: (
            imports.namedImports.get(typeTextWithoutSquareBrackets) as string
          )
            .replace("shared/generated/", "../")
            .replace("shared/types/", "../../types/")
            .replace(/\\/g, "/"),
          namedImports: [typeTextWithoutSquareBrackets],
        });
      }

      outputSourceFile.addTypeAlias({
        name: `${action}ReturnType`,
        type: typeText,
        isExported: true,
      });

      outputSourceFile.saveSync();
    }

    formatWithPrettier(outputPath).then(() =>
      console.log(`${file.name} route declarations saved to ${outputPath}`),
    );
  });
}

interface Imports {
  namedImports: Map<string, string>;
  defaultImports: Map<string, string>;
}

function getImportDeclarations(sourceFile: SourceFile): Imports {
  // Extract import statements to determine correct schema paths
  const importDeclarations = sourceFile.getImportDeclarations();
  const namedImports = new Map<string, string>();
  const defaultImports = new Map<string, string>();

  importDeclarations.forEach((decl) => {
    const moduleSpecifier = decl.getModuleSpecifierValue();
    decl.getNamedImports().forEach((namedImport) => {
      namedImports.set(namedImport.getName(), moduleSpecifier);
    });
    const defaultImport = decl.getDefaultImport();

    if (defaultImport) {
      defaultImports.set(defaultImport.getText(), moduleSpecifier);
    }
  });

  return { namedImports, defaultImports };
}

function resolveImportPath(path: string) {
  return path
    .replace("shared/generated/", "../")
    .replace("shared/types/", "../../types/")
    .replace(/\\/g, "/");
}

function addImportDeclarations(sourceFile: SourceFile, imports: Imports): void {
  const { defaultImports, namedImports } = imports;

  namedImports.forEach((path, name) => {
    sourceFile.addImportDeclaration({
      moduleSpecifier: resolveImportPath(path),
      namedImports: [name],
    });
  });

  defaultImports.forEach((path, name) => {
    sourceFile.addImportDeclaration({
      moduleSpecifier: resolveImportPath(path),
      defaultImport: name,
    });
  });
}

function addRoutesDeclaration(sourceFile: SourceFile, routes: Routes): void {
  sourceFile.addVariableStatements(
    Object.entries(routes).map(([action, { method, path, schema }]) => ({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: action,
          initializer: Writers.assertion(
            Writers.object({
              method: (writer) => writer.quote(method),
              path: (writer) => writer.quote(path),
              ...(schema
                ? { schema: (writer) => writer.write(schema ?? "undefined") }
                : {}),
            }),
            "const",
          ),
        },
      ],
    })),
  );
}

function getRouteData(sourceFile: SourceFile): Routes {
  const routes = sourceFile.getDescendants().reduce((acc, currentNode) => {
    if (!currentNode.isKind(SyntaxKind.CallExpression)) {
      return acc;
    }

    const expression = currentNode.getExpression();
    const expressionText = expression.getFullText();

    if (!isExpressRequest(expression)) {
      return acc;
    }

    const method = expression.getText().split(".").pop();

    if (!method) {
      throw new Error(`Missing http method in expression: ${expressionText}`);
    }

    const args = currentNode.getArguments();
    if (args.length < 2) {
      throw new Error(
        `Expression has insufficient number of args: ${expressionText}`,
      );
    }

    const pathArg = args[0].asKind(SyntaxKind.StringLiteral);
    if (!pathArg) {
      throw new Error(
        `First arg of express expression is not string literal: ${expressionText}`,
      );
    }

    const path = `/api${pathArg.getLiteralText()}`;

    const schema = getValidationSchema(args);
    const handler = args.find((arg) => arg.getText().startsWith("handle"));

    if (!handler || !handler.isKind(SyntaxKind.Identifier)) {
      throw new Error(`route ${path} has no handler`);
    }

    const action = handler.getFullText().replace("handle", "").trim();

    return {
      ...acc,
      [action]: {
        method,
        schema,
        path,
      },
    };
  }, {} as Routes);

  return routes;
}

function getValidationSchema(args: Node<ts.Node>[]): string | undefined {
  const validationExpression = args.find((arg) =>
    arg.getText().startsWith("validateRequestBody("),
  );

  if (!validationExpression) {
    return undefined;
  }

  if (!validationExpression.isKind(SyntaxKind.CallExpression)) {
    throw new Error("Validation expression is not call expression");
  }

  const schemaArg = validationExpression.getArguments()[0];

  if (!schemaArg) {
    throw new Error(
      `Validation expression does not contain schema argument ${validationExpression.getText()}`,
    );
  }

  return schemaArg.getText();
}

function getRequiredImports(
  identifiers: string[],
  importDeclarations: Imports,
): Imports {
  const requiredImports: Imports = {
    defaultImports: new Map<string, string>(),
    namedImports: new Map<string, string>(),
  };

  identifiers.forEach((identifier) => {
    const namedImport = importDeclarations.namedImports.get(identifier);

    const defaultImport = importDeclarations.defaultImports.get(identifier);

    if (namedImport) {
      requiredImports.namedImports.set(identifier, namedImport);
      return;
    }

    if (defaultImport) {
      requiredImports.defaultImports.set(identifier, defaultImport);
    }
  });

  return requiredImports;
}

function isExpressRequest(expression: LeftHandSideExpression) {
  const text = expression.getText();

  return (
    text.endsWith(".post") ||
    text.endsWith(".get") ||
    text.endsWith(".delete") ||
    text.endsWith(".patch")
  );
}

async function formatWithPrettier(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    exec(`pnpm prettier --write "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
