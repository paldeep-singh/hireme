import Admin, { AdminId } from "shared/generated/db/hire_me/Admin.js";
import Company from "shared/generated/db/hire_me/Company.js";
import Requirement from "shared/generated/db/hire_me/Requirement.js";
import Role from "shared/generated/db/hire_me/Role.js";
import Session from "shared/generated/db/hire_me/Session.js";
import db from "../models/db.js";
import {
	generateAdminData,
	generateAdminSession,
	generateCompanyData,
	generateRequirementData,
	generateRoleData,
} from "./index.js";

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

export async function clearAdminTable(): Promise<void> {
	await db.none("TRUNCATE TABLE admin RESTART IDENTITY CASCADE");
}

export async function clearSessionTable(): Promise<void> {
	await db.none("TRUNCATE TABLE session");
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

export async function seedAdmin(
	emailOverride?: string,
): Promise<Admin & { password: string }> {
	const { email, password_hash, password } = await generateAdminData();

	const adminDetails = await db.one<Admin>(
		`
    INSERT INTO admin (email, password_hash) 
    VALUES ($1, $2) 
    RETURNING id, email, password_hash`,
		[emailOverride ?? email, password_hash],
	);

	return {
		...adminDetails,
		password,
	};
}

export async function seedAdminSession(
	adminId: AdminId,
	overrideExpiry?: Date,
): Promise<Session> {
	const { expiry, id } = generateAdminSession(adminId);

	const sessionDetails = await db.one<Session>(
		`
    INSERT INTO session (id, expiry, admin_id)
    VALUES ($1, $2, $3)
    RETURNING id, expiry, admin_id
    `,
		[id, overrideExpiry ?? expiry, adminId],
	);

	return sessionDetails;
}
