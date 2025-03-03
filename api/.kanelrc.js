const path = require("path");

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
};
