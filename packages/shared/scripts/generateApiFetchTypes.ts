import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { Node, Project, SourceFile, SyntaxKind, ts } from "ts-morph";
import {
	addImportDeclarations,
	fixLintingErrors,
	formatWithPrettier,
	getHttpMethod,
	getImportDeclarations,
	getPath,
	getRequiredImports,
	getRouteAction,
	Imports,
	isExpressRequest,
} from "./utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Delete fetchTypes file to ensure linting of generated route types does not fail.
try {
	fs.rmSync(path.resolve(__dirname, "../generated/routes/fetchTypes.ts"));
} catch {
	console.log("fetchTypes.ts file not found, proceeding...");
}

const routeFiles = fs.readdirSync(
	path.resolve(__dirname, "../../../apps/api/src/routes"),
	{
		withFileTypes: true,
	},
);

routeFiles.forEach((file) => {
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

	outputSourceFile.insertStatements(
		0,
		"// This file is generated and should not be modified directly.",
	);

	outputSourceFile.saveSync();

	const sourceFile = project.addSourceFileAtPath(
		`${file.parentPath}/${file.name}`,
	);

	sourceFile.getDescendants().forEach((currentNode) => {
		parseHandlerTypes(currentNode, outputSourceFile);
	});

	outputSourceFile.saveSync();
});

await formatWithPrettier("generated/routes/*").then(() =>
	console.log("files formatted"),
);

await fixLintingErrors("generated/routes/*").then(() =>
	console.log("files linted."),
);

generateFetchTypes();

async function generateFetchTypes() {
	const routeTypeFiles = fs
		.readdirSync(path.resolve(__dirname, "../generated/routes"), {
			withFileTypes: true,
		})
		.filter((file) => file.isFile() && file.name !== "fetchTypes.ts");

	fs.writeFileSync(
		path.resolve(__dirname, "../generated/routes/fetchTypes.ts"),
		"",
	);

	const project = new Project();

	const outputPath = path.resolve(
		__dirname,
		`../generated/routes/fetchTypes.ts`,
	);

	const outputSourceFile = project.addSourceFileAtPath(outputPath);

	outputSourceFile.insertStatements(
		0,
		"// This file is generated and should not be modified directly.",
	);

	outputSourceFile.saveSync();

	outputSourceFile.addInterface({
		name: "ApiRequests",
		isExported: true,
		properties: [],
	});

	outputSourceFile.saveSync();

	const apiFetchInterface = outputSourceFile.getInterfaceOrThrow("ApiRequests");

	routeTypeFiles.forEach((file) => {
		const sourceFile = project.addSourceFileAtPath(
			`${file.parentPath}/${file.name}`,
		);

		sourceFile
			.getDescendantsOfKind(SyntaxKind.InterfaceDeclaration)
			.forEach((interfaceDeclaration) => {
				const name = interfaceDeclaration.getName();

				const action = name.replace("Request", "");

				outputSourceFile.addImportDeclaration({
					namedImports: [name],
					moduleSpecifier: `./${file.name.replace(".ts", ".js")}`,
				});

				apiFetchInterface.addProperty({
					name: action,
					type: name,
				});
			});
	});

	outputSourceFile.saveSync();

	await formatWithPrettier("generated/routes/fetchTypes.ts").then(() =>
		console.log("fetchTypes.ts formatted"),
	);

	await fixLintingErrors("generated/routes/fetchTypes.ts").then(() =>
		console.log("fetchTypes.ts linted."),
	);
}

function parseHandlerTypes(node: Node<ts.Node>, outputSourceFile: SourceFile) {
	if (!node.isKind(SyntaxKind.CallExpression)) {
		return;
	}

	const expression = node.getExpression();

	if (!isExpressRequest(expression)) {
		return;
	}

	const method = getHttpMethod(expression);

	const args = node.getArguments();

	const path = getPath(node);

	const action = getRouteAction(node);

	const handler = args.find((arg) => arg.getText().startsWith("handle"));

	if (!handler?.isKind(SyntaxKind.Identifier)) {
		throw new Error(`route ${path} has no handler`);
	}

	const handlerDefinition = handler.getDefinitionNodes()[0];

	if (!handlerDefinition) {
		throw new Error(`No handler definition for ${handler.getText()}`);
	}

	const handlerImports = getImportDeclarations(
		handlerDefinition.getSourceFile(),
	);

	const handlerType = handlerDefinition
		.getChildren()
		.find((child) => child.getText().startsWith("RequestHandler"));

	if (!handlerType?.isKind(SyntaxKind.TypeReference)) {
		throw new Error(`route ${path}'s handler declaration type is incorrect`);
	}

	const responseBody = handlerType.getTypeArguments().at(0);
	const requestBody = handlerType.getTypeArguments().at(1);

	writeRequestType(outputSourceFile, handlerImports, {
		method,
		path,
		responseBody,
		requestBody,
		action,
	});
}

function handleBodyTypes(
	type: Node<ts.Node>,
	reqOrRes: "request" | "response",
	imports: Imports,
	outputSourceFile: SourceFile,
) {
	const name = reqOrRes === "response" ? "responseBody" : "body";

	if (type.isKind(SyntaxKind.TypeLiteral)) {
		const properties = type.getDescendantsOfKind(SyntaxKind.PropertySignature);

		const propertyList = properties.map((property) => property.getText());

		const requiredImports = getRequiredImports(
			properties.map((property) => property.getChildAtIndex(2).getText()),
			imports,
		);

		addImportDeclarations(outputSourceFile, requiredImports);

		return {
			name,
			type: `{${propertyList.join(",")}}`,
		};
	}

	if (type.isKind(SyntaxKind.TypeReference)) {
		const typeText = type.getText();

		const requiredImports = getRequiredImports([typeText], imports);

		addImportDeclarations(outputSourceFile, requiredImports);

		return {
			name,
			type: typeText,
		};
	}

	if (type.isKind(SyntaxKind.ArrayType)) {
		const typeText = type.getText();

		const typeTextWithoutSquareBrackets = typeText.replace("[]", "");

		const requiredImports = getRequiredImports(
			[typeTextWithoutSquareBrackets],
			imports,
		);

		addImportDeclarations(outputSourceFile, requiredImports);

		return {
			name,
			type: typeText,
		};
	}

	if (
		type.isKind(SyntaxKind.UndefinedKeyword) ||
		type.isKind(SyntaxKind.NullKeyword)
	) {
		return {
			name,
			type: `undefined`,
		};
	}

	throw new Error(
		`No implementation for request/response body types of type ${type.getKindName()}.`,
	);
}

interface RequestDetails {
	action: string;
	method: string;
	path: string;
	responseBody?: Node<ts.Node>;
	requestBody?: Node<ts.Node>;
}

function writeRequestType(
	outputSourceFile: SourceFile,
	handlerImports: Imports,
	{ method, path, responseBody, requestBody, action }: RequestDetails,
) {
	outputSourceFile.addInterface({
		name: `${action}Request`,
		isExported: true,
		properties: [
			{
				name: "method",
				type: `"${method}"`,
			},
			{
				name: "path",
				type: `"${path}"`,
			},
			...(responseBody
				? [
						handleBodyTypes(
							responseBody,
							"response",
							handlerImports,
							outputSourceFile,
						),
					]
				: [
						{
							name: "responseBody",
							type: `null`,
						},
					]),
			...(requestBody
				? [
						handleBodyTypes(
							requestBody,
							"request",
							handlerImports,
							outputSourceFile,
						),
					]
				: [
						{
							name: "body",
							type: `null`,
						},
					]),
		],
	});
}
