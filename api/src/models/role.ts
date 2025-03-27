import Role, { RoleInitializer } from "shared/generated/db/hire_me/Role.js";
import { RolePreview } from "shared/types/rolePreview.js";
import db from "./db.js";

async function addRole({ title, company_id, ad_url, notes }: RoleInitializer) {
	try {
		const role = await db.one<Role>(
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
			`SELECT r.id, r.company_id, r.title, r.ad_url, r.notes, c.name AS company
         FROM role r, company c
         WHERE r.company_id = c.id`,
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
