// import db from "./models/db";

import { faker } from "@faker-js/faker";
import Company, { CompanyId } from "shared/generated/db/hire_me/Company";
import Role, { RoleId } from "shared/generated/db/hire_me/Role";
import RequirementMatchLevel from "shared/generated/db/hire_me/RequirementMatchLevel";
import Requirement from "shared/generated/db/hire_me/Requirement";

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

export function generateCompanyData(): Omit<Company, "id"> {
  return {
    name: faker.company.name(),
    notes: faker.lorem.sentences(),
    website: faker.internet.url(),
  };
}

export function generateRoleData(companyId: number): Omit<Role, "id"> {
  return {
    title: faker.person.jobTitle(),
    ad_url: faker.internet.url(),
    company_id: companyId as CompanyId,
    notes: faker.lorem.sentences(),
  };
}

export function getRandomMatchLevel(): RequirementMatchLevel {
  return faker.helpers.arrayElement<RequirementMatchLevel>([
    "exceeded",
    "met",
    "room_for_growth",
  ]);
}

export function generateRequirementData(
  roleId: number,
): Omit<Requirement, "id"> {
  return {
    description: faker.lorem.sentence(),
    bonus: faker.datatype.boolean(),
    role_id: roleId as RoleId,
  };
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
