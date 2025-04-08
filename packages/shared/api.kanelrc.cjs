const {
	makeGenerateZodSchemas,
	defaultGetZodSchemaMetadata,
	defaultGetZodIdentifierMetadata,
	defaultZodTypeMap,
} = require("kanel-zod");

/** @type {import('kanel-zod').makeGenerateZodSchemas} */
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
		"pg_catalog.numrange": {
			name: `z.object({
                min: z.number().nullable(),
                max: z.number().nullable()
            })`,
			typeImports: [],
		},
	},
});

/**
 * @typedef {Object} ValidatorConfigs
 * @property {string} attribute - The attribute to match.
 * @property {string} search - The string to search for.
 * @property {string} replacement - The string to replace matches with.
 */

/**@type {ValidatorConfigs[]} */
const specificZodFieldValidators = [
	{
		attribute: "email",
		search: "z.string()",
		replacement: "z.string().email()",
	},
	{
		attribute: "ad_url",
		search: "z.string()",
		replacement: "z.string().url()",
	},
	{
		attribute: "website",
		search: "z.string()",
		replacement: "z.string().url()",
	},
];

/**
 * @param {import("kanel").Output} output
 * @param {ValidatorConfigs[]} configs - An array of schema configuration objects.
 * @returns {import("kanel").Output}
 */

function specificZodValidators(output, configs) {
	const updatedOutput = Object.entries(output).map(
		([path, { declarations }]) => {
			const updatedDeclarations = declarations.map((dec) => {
				if (!(dec.declarationType === "constant")) {
					return dec;
				}

				const { value } = dec;

				if (typeof value === "string") {
					return dec;
				}

				if (!value[0].startsWith("z.object")) {
					return dec;
				}

				configs.forEach(({ attribute, replacement, search }) => {
					const attributeIndex = value.findIndex((v) => {
						return v.trimStart().startsWith(attribute);
					});

					if (attributeIndex === -1) {
						return;
					}

					value[attributeIndex] = value[attributeIndex].replace(
						search,
						replacement,
					);
				});

				return {
					...dec,
					value,
				};
			});

			return [path, { declarations: updatedDeclarations }];
		},
	);

	return Object.fromEntries(updatedOutput);
}

const EnumTypePaths = [
	"generated/api/hire_me/ContractType",
	"generated/api/hire_me/RequirementMatchLevel",
	"generated/api/hire_me/SalaryPeriod",
];

/**
 * @param {import("kanel").Output} output
 * @param {string[]} paths - An array of schema configuration objects.
 * @returns {import("kanel").Output}
 */

function filterOutEnumTypes(output) {
	const filteredOutput = Object.entries(output)
		.map(([path, decs]) => {
			if (EnumTypePaths.includes(path)) {
				return undefined;
			}

			return [path, decs];
		})
		.filter((e) => !!e);

	return Object.fromEntries(filteredOutput);
}

/**@type {import('kanel').PreRenderHook} */
function filterOutIdTypeDeclarations(output, instantiatedConfig) {
	const filteredOutput = Object.entries(output).map(([path, decs]) => {
		const filteredDecs = decs.declarations.filter((d) => {
			if (d.name.endsWith("Id") && d.declarationType === "typeDeclaration") {
				return false;
			}

			return true;
		});

		return [path, { declarations: filteredDecs }];
	});

	return Object.fromEntries(filteredOutput);
}

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
	preRenderHooks: [
		generateZodSchemas,
		(output) => specificZodValidators(output, specificZodFieldValidators),
		(output) => filterOutEnumTypes(output),
		filterOutIdTypeDeclarations,
	],
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
