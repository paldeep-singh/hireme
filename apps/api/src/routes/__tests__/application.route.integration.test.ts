import { generateApiApplicationData } from "@repo/api-types/testUtils/generators";
import request from "supertest";
import api from "../../api";
import { db } from "../../db/database";
import { Role } from "../../db/generated/hire_me/Role";
import { Session } from "../../db/generated/hire_me/Session";
import { authorisationErrorMessages } from "../../middleware/authorisation";
import {
	clearAdminTable,
	clearSessionTable,
	seedAdmin,
	seedAdminSession,
	seedCompanies,
	seedRole,
} from "../../testUtils/dbHelpers";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

describe("POST /api/application", () => {
	let role: Role;

	beforeEach(async () => {
		const company = (await seedCompanies(1))[0];
		role = await seedRole(company.id);
	});

	describe("when a valid session is provided", () => {
		let session: Session;

		beforeEach(async () => {
			const admin = await seedAdmin();
			session = await seedAdminSession(admin.id);
		});

		afterEach(async () => {
			await clearSessionTable();
			await clearAdminTable();
		});

		describe("when valid body is provided", () => {
			it("returns status code 201", async () => {
				const applicationData = generateApiApplicationData(role.id);

				const response = await request(api)
					.post("/api/application")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(applicationData);

				expect(response.status).toEqual(201);
			});

			it("returns the application", async () => {
				const applicationData = generateApiApplicationData(role.id);

				const {
					body: { id, ...rest },
				} = await request(api)
					.post("/api/application")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(applicationData);

				expect(id).toBeNumber();
				expect(rest).toEqual(applicationData);
			});
		});

		describe("when invalid body is provided", () => {
			it("returns statusCode 400", async () => {
				const response = await request(api)
					.post("/api/application")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});
				expect(response.status).toBe(400);
			});

			it("returns an error message", async () => {
				const response = await request(api)
					.post("/api/application")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});

				expect(response.body.error).toBeString();
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const applicationData = generateApiApplicationData(role.id);

			const response = await request(api)
				.post("/api/application")
				.send(applicationData);

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const applicationData = generateApiApplicationData(role.id);

			const {
				body: { error },
			} = await request(api).post("/api/application").send(applicationData);

			expect(error).toEqual(authorisationErrorMessages.BAD_REQUEST);
		});
	});
});
