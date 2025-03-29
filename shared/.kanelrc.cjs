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
			name: `z.object({
        years: z.number(),
        months: z.number(),
        days: z.number(),
        hours: z.number(),
        minutes: z.number(), 
        seconds: z.number(),
        milliseconds: z.number()})`,
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
	outputPath: "./generated/db",
	preRenderHooks: [generateZodSchemas],
	customTypeMap: {
		"pg_catalog.numrange": {
			name: "Range<number>",
			typeImports: [
				{
					name: "Range",
					path: "postgres-range",
					isAbsolute: true,
					isDefault: false,
				},
			],
		},
		"pg_catalog.interval": {
			name: "IntervalObject",
			typeImports: [
				{
					name: "IntervalObject",
					path: "../../../types/interval",
					isAbsolute: true,
					isDefault: false,
				},
			],
		},
	},
};
