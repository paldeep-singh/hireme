import {
  ImportDeclaration,
  LeftHandSideExpression,
  Project,
  SourceFile,
  SyntaxKind,
} from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const routeFiles = fs.readdirSync(
  path.resolve(__dirname, "../../api/src/routes"),
  {
    withFileTypes: true,
  }
);

routeFiles.forEach((file) => extractRouteInfo(file));

interface RouteInfo {
  method: string;
  path: string;
  schema?: string;
}

type Routes = Record<string, RouteInfo>;

function extractRouteInfo(file: fs.Dirent) {
  if (!file.isFile()) {
    return;
  }

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(
    `${file.parentPath}/${file.name}`
  );

  const fileImports = getImportDeclarations(sourceFile);

  const routes = getRouteData(sourceFile);

  const requiredImports = getRequiredImports(routes, fileImports);

  const importStatements = getImportStatements(requiredImports);

  const routeObjects = getRouteobjectStatement(routes);

  const outputContent = `
${importStatements}

export const routeDefinitions = {
${routeObjects}
} as const;
`;

  const outputFile = path.resolve(
    __dirname,
    `../generated/routes/${file.name}`
  );

  // Write to output file
  fs.writeFileSync(outputFile, outputContent);
  console.log(`Routes extracted to ${outputFile}`);
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

function getImportStatements(imports: Map<string, string>): string {
  return [...imports.entries()]
    .map(([imp, impPath]) => {
      // Compute the correct relative import path
      const relativePath = impPath
        .replace("shared/generated/", "../")
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "");
      return `import { ${imp} } from "${relativePath}";`;
    })
    .join("\n");
}

function getRouteobjectStatement(routes: Routes): string {
  return Object.entries(routes)
    .map(([action, { method, path, schema }]) => {
      return `${action}: {
      method: "${method}",
      path: "${path}",
      schema: ${schema}
  },`;
    })
    .join("\n");
}

function getRouteData(sourceFile: SourceFile): Routes {
  const routes = sourceFile.getDescendants().reduce((acc, currentNode) => {
    if (!currentNode.isKind(SyntaxKind.CallExpression)) {
      return acc;
    }

    const expression = currentNode.getExpression();

    if (!isExpressRequest(expression)) {
      return acc;
    }

    const method = expression.getText().split(".").pop();

    if (!method) return acc;

    const args = currentNode.getArguments();
    if (args.length < 2) return acc;

    const pathArg = args[0].asKind(SyntaxKind.StringLiteral);
    if (!pathArg) return acc;

    const path = `/api${pathArg.getLiteralText()}`;

    let schema: string | undefined;

    const validationExpression = args.find((arg) =>
      arg.getText().startsWith("validateRequestBody(")
    );

    if (!validationExpression) {
      schema = undefined;
    } else if (!validationExpression.isKind(SyntaxKind.CallExpression)) {
      throw new Error("Validation expression is not call expression");
    } else {
      const schemaArg = validationExpression.getArguments()[0];

      if (!schemaArg) {
        throw new Error(
          `Validation expression does not contain schema argument ${validationExpression.getText()}`
        );
      }

      schema = schemaArg.getText();
    }

    const handler = args.find((arg) => arg.getText().startsWith("handle"));

    if (!handler) {
      throw new Error(`route ${path} has no handler`);
    }

    const routeAction = handler.getFullText().replace("handle", "").trim();

    return {
      ...acc,
      [routeAction]: {
        method,
        schema,
        path,
      },
    };
  }, {} as Routes);

  return routes;
}

function getRequiredImports(
  routes: Routes,
  importDeclarations: Map<string, string>
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
