import DBAdmin, { AdminId } from "@repo/shared/generated/db/hire_me/Admin";
import DBApplication from "@repo/shared/generated/db/hire_me/Application";
import DBCompany from "@repo/shared/generated/db/hire_me/Company";
import DBRequirement from "@repo/shared/generated/db/hire_me/Requirement";
import DBRole, { RoleId } from "@repo/shared/generated/db/hire_me/Role";
import DBRoleLocation from "@repo/shared/generated/db/hire_me/RoleLocation";
import DBSession from "@repo/shared/generated/db/hire_me/Session";
import {
	generateAdminData,
	generateAdminSession,
	generateApplicationData,
	generateCompanyData,
	generateRequirementData,
	generateRoleData,
	generateRoleLocationData,
} from "@repo/shared/testHelpers/generators";
import testDb from "./testDb";

export async function seedCompanies(count: number): Promise<DBCompany[]> {
	const companydata = Array.from({ length: count }, () =>
		generateCompanyData(),
	);
	const companies = await Promise.all(
		companydata.map(({ name, notes, website }) =>
			testDb.one(
				"INSERT INTO company (name, notes, website) VALUES ($1, $2, $3) RETURNING id, name, notes, website",
				[name, notes, website],
			),
		),
	);
	return companies;
}

export async function clearCompanyTable(): Promise<void> {
	await testDb.none("TRUNCATE TABLE company RESTART IDENTITY CASCADE");
}

export async function clearRoleTable(): Promise<void> {
	await testDb.none("TRUNCATE TABLE role RESTART IDENTITY CASCADE");
}

export async function clearAdminTable(): Promise<void> {
	await testDb.none("TRUNCATE TABLE admin RESTART IDENTITY CASCADE");
}

export async function clearSessionTable(): Promise<void> {
	await testDb.none("TRUNCATE TABLE session");
}

export async function seedRole(companyId: number): Promise<DBRole> {
	const { title, ad_url, notes } = generateRoleData(companyId);
	const role = await testDb.one<DBRole>(
		`INSERT INTO role (company_id, title, notes, ad_url) VALUES ($1, $2, $3, $4) 
      RETURNING id, company_id, title, notes, ad_url, date_added`,
		[companyId, title, notes ?? null, ad_url ?? null],
	);

	return role;
}

export async function seedRoleLocation(
	roleId: RoleId,
): Promise<DBRoleLocation> {
	const { hybrid, location, office_days, on_site, remote, role_id } =
		generateRoleLocationData(roleId);

	const roleLocation = await testDb.one<DBRoleLocation>(
		`INSERT INTO role_location (role_id, location, hybrid, remote, on_site, office_days)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, role_id, location, hybrid, remote, on_site, office_days
		`,
		[role_id, location, hybrid, remote, on_site, office_days],
	);

	return roleLocation;
}

export async function seedApplication(roleId: RoleId): Promise<DBApplication> {
	const { cover_letter, date_submitted, role_id } =
		generateApplicationData(roleId);

	const application = await testDb.one<DBApplication>(
		`INSERT INTO application (cover_letter, date_submitted, role_id)
		VALUES ($1, $2, $3)
		RETURNING id, cover_letter, date_submitted, role_id`,
		[cover_letter, date_submitted, role_id],
	);

	return application;
}

export async function seedRequirement(roleId: number): Promise<DBRequirement> {
	const { bonus, description, role_id } = generateRequirementData(roleId);

	const requirement = await testDb.one<DBRequirement>(
		`INSERT INTO requirement (role_id, bonus, description)
            VALUES ($1, $2, $3)
            RETURNING id, role_id, bonus, description`,
		[role_id, bonus, description],
	);
	return requirement;
}

export async function seedAdmin(
	emailOverride?: string,
): Promise<DBAdmin & { password: string }> {
	const { email, password_hash, password } = await generateAdminData();

	const adminDetails = await testDb.one<DBAdmin>(
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
): Promise<DBSession> {
	const { expiry, id } = generateAdminSession(adminId);

	const sessionDetails = await testDb.one<DBSession>(
		`
    INSERT INTO session (id, expiry, admin_id)
    VALUES ($1, $2, $3)
    RETURNING id, expiry, admin_id
    `,
		[id, overrideExpiry ?? expiry, adminId],
	);

	return sessionDetails;
}
