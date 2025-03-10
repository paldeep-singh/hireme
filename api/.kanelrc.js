/* eslint-disable @typescript-eslint/no-require-imports */
const { generateZodSchemas } = require("kanel-zod");

/** @type {import('kanel').Config} */
module.exports = {
  connection: {
    host: "localhost",
    user: "test_user",
    password: "",
    database: "hire_me_test_db",
  },
  schemas: ["hire_me"],
  enumStyle: "type",
  preDeleteOutputFolder: true,
  outputPath: "./generatedTypes",
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
