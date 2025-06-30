import { db } from "../db/database";
import {
	ApplicationId,
	ApplicationUpdate,
	NewApplication,
} from "../db/generated/hire_me/Application";

async function addApplication(appDetails: NewApplication) {
	return await db
		.withSchema("hire_me")
		.insertInto("application")
		.values(appDetails)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export type ApplicationUpdateArgs = ApplicationUpdate & { id: ApplicationId };

async function updateApplication({ id, ...updates }: ApplicationUpdateArgs) {
	return await db
		.withSchema("hire_me")
		.updateTable("application")
		.set(updates)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export const applicationModel = {
	addApplication,
	updateApplication,
};
