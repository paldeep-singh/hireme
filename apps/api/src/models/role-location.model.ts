import { db } from "../db/database";
import { NewRoleLocation } from "../db/generated/hire_me/RoleLocation";

async function addRoleLocation(location: NewRoleLocation) {
	return await db
		.withSchema("hire_me")
		.insertInto("role_location")
		.values(location)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export const roleLocationModel = {
	addRoleLocation,
};
