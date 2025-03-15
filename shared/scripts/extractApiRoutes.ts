import { Project, SyntaxKind } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const routeFiles = fs.readdirSync(
  path.resolve(__dirname, "../../api/src/routes"),
  {
    withFileTypes: true,
  }
);

const inputFile = path.resolve(__dirname, "../../api/src/routes/role.ts");

interface RouteInfo {
  method: string;
  path: string;
  schema?: string;
  action: string;
}

routeFiles.forEach((file) => {
  if (!file.isFile()) {
    return;
  }

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(
    `${file.parentPath}/${file.name}`
  );

  const routes: RouteInfo[] = [];
  const imports = new Map<string, string>(); // Map of import name to import path

  // Extract import statements to determine correct schema paths
  const importDeclarations = sourceFile.getImportDeclarations();
  const importMap = new Map<string, string>();
  importDeclarations.forEach((decl) => {
    const moduleSpecifier = decl.getModuleSpecifierValue();
    decl.getNamedImports().forEach((namedImport) => {
      importMap.set(namedImport.getName(), moduleSpecifier);
    });
  });

  // Extract routes
  sourceFile.forEachDescendant((node) => {
    if (node.isKind(SyntaxKind.CallExpression)) {
      const expression = node.getExpression();

      if (
        expression.getText().endsWith(".post") ||
        expression.getText().endsWith(".get") ||
        expression.getText().endsWith(".put") ||
        expression.getText().endsWith(".delete")
      ) {
        const method =
          expression.getText().split(".").pop()?.toUpperCase() ?? "";
        const args = node.getArguments();
        if (args.length < 2) return;

        const pathArg = args[0].asKind(SyntaxKind.StringLiteral);
        if (!pathArg) return;

        let schema: string | undefined = undefined;
        if (
          args.some((arg) => arg.getText().startsWith("validateRequestBody("))
        ) {
          const schemaCall = args.find((arg) =>
            arg.getText().startsWith("validateRequestBody(")
          );
          if (schemaCall && schemaCall.isKind(SyntaxKind.CallExpression)) {
            const schemaArg = schemaCall.getArguments()[0];
            if (schemaArg) {
              schema = schemaArg.getText();
              const schemaName = schemaArg.getText().split(".")[0];
              const importPath = importMap.get(schemaName);
              if (importPath) {
                imports.set(schemaName, importPath);
              }
            }
          }
        }
        const routePath = pathArg.getLiteralText();

        const handler = args.find((arg) => arg.getText().startsWith("handle"));

        if (!handler) {
          throw new Error(`route ${routePath} has no handler`);
        }

        const routeAction = handler.getFullText().replace("handle", "").trim();

        const apiPrefix = "/api";

        routes.push({
          method,
          path: routePath.padStart(
            apiPrefix.length + routePath.length,
            apiPrefix
          ),
          action: routeAction,
          schema: schema,
        });
      }
    }
  });

  // Generate relative import paths based on companyRoutes.ts imports
  const importStatements = [...imports.entries()]
    .map(([imp, impPath]) => {
      // Compute the correct relative import path
      const relativePath = impPath
        .replace("shared/generated/", "../")
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "");
      return `import { ${imp} } from "${relativePath}";`;
    })
    .join("\n");

  const output = routes.reduce((prev, current, index) => {
    return {
      ...(index !== 0 ? prev : {}),
      [current.action]: {
        method: current.method,
        path: current.path,
        schema: current.schema,
      },
    };
  }, {});

  // Generate the output file content
  const routeObjects = Object.keys(output)
    .map(
      (key) => `${key}: {
      method: "${output[key].method}",
      path: "${output[key].path}",
      schema: ${output[key].schema}
  },`
    )
    .join("\n");

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
});
