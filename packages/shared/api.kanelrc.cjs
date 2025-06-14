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
		"pg_catalog.text": {
			name: `z.string().min(1)`,
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

const EnumTypes = ["ContractType", "RequirementMatchLevel", "SalaryPeriod"];

/**
 * @param {import("kanel").Output} output
 * @param {string[]} enumTypes - An array of schema configuration objects.
 * @returns {import("kanel").Output}
 */

function filterOutEnumTypes(output) {
	const filteredOutput = Object.entries(output).map(([path, decs]) => {
		const filteredDecs = decs.declarations.filter((d) => {
			if (
				EnumTypes.includes(d.name) &&
				d.declarationType === "typeDeclaration"
			) {
				return false;
			}

			return true;
		});

		return [path, { declarations: filteredDecs }];
	});

	const outputWithUpdatedImports = filteredOutput.map(([path, decs]) => {
		if (typeof decs === "string") {
			return [path, decs];
		}

		const decsWithUpdatedImports = decs.declarations.map((dec) => {
			if (!(dec.declarationType === "interface")) {
				return dec;
			}
			const propertiesWithUpdatedImports = dec.properties.map((p) => {
				if (!EnumTypes.includes(p.typeName)) {
					return p;
				}

				const updatedTypeImports = p.typeImports.map((t) => {
					return {
						...t,
						path: t.path.replace("generated/api", "generated/db"),
					};
				});

				return {
					...p,
					typeImports: updatedTypeImports,
				};
			});

			return {
				...dec,
				properties: propertiesWithUpdatedImports,
			};
		});

		return [path, { declarations: decsWithUpdatedImports }];
	});

	return Object.fromEntries(outputWithUpdatedImports);
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

	const outputWithUpdatedImports = filteredOutput.map(([path, decs]) => {
		if (typeof decs === "string") {
			return [path, decs];
		}

		const decsWithUpdatedImports = decs.declarations.map((dec) => {
			if (!(dec.declarationType === "interface")) {
				return dec;
			}
			const propertiesWithUpdatedImports = dec.properties.map((p) => {
				if (!p.typeName.endsWith("Id")) {
					return p;
				}

				const updatedTypeImports = p.typeImports.map((t) => {
					return {
						...t,
						path: t.path.replace("generated/api", "generated/db"),
					};
				});

				return {
					...p,
					typeImports: updatedTypeImports,
				};
			});

			return {
				...dec,
				properties: propertiesWithUpdatedImports,
			};
		});

		return [path, { declarations: decsWithUpdatedImports }];
	});

	return Object.fromEntries(outputWithUpdatedImports);
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
		// generateZodSchemas,
		// (output) => specificZodValidators(output, specificZodFieldValidators),
		// (output) => filterOutEnumTypes(output),
		// filterOutIdTypeDeclarations,
	],
	customTypeMap: {
		"pg_catalog.numrange": {
			name: "NumRange",
			typeImports: [
				{
					name: "NumRange",
					path: "./types/api/Ranges",
					isAbsolute: false,
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
