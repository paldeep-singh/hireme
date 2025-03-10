/* eslint-disable @typescript-eslint/no-require-imports */
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
        years: z.number().optional(),
        months: z.number().optional(),
        days: z.number().optional(),
        hours: z.number().optional(),
        minutes: z.number().optional(), 
        seconds: z.number().optional(),
        milliseconds: z.number().optional()})`,
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
