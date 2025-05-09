import { db } from "../db/database";
import { NewApplication } from "../db/generated/hire_me/Application";

async function addApplication(appDetails: NewApplication) {
	return await db
		.withSchema("hire_me")
		.insertInto("application")
		.values(appDetails)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export const applicationModel = {
	addApplication,
};
