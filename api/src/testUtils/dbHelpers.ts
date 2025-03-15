import Company from "shared/generated/hire_me/Company";
import Role from "shared/generated/hire_me/Role";
import db from "../models/db";
import {
  generateCompanyData,
  generateRequirementData,
  generateRoleData,
} from ".";
import Requirement from "shared/generated/hire_me/Requirement";

export async function seedCompanies(count: number): Promise<Company[]> {
  const companydata = Array.from({ length: count }, () =>
    generateCompanyData(),
  );
  const companies = await Promise.all(
    companydata.map(({ name, notes, website }) =>
      db.one(
        "INSERT INTO company (name, notes, website) VALUES ($1, $2, $3) RETURNING id, name, notes, website",
        [name, notes, website],
      ),
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

export async function seedRole(companyId: number): Promise<Role> {
  const { title, ad_url, notes } = generateRoleData(companyId);
  const role = await db.one<Role>(
    `INSERT INTO role (company_id, title, notes, ad_url) VALUES ($1, $2, $3, $4) 
      RETURNING id, company_id, title, notes, ad_url`,
    [companyId, title, notes ?? null, ad_url ?? null],
  );

  return role;
}

export async function seedRequirement(roleId: number): Promise<Requirement> {
  const { bonus, description, role_id } = generateRequirementData(roleId);

  const requirement = await db.one<Requirement>(
    `INSERT INTO requirement (role_id, bonus, description)
            VALUES ($1, $2, $3)
            RETURNING id, role_id, bonus, description`,
    [role_id, bonus, description],
  );
  return requirement;
}
