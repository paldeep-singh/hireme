const config = {
	transforms: [
		{
			mode: "sql",
			include: "**/*.sql",
			emitTemplate: "{{dir}}/{{name}}.queries.ts",
		},
	],
	srcDir: "./src/",
	failOnError: true,
	db: {
		host: "localhost",
		port: 5432,
		user: "test_user",
		dbName: "hire_me_test_db",
	},
	typesOverrides: {
		numrange: "./src/db/types#NumRange",
		interval: "postgres-interval#IPostgresInterval",
	},
};

module.exports = config;
