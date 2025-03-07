// import db from "./models/db";

import { faker } from "@faker-js/faker";
import db from "./models/db";
import Company from "../generatedTypes/hire_me/Company";

export function expectError(
  maybeError: unknown,
  expectedErrorMessage: string,
): void {
  if (maybeError instanceof Error) {
    return expect(maybeError.message).toContain(expectedErrorMessage);
  } else {
    throw new Error(`Expected error, got ${maybeError}`);
  }
}

export async function seedCompanies(count: number): Promise<Company[]> {
  const companyNames = Array.from({ length: count }, () =>
    faker.company.name(),
  );
  const companies = await Promise.all(
    companyNames.map((name) =>
      db.one("INSERT INTO company (name) VALUES ($1) RETURNING id, name", [
        name,
      ]),
    ),
  );
  return companies;
}

export async function clearCompanyTable(): Promise<void> {
  await db.none("TRUNCATE TABLE company RESTART IDENTITY CASCADE");
}

// export async function clearAllTables() {
//   try {
//     // Step 1: Retrieve all table names from the 'public' schema
//     const tables = await db.any(`
//             SELECT tablename
//             FROM pg_tables
//             WHERE schemaname = 'hire_me'
//         `);

//     // Step 2: Generate the TRUNCATE command for each table
//     const truncateQueries = tables.map(
//       (table) => `TRUNCATE TABLE "${table.tablename}" CASCADE`,
//     );

//     // Step 3: Execute all TRUNCATE commands in a single transaction
//     await db.tx(async (t) => {
//       for (const query of truncateQueries) {
//         await t.none(query); // Execute each truncate command
//       }
//     });
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error("Error truncating tables:", error);
//   }
// }
