import Role from "@repo/api-types/generated/api/hire_me/Role";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { NewRole } from "../db/generated/hire_me/Role";
import { roleModel } from "../models/role.model";

async function addRole(role: NewRole): Promise<Role> {
	try {
		const newRole = await roleModel.addRole(role);

		if (!newRole) {
			throw new Error("no data");
		}

		return {
			...newRole,
			date_added: newRole.date_added.toISOString(),
		};
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getRolePreviews(): Promise<RolePreview[]> {
	try {
		const rolePreviews = await roleModel.getRolePreviews();

		return rolePreviews.map((rp) => ({
			...rp,
			date_submitted: rp.date_submitted?.toISOString() ?? null,
			date_added: rp.date_added.toISOString(),
		}));
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const roleService = {
	addRole,
	getRolePreviews,
};
