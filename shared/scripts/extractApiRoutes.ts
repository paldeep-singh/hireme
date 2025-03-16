import {
  ImportDeclaration,
  LeftHandSideExpression,
  Project,
  SourceFile,
  SyntaxKind,
  ts,
  Node,
  VariableDeclarationKind,
  ObjectLiteralExpression,
  Writers,
} from "ts-morph";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

const routeFiles = fs.readdirSync(
  path.resolve(__dirname, "../../api/src/routes"),
  {
    withFileTypes: true,
  },
);

routeFiles.forEach((file) => extractRouteInfo(file));

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

  const fileImports = getImportDeclarations(sourceFile);

  const routes = getRouteData(sourceFile);

  const requiredImports = getRequiredImports(routes, fileImports);

  addImportDeclarations(outputSourceFile, requiredImports);

  addRoutesDeclaration(outputSourceFile, routes);

  outputSourceFile.saveSync();

  formatWithPrettier(outputPath).then(() =>
    console.log(`${file.name} route declarations saved to ${outputPath}`),
  );
}

function getImportDeclarations(sourceFile: SourceFile): Map<string, string> {
  // Extract import statements to determine correct schema paths
  const importDeclarations = sourceFile.getImportDeclarations();
  const importMap = new Map<string, string>();
  importDeclarations.forEach((decl) => {
    const moduleSpecifier = decl.getModuleSpecifierValue();
    decl.getNamedImports().forEach((namedImport) => {
      importMap.set(namedImport.getName(), moduleSpecifier);
    });
  });

  return importMap;
}

function addImportDeclarations(
  sourceFile: SourceFile,
  imports: Map<string, string>,
): void {
  // Add import statements dynamically
  imports.forEach((importPath, importName) => {
    const relativePath = importPath
      .replace("shared/generated/", "../")
      .replace(/\\/g, "/")
      .replace(/\.ts$/, "");
    sourceFile.addImportDeclaration({
      namedImports: [importName],
      moduleSpecifier: relativePath,
    });
  });
}

function addRoutesDeclaration(sourceFile: SourceFile, routes: Routes): void {
  const routesDeclaration = sourceFile
    .addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: "routes",
          initializer: Writers.object({}),
        },
      ],
    })
    .getDeclarations()[0]
    .getInitializer() as ObjectLiteralExpression;

  Object.entries(routes).forEach(([action, { method, path, schema }]) => {
    routesDeclaration.addPropertyAssignment({
      name: action,
      initializer: Writers.object({
        method: (writer) => writer.quote(method),
        path: (writer) => writer.quote(path),
        schema: (writer) => writer.write(schema ?? "undefined"),
      }),
    });
  });
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

    if (!handler) {
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
  routes: Routes,
  importDeclarations: Map<string, string>,
): Map<string, string> {
  return Object.values(routes).reduce((acc, { schema }) => {
    if (schema) {
      const importPath = importDeclarations.get(schema);

      if (!importPath) {
        throw new Error(`No import path for schema: ${schema}`);
      }

      acc.set(schema, importPath);
      return acc;
    }

    return acc;
  }, new Map<string, string>());
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
