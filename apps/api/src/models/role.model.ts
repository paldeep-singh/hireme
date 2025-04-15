import { db } from "../db/database";
import { NewRole } from "../db/generated/hire_me/Role";

async function addRole(role: NewRole) {
	return await db
		.withSchema("hire_me")
		.insertInto("role")
		.values(role)
		.returningAll()
		.executeTakeFirst();
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

export const roleModel = {
	addRole,
	getRolePreviews,
};
