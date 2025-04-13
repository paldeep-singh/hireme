import { faker } from "@faker-js/faker";
import { SessionId } from "@repo/shared/generated/api/hire_me/Session";
import { addHours, subMinutes } from "date-fns";
import {
	clearAdminTable,
	seedAdmin,
	seedAdminSession,
} from "../../testUtils/dbHelpers";
import { generateAdminSession } from "../../testUtils/generators";
import { expectError } from "../../testUtils/index";
import testDb from "../../testUtils/testDb";
import { AdminErrorCodes, adminModel, InvalidSession } from "../admin";

afterAll(async () => {
	await testDb.$pool.end(); // Close the pool after each test file
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

				const { id, expiry } = await adminModel.login(
					admin.email,
					admin.password,
				);

				expect(id).toBeDefined();
				expect(new Date(expiry).getTime()).not.toBeNaN();
			});

			it("stores the session in the database", async () => {
				const admin = await seedAdmin();

				const { id } = await adminModel.login(admin.email, admin.password);

				const { id: fetchedId } = await testDb.one<{ id: SessionId }>(
					`SELECT id 
           			FROM session
           			WHERE admin_id = $1`,
					[admin.id],
				);

				expect(fetchedId).toEqual(id);
			});

			it("sets the expiry to 2 hours from the current time", async () => {
				const admin = await seedAdmin();

				const { expiry } = await adminModel.login(admin.email, admin.password);

				expect(new Date(expiry).valueOf()).toEqual(addHours(now, 2).valueOf());
			});
		});

		describe("when the wrong password is provided", () => {
			it("throws an INVALID_USER error", async () => {
				const admin = await seedAdmin();
				try {
					await adminModel.login(admin.email, faker.internet.password());
				} catch (error) {
					expectError(error, AdminErrorCodes.INVALID_USER);
				}
			});
		});
	});

	describe("when the admin does not exist", () => {
		it("throws an INVALID_USER error", async () => {
			try {
				await adminModel.login(
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

				await testDb.none(
					`
          INSERT INTO session 
          (id, expiry, admin_id)
          VALUES ($1, $2, $3)`,
					[id, expiry, admin.id],
				);

				const result = await adminModel.validateSession(id);

				expect(result.valid).toBeTrue();
			});
		});
		describe("when the session has expired", () => {
			it("returns false with an EXPIRED_SESSION code", async () => {
				const admin = await seedAdmin();

				const { id } = generateAdminSession(admin.id);

				await testDb.none(
					`
          INSERT INTO session 
          (id, expiry, admin_id)
          VALUES ($1, $2, $3)`,
					[id, subMinutes(now, 1), admin.id],
				);

				const result = await adminModel.validateSession(id);

				expect(result.valid).toBeFalse();
				expect((result as InvalidSession).code).toEqual(
					AdminErrorCodes.EXPIRED_SESSION,
				);
			});
		});
	});

	describe("when the session does not exist", () => {
		it("returns false with INVALID_SESSION code", async () => {
			const result = await adminModel.validateSession(
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

			await adminModel.clearSession(id);

			const sessionData = await testDb.manyOrNone(
				`SELECT id
         FROM session
         WHERE id = $1`,
				[id],
			);

			expect(sessionData.length).toBe(0);
		});
	});

	describe("when the session does not exist", () => {
		it("does not throw", async () => {
			const admin = await seedAdmin();
			const { id } = generateAdminSession(admin.id);

			expect(async () => await adminModel.clearSession(id)).not.toThrowError();
		});
	});
});
