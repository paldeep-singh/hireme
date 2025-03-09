import { faker } from "@faker-js/faker";
import Company from "../../generatedTypes/hire_me/Company";
import Role from "../../generatedTypes/hire_me/Role";
import db from "../models/db";
import { generateRequirementData, generateRoleData } from ".";
import Requirement from "../../generatedTypes/hire_me/Requirement";
import { ApplicationPreview } from "../models/applicationPreview";

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

export async function seedRequirement(roleId: number): Promise<Requirement> {
  const { bonus, description, match_justification, match_level, role_id } =
    generateRequirementData(roleId);

  const requirement = await db.one<Requirement>(
    `INSERT INTO requirement (role_id, bonus, match_justification, match_level, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, role_id, bonus, match_justification, match_level, description`,
    [role_id, bonus, match_justification, match_level, description],
  );
  return requirement;
}

export async function seedApplications(
  count: number,
): Promise<ApplicationPreview[]> {
  const companies = await seedCompanies(count);
  const roles = await Promise.all(
    companies.map(({ id }) => seedRole({ companyId: id, hasAdUrl: true })),
  );

  const appPreviews = roles.map(({ id, ...rest }, index) => ({
    role_id: id,
    ...rest,
    company: companies[index].name,
  }));

  return appPreviews;
}
