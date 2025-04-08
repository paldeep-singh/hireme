const {
	makeGenerateZodSchemas,
	defaultGetZodSchemaMetadata,
	defaultGetZodIdentifierMetadata,
	defaultZodTypeMap,
} = require("kanel-zod");

const generateZodSchemas = makeGenerateZodSchemas({
	getZodSchemaMetadata: defaultGetZodSchemaMetadata,
	getZodIdentifierMetadata: defaultGetZodIdentifierMetadata,
	castToSchema: true,
	zodTypeMap: {
		...defaultZodTypeMap,
		"pg_catalog.interval": {
			name: `z.string().duration()`,
			typeImports: [],
		},
		"pg_catalog.timestamptz": {
			name: `z.string().datetime()`,
			typeImports: [],
		},
	},
});

/** @type {import('kanel').Config} */
module.exports = {
	connection: {
		host: "localhost",
		user: "test_user",
		password: "",
		database: "hire_me_test_db",
	},
	importsExtension: ".js",
	schemas: ["hire_me"],
	enumStyle: "type",
	preDeleteOutputFolder: true,
	outputPath: "./generated/api",
	preRenderHooks: [generateZodSchemas],
	customTypeMap: {
		"pg_catalog.numrange": {
			name: "NumRange",
			typeImports: [
				{
					name: "NumRange",
					path: "../../../types/range",
					isAbsolute: true,
					isDefault: false,
				},
			],
		},
		"pg_catalog.timestamptz": {
			name: "string",
			typeImports: [],
		},
		"pg_catalog.interval": {
			name: "string",
			typeImports: [],
		},
	},
};
