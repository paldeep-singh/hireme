import DBAdmin, { AdminId } from "@repo/shared/generated/db/hire_me/Admin";
import DBApplication from "@repo/shared/generated/db/hire_me/Application";
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
import { sql } from "kysely";
import { db } from "../db/database";
import { CompanyId } from "../db/generated/hire_me/Company";

export async function seedCompanies(count: number) {
	const companydata = Array.from({ length: count }, () =>
		generateCompanyData(),
	);
	const companies = await Promise.all(
		companydata.map(({ name, notes, website }) =>
			db
				.withSchema("hire_me")
				.insertInto("company")
				.values([
					{
						name,
						notes,
						website,
					},
				])
				.returningAll()
				.executeTakeFirstOrThrow(),
		),
	);
	return companies;
}

export async function clearCompanyTable(): Promise<void> {
	await sql<void>`TRUNCATE TABLE hire_me.company RESTART IDENTITY CASCADE`.execute(
		db,
	);
}

export async function clearRoleTable(): Promise<void> {
	await sql<void>`TRUNCATE TABLE hire_me.role RESTART IDENTITY CASCADE`.execute(
		db,
	);
}

export async function clearAdminTable(): Promise<void> {
	await sql<void>`TRUNCATE TABLE hire_me.admin RESTART IDENTITY CASCADE`.execute(
		db,
	);
}

export async function clearSessionTable(): Promise<void> {
	await sql<void>`TRUNCATE TABLE hire_me.session`.execute(db);
}

export async function seedRole(companyId: CompanyId): Promise<DBRole> {
	const { title, ad_url, notes } = generateRoleData(companyId);
	const role = await db
		.withSchema("hire_me")
		.insertInto("role")
		.values({
			title,
			ad_url,
			notes,
			company_id: companyId,
		})
		.returningAll()
		.executeTakeFirstOrThrow();

	return role;
}

export async function seedRoleLocation(
	roleId: RoleId,
): Promise<DBRoleLocation> {
	const { hybrid, location, office_days, on_site, remote, role_id } =
		generateRoleLocationData(roleId);

	const roleLocation = await db
		.withSchema("hire_me")
		.insertInto("role_location")
		.values({ hybrid, location, office_days, on_site, remote, role_id })
		.returningAll()
		.executeTakeFirstOrThrow();

	return roleLocation;
}

export async function seedApplication(roleId: RoleId): Promise<DBApplication> {
	const { cover_letter, date_submitted, role_id } =
		generateApplicationData(roleId);

	const application = db
		.withSchema("hire_me")
		.insertInto("application")
		.values({ cover_letter, date_submitted, role_id })
		.returningAll()
		.executeTakeFirstOrThrow();

	return application;
}

export async function seedRequirement(roleId: number): Promise<DBRequirement> {
	const { bonus, description, role_id } = generateRequirementData(roleId);

	const requirement = db
		.withSchema("hire_me")
		.insertInto("requirement")
		.values({ bonus, description, role_id })
		.returningAll()
		.executeTakeFirstOrThrow();

	return requirement;
}

export async function seedAdmin(
	emailOverride?: string,
): Promise<DBAdmin & { password: string }> {
	const { email, password_hash, password } = await generateAdminData();

	const adminDetails = await db
		.withSchema("hire_me")
		.insertInto("admin")
		.values({ email: emailOverride ?? email, password_hash })
		.returningAll()
		.executeTakeFirstOrThrow();

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

	const sessionDetails = db
		.withSchema("hire_me")
		.insertInto("session")
		.values({ expiry: overrideExpiry ?? expiry, id, admin_id: adminId })
		.returningAll()
		.executeTakeFirstOrThrow();

	return sessionDetails;
}
