// import db from "./models/db";

import { faker } from "@faker-js/faker";
import Company, { CompanyId } from "shared/generated/db/hire_me/Company.js";
import Role, { RoleId } from "shared/generated/db/hire_me/Role.js";
import RequirementMatchLevel from "shared/generated/db/hire_me/RequirementMatchLevel.js";
import Requirement from "shared/generated/db/hire_me/Requirement.js";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { AdminDetails, AdminSession } from "../models/admin.js";
import { addHours } from "date-fns";

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

export const getMockReq = (req: Partial<Request> = {}): Request => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...req,
  } as Request;
};

export const getMockRes = (): { res: Response; next: NextFunction } => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };

  const next: NextFunction = vi.fn();

  return { res: res as Response, next };
};

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

type AdminData = Omit<AdminDetails, "id"> & {
  password: string;
};

export async function generateAdminData(): Promise<AdminData> {
  const password = faker.internet.password();
  const password_hash = await bcrypt.hash(password, 10);

  return {
    email: faker.internet.email(),
    password_hash,
    password,
  };
}

export type AdminSessionData = Omit<AdminSession, "id"> & {
  session_token: string;
};

export async function generateAdminSession(): Promise<AdminSessionData> {
  const session_token = faker.string.alphanumeric(12);
  const session_token_hash = await bcrypt.hash(session_token, 10);

  return {
    session_token,
    session_token_hash,
    session_expiry: addHours(new Date(), 2),
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
