// import db from "./models/db";

import { faker } from "@faker-js/faker";
import db from "./models/db";
import Company, { CompanyId } from "../generatedTypes/hire_me/Company";
import Role, { RoleInitializer } from "../generatedTypes/hire_me/Role";

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

export async function clearRoleTable(): Promise<void> {
  await db.none("TRUNCATE TABLE role RESTART IDENTITY CASCADE");
}

export function generateRoleData({
  companyId,
  hasAdUrl,
}: {
  companyId: number;
  hasAdUrl: boolean;
}): RoleInitializer {
  return {
    title: faker.person.jobTitle(),
    cover_letter: faker.lorem.paragraph(),
    ad_url: hasAdUrl ? faker.internet.url() : undefined,
    company_id: companyId as CompanyId,
  };
}

export async function seedRole({
  companyId,
  hasAdUrl,
}: Parameters<typeof generateRoleData>[0]): Promise<Role> {
  const { cover_letter, title, ad_url } = generateRoleData({
    companyId,
    hasAdUrl,
  });
  const role = await db.one<Role>(
    `INSERT INTO role (company_id, title, cover_letter, ad_url) VALUES ($1, $2, $3, $4) 
      RETURNING id, company_id, title, cover_letter, ad_url`,
    [companyId, title, cover_letter, ad_url ?? null],
  );

  return role;
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
