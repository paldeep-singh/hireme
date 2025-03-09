// import db from "./models/db";

import { faker } from "@faker-js/faker";
import { CompanyId } from "../../generatedTypes/hire_me/Company";
import { RoleId, RoleInitializer } from "../../generatedTypes/hire_me/Role";
import RequirementMatchLevel from "../../generatedTypes/hire_me/RequirementMatchLevel";
import { RequirementInitializer } from "../../generatedTypes/hire_me/Requirement";
import { ApplicationPreview } from "../models/applicationPreview";

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

export function getRandomMatchLevel(): RequirementMatchLevel {
  return faker.helpers.arrayElement<RequirementMatchLevel>([
    "exceeded",
    "met",
    "room_for_growth",
  ]);
}

export function generateRequirementData(
  roleId: number,
): RequirementInitializer {
  return {
    description: faker.lorem.sentence(),
    match_level: getRandomMatchLevel(),
    match_justification: faker.lorem.sentence(),
    bonus: faker.datatype.boolean(),
    role_id: roleId as RoleId,
  };
}

export function generateApplicationPreview(): ApplicationPreview {
  const company = {
    id: faker.number.int({ max: 100 }) as CompanyId,
    name: faker.company.name(),
  };

  const { company_id, cover_letter, title, ad_url } = generateRoleData({
    companyId: company.id,
    hasAdUrl: true,
  });

  return {
    ad_url: ad_url ?? null,
    company_id,
    company: company.name,
    cover_letter,
    title,
    role_id: faker.number.int({ max: 100 }) as RoleId,
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
