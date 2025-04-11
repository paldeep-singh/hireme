import { RoleInitializer } from "@repo/shared/generated/api/hire_me/Role";
import { RolePreview } from "@repo/shared/types/api/RolePreview";
import db from "../db/db";
import { addRole as addRoleQuery } from "./queries/role/AddRole.queries";
import { getRolePreviews as getRolePreviewsQuery } from "./queries/role/GetRolePreviews.queries";

async function addRole({ title, company_id, ad_url, notes }: RoleInitializer) {
	try {
		const role = await db.one(addRoleQuery, {
			company_id,
			title,
			notes,
			ad_url,
		});

		return role;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getRolePreviews(): Promise<RolePreview[]> {
	try {
		const rolePreviews = await db.any(getRolePreviewsQuery, undefined);

		return rolePreviews.map((rp) => ({
			...rp,
			date_submitted: rp.date_submitted?.toISOString() ?? null,
			date_added: rp.date_added.toISOString(),
		})) as RolePreview[];
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const roleModel = {
	addRole,
	getRolePreviews,
};
