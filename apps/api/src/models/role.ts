import Role, {
	RoleInitializer,
} from "@repo/api-types/generated/api/hire_me/Role";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { db } from "../db/database";

async function addRole({
	title,
	company_id,
	ad_url,
	notes,
}: RoleInitializer): Promise<Role> {
	try {
		const role = await db
			.withSchema("hire_me")
			.insertInto("role")
			.values({
				title,
				company_id,
				ad_url,
				notes,
			})
			.returning(["id", "ad_url", "company_id", "date_added", "notes", "title"])
			.executeTakeFirstOrThrow();

		return {
			...role,
			date_added: role.date_added.toISOString(),
		};
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getRolePreviews(): Promise<RolePreview[]> {
	try {
		const rolePreviews = await db
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

		return rolePreviews.map((rp) => ({
			...rp,
			date_submitted: rp.date_submitted?.toISOString() ?? null,
			date_added: rp.date_added.toISOString(),
		}));
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const roleModel = {
	addRole,
	getRolePreviews,
};
