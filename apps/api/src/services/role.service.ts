import Role from "@repo/api-types/generated/api/hire_me/Role";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { NewRole } from "../db/generated/hire_me/Role";
import { roleModel } from "../models/role.model";

async function addRole(role: NewRole): Promise<Role> {
	const newRole = await roleModel.addRole(role);

	return {
		...newRole,
		date_added: newRole.date_added.toISOString(),
	};
}

async function getRolePreviews(): Promise<RolePreview[]> {
	const rolePreviews = await roleModel.getRolePreviews();

	return rolePreviews.map((rp) => ({
		...rp,
		date_submitted: rp.date_submitted?.toISOString() ?? null,
		date_added: rp.date_added.toISOString(),
	}));
}

export const roleService = {
	addRole,
	getRolePreviews,
};
