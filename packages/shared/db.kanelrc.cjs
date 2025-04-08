/** @type {import('kanel').PreRenderHook} */
const addDBPrefixtoTypes = async (outputAcc) => {
	for (const [_, file] of Object.entries(outputAcc)) {
		file.declarations = file.declarations.map((decl) => {
			// Add DB prefix to ID type declarations
			if (decl.declarationType === "typeDeclaration") {
				return {
					...decl,
					name: `DB${decl.name}`, // Add prefix here
				};
			}

			if (decl.declarationType === "interface") {
				return {
					...decl,
					// Add prefix to interface names
					name: `DB${decl.name}`,
					properties: decl.properties.map((p) => {
						const updatedTypeImports = p.typeImports?.map((imp) => {
							// Update ID type imports with prefix
							if (imp.name.endsWith("Id")) {
								return {
									...imp,
									name: `DB${imp.name}`,
								};
							}

							return imp;
						});
						// Update ID type names and imports with prefix
						return p.name === "id" || p.name.endsWith("_id")
							? {
									...p,
									typeName: `DB${p.typeName}`,
									typeImports: updatedTypeImports,
								}
							: {
									...p,
									typeImports: updatedTypeImports,
								};
					}),
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
