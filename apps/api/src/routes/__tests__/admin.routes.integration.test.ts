import { faker } from "@faker-js/faker";
import Admin from "@repo/shared/generated/db/Admin";
import Session from "@repo/shared/generated/db/Session";
import { subHours } from "date-fns";
import request from "supertest";
import api from "../../api";
import { authorisationrErrors } from "../../middleware/authorisation";
import { validationErrorCodes } from "../../middleware/validation";
import db from "../../models/db";
import {
	clearAdminTable,
	clearSessionTable,
	seedAdmin,
	seedAdminSession,
} from "../../testUtils/dbHelpers";

afterAll(async () => {
	await db.$pool.end(); // Close the pool after each test file
});

afterEach(async () => {
	await clearAdminTable();
	await clearSessionTable();
});

describe("POST /api/admin/login", () => {
	describe("when valid body is provided and user exists", () => {
		let admin: Admin & { password: string };

		beforeEach(async () => {
			admin = await seedAdmin();
		});

		it("returns status code 204", async () => {
			const response = await request(api).post("/api/admin/login").send({
				email: admin.email,
				password: admin.password,
			});

			expect(response.status).toEqual(204);
		});

		it("sets the session cookie", async () => {
			const response = await request(api).post("/api/admin/login").send({
				email: admin.email,
				password: admin.password,
			});

			const { id: fetchedId, expiry } = await db.one<
				Pick<Session, "id" | "expiry">
			>(
				`
            SELECT id, expiry
            FROM session
            WHERE admin_id = $1
            `,
				[admin.id],
			);

			expect(response.headers["set-cookie"]).toEqual([
				`session=${encodeURIComponent(JSON.stringify({ id: fetchedId }))}; Domain=localhost; Path=/api; Expires=${expiry.toUTCString()}`,
			]);
		});
	});

	describe("when an invalid body is provided", async () => {
		it("returns status code 400", async () => {
			const response = await request(api).post("/api/admin/login").send({});
			expect(response.status).toEqual(400);
		});

		it("returns an INVALID_DATA error message", async () => {
			const response = await request(api).post("/api/admin/login").send({});
			expect(response.body.error).toEqual(validationErrorCodes.INVALID_DATA);
		});
	});
});

describe("GET /admin/session/validate", () => {
	describe("when a session cookie is provided", () => {
		describe("when the session is valid", () => {
			let session: Session;

			beforeEach(async () => {
				const admin = await seedAdmin();

				session = await seedAdminSession(admin.id);
			});

			it("returns status code 200", async () => {
				const response = await request(api)
					.get("/api/admin/session/validate")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

				expect(response.status).toEqual(200);
			});
		});

		describe("when the session is invalid", () => {
			it("returns status code 401", async () => {
				const response = await request(api)
					.get("/api/admin/session/validate")
					.set("Cookie", [
						`session=${JSON.stringify({ id: faker.string.alphanumeric(20) })}`,
					]);

				expect(response.status).toEqual(401);
			});

			it("returns an INVALID_SESSION error message", async () => {
				const response = await request(api)
					.get("/api/admin/session/validate")
					.set("Cookie", [
						`session=${JSON.stringify({ id: faker.string.alphanumeric(20) })}`,
					]);

				expect(response.body.error).toEqual(
					authorisationrErrors.UNAUTHORISED_INVALID,
				);
			});
		});

		describe("when the session is expired", () => {
			let session: Session;

			beforeEach(async () => {
				const admin = await seedAdmin();

				session = await seedAdminSession(admin.id, subHours(new Date(), 1));
			});

			it("returns status code 401", async () => {
				const response = await request(api)
					.get("/api/admin/session/validate")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

				expect(response.status).toEqual(401);
			});

			it("returns an EXPIRED_SESSION error message", async () => {
				const response = await request(api)
					.get("/api/admin/session/validate")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

				expect(response.body.error).toEqual(
					authorisationrErrors.UNAUTHORISED_EXPIRED,
				);
			});

			it("clears the session", async () => {
				await request(api)
					.get("/api/admin/session/validate")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

				const fetchedSession = await db.oneOrNone<Session>(
					`SELECT * FROM session WHERE id = $1`,
					[session.id],
				);

				expect(fetchedSession).toBeNull();
			});
		});
	});

	describe("when no session cookie is provided", () => {
		it("returns status code 400", async () => {
			const response = await request(api).get("/api/admin/session/validate");

			expect(response.status).toEqual(400);
		});
	});
});
