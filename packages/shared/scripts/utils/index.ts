import { exec } from "child_process";
import {
	CallExpression,
	LeftHandSideExpression,
	SourceFile,
	SyntaxKind,
} from "ts-morph";

export function isExpressRequest(expression: LeftHandSideExpression) {
	const text = expression.getText();

	return (
		text.endsWith(".post") ||
		text.endsWith(".get") ||
		text.endsWith(".delete") ||
		text.endsWith(".patch")
	);
}

export function getHttpMethod(expression: LeftHandSideExpression) {
	const method = expression.getText().split(".").pop();

	if (!method) {
		throw new Error(
			`Missing http method in expression: ${expression.getFullText()}`,
		);
	}

	return method;
}

export function getPath(expression: CallExpression) {
	const args = expression.getArguments();

	if (!args[0]) {
		throw new Error(`Expression has no args: ${expression.getText()}`);
	}

	const pathArg = args[0].asKind(SyntaxKind.StringLiteral);
	if (!pathArg) {
		throw new Error(
			`First arg of express expression is not string literal: ${expression.getFullText()}`,
		);
	}

	return `/api${pathArg.getLiteralText()}`;
}

export function getRouteAction(expression: CallExpression) {
	const args = expression.getArguments();

	const handler = args.find((arg) => arg.getText().startsWith("handle"));

	if (!handler?.isKind(SyntaxKind.Identifier)) {
		throw new Error(`route has no handler: ${expression.getFullText()}`);
	}

	return handler.getFullText().replace("handle", "").trim();
}

export async function formatWithPrettier(filePath: string) {
	return new Promise<void>((resolve, reject) => {
		exec(`pnpm prettier --write "${filePath}"`, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

export async function fixLintingErrors(filePath: string) {
	return new Promise<void>((resolve, reject) => {
		exec(`pnpm eslint "${filePath}" --fix`, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

export interface Imports {
	namedImports: Map<string, string>;
	defaultImports: Map<string, string>;
}

export function getImportDeclarations(sourceFile: SourceFile): Imports {
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

export function addImportDeclarations(
	sourceFile: SourceFile,
	imports: Imports,
): void {
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

function resolveImportPath(path: string) {
	return path
		.replace("@repo/shared/generated/db/", "../db/hire_me/")
		.replace("@repo/shared/generated/", "../")
		.replace("@repo/shared/types/", "../../types/")
		.replace(/\\/g, "/");
}

export function getRequiredImports(
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
