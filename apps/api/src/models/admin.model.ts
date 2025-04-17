import { db } from "../db/database";
import { Session, SessionId } from "../db/generated/hire_me/Session";

async function getAdminByEmail(email: string) {
	return await db
		.withSchema("hire_me")
		.selectFrom("admin")
		.where("email", "=", email)
		.selectAll()
		.executeTakeFirst();
}

async function addSession(sessionDetails: Session) {
	return await db
		.withSchema("hire_me")
		.insertInto("session")
		.values(sessionDetails)
		.returningAll()
		.executeTakeFirstOrThrow();
}

async function getSessionById(id: SessionId) {
	return await db
		.withSchema("hire_me")
		.selectFrom("session")
		.where("id", "=", id)
		.selectAll()
		.executeTakeFirst();
}

async function deleteSessionById(id: SessionId) {
	await db
		.withSchema("hire_me")
		.deleteFrom("session")
		.where("id", "=", id)
		.execute();
}

export const adminModel = {
	getAdminByEmail,
	addSession,
	getSessionById,
	deleteSessionById,
};
