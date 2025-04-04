import Admin, { AdminId } from "@repo/shared/generated/db/Admin";
import Application from "@repo/shared/generated/db/Application";
import Company from "@repo/shared/generated/db/Company";
import Requirement from "@repo/shared/generated/db/Requirement";
import Role, { RoleId } from "@repo/shared/generated/db/Role";
import RoleLocation from "@repo/shared/generated/db/RoleLocation";
import Session from "@repo/shared/generated/db/Session";
import {
	generateAdminData,
	generateAdminSession,
	generateApplicationData,
	generateCompanyData,
	generateRequirementData,
	generateRoleData,
	generateRoleLocationData,
} from "@repo/shared/testHelpers/generators";
import db from "../models/db";

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
      RETURNING id, company_id, title, notes, ad_url, date_added`,
		[companyId, title, notes ?? null, ad_url ?? null],
	);

	return role;
}

export async function seedRoleLocation(roleId: RoleId): Promise<RoleLocation> {
	const { hybrid, location, office_days, on_site, remote, role_id } =
		generateRoleLocationData(roleId);

	const roleLocation = await db.one<RoleLocation>(
		`INSERT INTO role_location (role_id, location, hybrid, remote, on_site, office_days)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, role_id, location, hybrid, remote, on_site, office_days
		`,
		[role_id, location, hybrid, remote, on_site, office_days],
	);

	return roleLocation;
}

export async function seedApplication(roleId: RoleId): Promise<Application> {
	const { cover_letter, date_submitted, role_id, submitted } =
		generateApplicationData(roleId);

	const application = await db.one<Application>(
		`INSERT INTO application (cover_letter, date_submitted, role_id, submitted)
		VALUES ($1, $2, $3, $4)
		RETURNING id, cover_letter, date_submitted, role_id, submitted`,
		[cover_letter, date_submitted, role_id, submitted],
	);

	return application;
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
