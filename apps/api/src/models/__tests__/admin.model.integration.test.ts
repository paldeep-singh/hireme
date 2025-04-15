import { db } from "../../db/database";
import {
	clearAdminTable,
	seedAdmin,
	seedAdminSession,
} from "../../testUtils/dbHelpers";
import { generateAdminSession } from "../../testUtils/generators";
import { adminModel } from "../admin.model";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

afterEach(async () => {
	await clearAdminTable();
});

describe("getAdminByEmail", () => {
	it("returns the admin details", async () => {
		const { password: _, ...admin } = await seedAdmin();

		const fetchedAdmin = await adminModel.getAdminByEmail(admin.email);

		expect(fetchedAdmin).toEqual(admin);
	});
});

describe("addSession", () => {
	it("adds a new session to the database", async () => {
		const admin = await seedAdmin();

		const sessionDetails = generateAdminSession(admin.id);

		await adminModel.addSession(sessionDetails);

		const fetchedSession = await db
			.withSchema("hire_me")
			.selectFrom("session")
			.where("id", "=", sessionDetails.id)
			.selectAll()
			.executeTakeFirstOrThrow();

		expect(fetchedSession).toEqual(sessionDetails);
	});

	it("returns the session details", async () => {
		const admin = await seedAdmin();

		const sessionDetails = generateAdminSession(admin.id);

		const fetchedSession = await adminModel.addSession(sessionDetails);

		expect(fetchedSession).toEqual(sessionDetails);
	});
});

describe("getSessionById", () => {
	it("returns the session details", async () => {
		const admin = await seedAdmin();

		const session = await seedAdminSession(admin.id);

		const fetchedSession = await adminModel.getSessionById(session.id);

		expect(fetchedSession).toEqual(session);
	});
});

describe("deleteSessionById", () => {
	it("deletes the session from the database", async () => {
		const admin = await seedAdmin();

		const session = await seedAdminSession(admin.id);

		await adminModel.deleteSessionById(session.id);

		const fetchedSession = await db
			.withSchema("hire_me")
			.selectFrom("session")
			.where("id", "=", session.id)
			.selectAll()
			.executeTakeFirst();

		expect(fetchedSession).toBeUndefined();
	});
});
