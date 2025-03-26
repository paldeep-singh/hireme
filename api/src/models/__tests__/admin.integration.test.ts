/* eslint-disable vitest/no-commented-out-tests */
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
			it("returns the session id", async () => {
				const admin = await seedAdmin();

				const id = await adminModel.login(admin.email, admin.password);

				expect(id).toBeDefined();
			});

			it("stores the session id in the database", async () => {
				const admin = await seedAdmin();

				const sessionId = await adminModel.login(admin.email, admin.password);

				const { id: fetchedId } = await db.one<{ id: SessionId }>(
					`SELECT id 
           FROM session
           WHERE admin_id = $1`,
					[admin.id],
				);

				expect(fetchedId).toEqual(sessionId);
			});

			it("sets the expiry to 2 hours from the current time", async () => {
				const admin = await seedAdmin();

				const sessionId = await adminModel.login(admin.email, admin.password);

				const { expiry } = await db.one<{ expiry: Date }>(
					`SELECT expiry
           FROM session
           WHERE id = $1`,
					[sessionId],
				);

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

// describe("getAdminDetails", () => {
//   describe("when the admin exists", () => {
//     it("returns the admin details", async () => {
//       const { password: _, ...adminDetails } = await seedAdmin();

//       const fetchedAdminDetails = await adminModel.getAdminDetails(
//         adminDetails.email,
//       );

//       expect(fetchedAdminDetails).toEqual(adminDetails);
//     });
//   });

//   describe("when the admin does not exist", () => {
//     it("throws an INVALID_USER error", async () => {
//       try {
//         await adminModel.getAdminDetails(faker.internet.email());
//       } catch (error) {
//         expectError(error, AdminErrorCodes.INVALID_USER);
//       }
//     });
//   });

//   describe("when multiple admins with the same email exist", () => {
//     it("throws an INVALID_USER error", async () => {
//       const { email } = await generateAdminData();
//       await seedAdmin(email);
//       await seedAdmin(email);

//       try {
//         await adminModel.getAdminDetails(email);
//       } catch (error) {
//         expectError(error, AdminErrorCodes.MULTIPLE_USERS);
//       }
//     });
//   });
// });

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

//   describe("when the admin does not exist", () => {
//     it("throws a INVALID_USER error", async () => {
//       try {
//         await adminModel.clearAdminSession(
//           faker.number.int({ max: 100 }) as AdminId,
//         );
//       } catch (error) {
//         expectError(error, AdminErrorCodes.INVALID_USER);
//       }
//     });
//   });
// });

// describe("createNewSession", () => {
//   describe("when the admin exists", () => {
//     let id: AdminId;
//     beforeEach(async () => {
//       id = (await seedAdmin()).id;
//     });

//     it("updates the session", async () => {
//       await adminModel.createNewSession({
//         id,
//       });

//       const fetchedSession = await db.one<
//         Pick<AdminSession, "session_expiry" | "session_token_hash">
//       >(
//         `SELECT session_token_hash, session_expiry
//          FROM admin
//          WHERE id = $1`,
//         [id],
//       );

//       expect(fetchedSession.session_expiry).toBeDate();
//       expect(fetchedSession.session_token_hash).toBeString();
//     });

//     it("returns the sessionToken", async () => {
//       const newSession = await adminModel.createNewSession({
//         id,
//       });

//       expect(newSession.id).toEqual(id);
//       expect(newSession.session_token).toBeString();
//     });
//   });

//   describe("when the admin does not exist", () => {
//     it("throws a INVALID_USER error", async () => {
//       try {
//         const id = faker.number.int({ max: 100 }) as AdminId;

//         await adminModel.createNewSession({
//           id,
//         });
//       } catch (error) {
//         expectError(error, AdminErrorCodes.INVALID_USER);
//       }
//     });
//   });
// });
