/** @type {import('kanel').PreRenderHook} */
const addDBPrefixtoTypes = async (outputAcc) => {
	for (const [_, file] of Object.entries(outputAcc)) {
		file.declarations = file.declarations.map((decl) => {
			if (decl.declarationType === "interface") {
				return {
					...decl,
					// Add prefix to interface names
					name: `DB${decl.name}`,
				};
			}

			return decl;
		});
	}

	return outputAcc;
};

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
	outputPath: "./generated/db/",
	preRenderHooks: [addDBPrefixtoTypes],
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
			name: "IPostgresInterval",
			typeImports: [
				{
					name: "IPostgresInterval",
					path: "postgres-interval",
					isAbsolute: true,
					isDefault: false,
				},
			],
		},
	},
};
