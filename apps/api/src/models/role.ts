import { RoleInitializer } from "@repo/shared/generated/api/hire_me/Role";
import DBRole from "@repo/shared/generated/db/hire_me/Role";
import { RolePreview } from "@repo/shared/types/rolePreview";
import db from "./db";

async function addRole({ title, company_id, ad_url, notes }: RoleInitializer) {
	try {
		const role = await db.one<DBRole>(
			`INSERT INTO role (company_id, title, notes, ad_url) VALUES ($1, $2, $3, $4) 
      RETURNING id, company_id, title, notes, ad_url, date_added`,
			[company_id, title, notes, ad_url ?? null],
		);

		return role;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getRolePreviews(): Promise<RolePreview[]> {
	try {
		const rolePreviews = await db.manyOrNone<RolePreview>(
			`SELECT r.id, r.company_id, r.title, r.ad_url, r.notes, r.date_added, c.name AS company, rl.location, a.date_submitted
         FROM role r
         JOIN company c ON r.company_id = c.id
  		 LEFT JOIN role_location rl ON rl.role_id = r.id
  		 LEFT JOIN application a ON a.role_id = r.id;`,
		);

		return rolePreviews;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const roleModel = {
	addRole,
	getRolePreviews,
};
