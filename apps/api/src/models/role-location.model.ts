import { db } from "../db/database";
import {
	NewRoleLocation,
	RoleLocationId,
	RoleLocationUpdate,
} from "../db/generated/hire_me/RoleLocation";

async function addRoleLocation(location: NewRoleLocation) {
	return await db
		.withSchema("hire_me")
		.insertInto("role_location")
		.values(location)
		.returningAll()
		.executeTakeFirstOrThrow();
}

async function updateRoleLocation(
	updates: RoleLocationUpdate,
	id: RoleLocationId,
) {
	return await db
		.withSchema("hire_me")
		.updateTable("role_location")
		.set(updates)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export const roleLocationModel = {
	addRoleLocation,
	updateRoleLocation,
};
