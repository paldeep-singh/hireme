import { db } from "../db/database";
import { NewRole, RoleId } from "../db/generated/hire_me/Role";
import { NewRoleLocation } from "../db/generated/hire_me/RoleLocation";

async function addRole(role: NewRole) {
	return await db
		.withSchema("hire_me")
		.insertInto("role")
		.values(role)
		.returningAll()
		.executeTakeFirstOrThrow();
}

async function getRolePreviews() {
	return await db
		.withSchema("hire_me")
		.selectFrom("role")
		.innerJoin("company", "role.company_id", "company.id")
		.leftJoin("role_location", "role_location.role_id", "role.id")
		.leftJoin("application", "role.id", "application.role_id")
		.select([
			"role.id",
			"role.company_id",
			"role.title",
			"role.ad_url",
			"role.notes",
			"role.date_added",
			"company.name as company",
			"role_location.location",
			"application.date_submitted",
		])
		.execute();
}

async function getRoleDetails(id: RoleId) {
	const details = await db
		.withSchema("hire_me")
		.selectFrom("role")
		.where("role.id", "=", id)
		.innerJoin("company", "role.company_id", "company.id")
		.leftJoin("role_location", "role_location.role_id", "role.id")
		.leftJoin("application", "role.id", "application.role_id")
		.leftJoin("contract", "role.id", "contract.role_id")
		.selectAll("role")
		.select([
			"company.name as company_name",
			"company.notes as company_notes",
			"company.website as company_website",
		])
		.select([
			"role_location.id as location_id",
			"role_location.hybrid as location_hybrid",
			"role_location.location as location_name",
			"role_location.office_days as location_office_days",
			"role_location.on_site as location_on_site",
			"role_location.remote as location_remote",
		])
		.select([
			"application.id as application_id",
			"application.date_submitted as application_date_submitted",
			"application.cover_letter as application_cover_letter",
		])
		.select([
			"contract.id as contract_id",
			"contract.salary_currency as contract_currency",
			"contract.salary_includes_super as contract_includes_super",
			"contract.salary_period as contract_salary_period",
			"contract.salary_range as contract_salary_range",
			"contract.term as contract_term",
			"contract.type as contract_type",
		])
		.executeTakeFirstOrThrow();

	const requirements = await db
		.withSchema("hire_me")
		.selectFrom("requirement")
		.select(["id", "bonus", "description"])
		.where("role_id", "=", id)
		.execute();

	return {
		...details,
		requirements,
	};
}

async function addRoleLocation(location: NewRoleLocation) {
	return await db
		.withSchema("hire_me")
		.insertInto("role_location")
		.values(location)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export const roleModel = {
	addRole,
	getRolePreviews,
	getRoleDetails,
	addRoleLocation,
};
