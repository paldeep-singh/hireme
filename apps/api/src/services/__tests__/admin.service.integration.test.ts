import { faker } from "@faker-js/faker";
import { SessionId } from "@repo/api-types/generated/api/hire_me/Session";
import { addHours, subMinutes } from "date-fns";
import { db } from "../../db/database";
import {
	clearAdminTable,
	seedAdmin,
	seedAdminSession,
} from "../../testUtils/dbHelpers";
import { generateAdminSession } from "../../testUtils/generators";
import { expectError } from "../../testUtils/index";
import {
	AdminErrorCodes,
	adminService,
	InvalidSession,
} from "../admin.service";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

const now = faker.date.recent();

beforeAll(() => {
	vi.useFakeTimers();
	vi.setSystemTime(now);
});

afterEach(async () => {
	await clearAdminTable();
});

describe("login", () => {
	describe("when the admin exists", () => {
		describe("when the correct credentials are provided", () => {
			it("returns the session id and expiry", async () => {
				const admin = await seedAdmin();

				const { id, expiry } = await adminService.login(
					admin.email,
					admin.password,
				);

				expect(id).toBeDefined();
				expect(new Date(expiry).getTime()).not.toBeNaN();
			});

			it("stores the session in the database", async () => {
				const admin = await seedAdmin();

				const { id } = await adminService.login(admin.email, admin.password);

				const { id: fetchedId } = await db
					.withSchema("hire_me")
					.selectFrom("session")
					.where("admin_id", "=", admin.id)
					.select(["id"])
					.executeTakeFirstOrThrow();

				expect(fetchedId).toEqual(id);
			});

			it("sets the expiry to 2 hours from the current time", async () => {
				const admin = await seedAdmin();

				const { expiry } = await adminService.login(
					admin.email,
					admin.password,
				);

				expect(new Date(expiry).valueOf()).toEqual(addHours(now, 2).valueOf());
			});
		});

		describe("when the wrong password is provided", () => {
			it("throws an INVALID_USER error", async () => {
				const admin = await seedAdmin();
				try {
					await adminService.login(admin.email, faker.internet.password());
				} catch (error) {
					expectError(error, AdminErrorCodes.INVALID_USER);
				}
			});
		});
	});

	describe("when the admin does not exist", () => {
		it("throws an INVALID_USER error", async () => {
			try {
				await adminService.login(
					faker.internet.email(),
					faker.internet.password(),
				);
			} catch (error) {
				expectError(error, AdminErrorCodes.INVALID_USER);
			}
		});
	});
});

describe("validateSession", () => {
	describe("when the session exists", () => {
		describe("when the session has not expired", async () => {
			it("returns true", async () => {
				const admin = await seedAdmin();

				const { id, expiry } = generateAdminSession(admin.id);

				await db
					.withSchema("hire_me")
					.insertInto("session")
					.values({
						id,
						expiry,
						admin_id: admin.id,
					})
					.execute();

				const result = await adminService.validateSession(id);

				expect(result.valid).toBeTrue();
			});
		});
		describe("when the session has expired", () => {
			it("returns false with an EXPIRED_SESSION code", async () => {
				const admin = await seedAdmin();

				const { id } = generateAdminSession(admin.id);

				await db
					.withSchema("hire_me")
					.insertInto("session")
					.values({
						id,
						expiry: subMinutes(now, 1),
						admin_id: admin.id,
					})
					.execute();

				const result = await adminService.validateSession(id);

				expect(result.valid).toBeFalse();
				expect((result as InvalidSession).code).toEqual(
					AdminErrorCodes.EXPIRED_SESSION,
				);
			});

			it("deletes the session from the database", async () => {
				const admin = await seedAdmin();

				const { id } = generateAdminSession(admin.id);

				await db
					.withSchema("hire_me")
					.insertInto("session")
					.values({
						id,
						expiry: subMinutes(now, 1),
						admin_id: admin.id,
					})
					.execute();

				await adminService.validateSession(id);

				const sessionData = await db
					.withSchema("hire_me")
					.selectFrom("session")
					.where("id", "=", id)
					.selectAll()
					.execute();

				expect(sessionData.length).toBe(0);
			});
		});
	});

	describe("when the session does not exist", () => {
		it("returns false with INVALID_SESSION code", async () => {
			const result = await adminService.validateSession(
				faker.string.alphanumeric() as SessionId,
			);
			expect(result.valid).toBeFalse();
			expect((result as InvalidSession).code).toEqual(
				AdminErrorCodes.INVALID_SESSION,
			);
		});
	});
});

describe("clearSession", () => {
	describe("when the session exists", () => {
		it("deletes the session", async () => {
			const admin = await seedAdmin();
			const { id } = await seedAdminSession(admin.id);

			await adminService.clearSession(id);

			const sessionData = await db
				.withSchema("hire_me")
				.selectFrom("session")
				.where("id", "=", id)
				.selectAll()
				.execute();

			expect(sessionData.length).toBe(0);
		});
	});

	describe("when the session does not exist", () => {
		it("does not throw", async () => {
			const admin = await seedAdmin();
			const { id } = generateAdminSession(admin.id);

			expect(
				async () => await adminService.clearSession(id),
			).not.toThrowError();
		});
	});
});
