import { sql } from "kysely";
import { db } from "../db/database";
import { Admin, AdminId } from "../db/generated/hire_me/Admin";
import { Application } from "../db/generated/hire_me/Application";
import { Company, CompanyId } from "../db/generated/hire_me/Company";
import { Requirement } from "../db/generated/hire_me/Requirement";
import { Role, RoleId } from "../db/generated/hire_me/Role";
import { RoleLocation } from "../db/generated/hire_me/RoleLocation";
import { Salary } from "../db/generated/hire_me/Salary";
import { Session } from "../db/generated/hire_me/Session";
import {
	generateAdminData,
	generateAdminSession,
	generateApplicationData,
	generateCompanyData,
	generateRequirementData,
	generateRoleData,
	generateRoleLocationData,
	generateSalaryData,
} from "./generators";

export async function seedCompanies(count: number): Promise<Company[]> {
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

export async function seedRole(companyId: CompanyId): Promise<Role> {
	const roleData = generateRoleData(companyId);
	const role = await db
		.withSchema("hire_me")
		.insertInto("role")
		.values({
			...roleData,
			company_id: companyId,
		})
		.returningAll()
		.executeTakeFirstOrThrow();

	return role;
}

export async function seedRoleLocation(roleId: RoleId): Promise<RoleLocation> {
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

export async function seedApplication(roleId: RoleId): Promise<Application> {
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

export async function seedRequirement(roleId: number): Promise<Requirement> {
	const { bonus, description, role_id } = generateRequirementData(roleId);

	const requirement = db
		.withSchema("hire_me")
		.insertInto("requirement")
		.values({ bonus, description, role_id })
		.returningAll()
		.executeTakeFirstOrThrow();

	return requirement;
}

export async function seedSalary(roleId: RoleId): Promise<Salary> {
	const salaryData = generateSalaryData(roleId);

	const requirement = db
		.withSchema("hire_me")
		.insertInto("salary")
		.values(salaryData)
		.returningAll()
		.executeTakeFirstOrThrow();

	return requirement;
}

export async function seedAdmin(
	emailOverride?: string,
): Promise<Admin & { password: string }> {
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
): Promise<Session> {
	const { expiry, id } = generateAdminSession(adminId);

	const sessionDetails = db
		.withSchema("hire_me")
		.insertInto("session")
		.values({ expiry: overrideExpiry ?? expiry, id, admin_id: adminId })
		.returningAll()
		.executeTakeFirstOrThrow();

	return sessionDetails;
}
