import { CompanyId } from "@repo/shared/generated/api/hire_me/Company";
import Role, {
	RoleId,
	RoleInitializer,
} from "@repo/shared/generated/api/hire_me/Role";
import { RolePreview } from "@repo/shared/types/api/RolePreview";
import dbTyped from "../db/dbTyped";
import { addRole as addRoleQuery } from "./queries/role/AddRole.queries";
import { getRolePreviews as getRolePreviewsQuery } from "./queries/role/GetRolePreviews.queries";

async function addRole({
	title,
	company_id,
	ad_url,
	notes,
}: RoleInitializer): Promise<Role> {
	try {
		const role = await dbTyped.one(addRoleQuery, {
			company_id,
			title,
			notes,
			ad_url,
		});

		return {
			...role,
			id: role.id as RoleId,
			company_id: role.company_id as CompanyId,
			date_added: role.date_added.toISOString(),
		};
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getRolePreviews(): Promise<RolePreview[]> {
	try {
		const rolePreviews = await dbTyped.any(getRolePreviewsQuery, undefined);

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
