import { faker } from "@faker-js/faker/.";
import Company from "../../generatedTypes/hire_me/Company";
import Role from "../../generatedTypes/hire_me/Role";
import db from "../models/db";
import { generateRoleData } from ".";

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
