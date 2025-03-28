import { faker } from "@faker-js/faker";
import { addHours, subMinutes } from "date-fns";
import { SessionId } from "shared/generated/db/hire_me/Session.js";
import {
	clearAdminTable,
	seedAdmin,
	seedAdminSession,
} from "../../testUtils/dbHelpers.js";
import {
	expectError,
	generateAdminData,
	generateAdminSession,
} from "../../testUtils/index.js";
import { AdminErrorCodes, adminModel, InvalidSession } from "../admin.js";
import db from "../db.js";

afterAll(async () => {
	await db.$pool.end(); // Close the pool after each test file
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
				expect(expiry).toBeInstanceOf(Date);
			});

			it("stores the session in the database", async () => {
				const admin = await seedAdmin();

				const { id } = await adminModel.login(admin.email, admin.password);

				const { id: fetchedId } = await db.one<{ id: SessionId }>(
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

				expect(expiry.valueOf()).toEqual(addHours(now, 2).valueOf());
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

	describe("when multiple admins with the same email exist", () => {
		it("throws an MULTIPLER_USERS error", async () => {
			const { email, password } = await generateAdminData();
			await seedAdmin(email);
			await seedAdmin(email);

			try {
				await adminModel.login(email, password);
			} catch (error) {
				expectError(error, AdminErrorCodes.MULTIPLE_USERS);
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

				await db.none(
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

				await db.none(
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

			const sessionData = await db.manyOrNone(
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
