import { generateApiRoleLocationData } from "@repo/api-types/testUtils/generators";
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
import { generateRoleLocationData } from "../../testUtils/generators";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

describe("POST /api/role-location", () => {
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
				const roleLocationData = generateApiRoleLocationData(role.id);

				const response = await request(api)
					.post("/api/role-location")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(roleLocationData);

				expect(response.status).toEqual(201);
			});

			it("returns the role location", async () => {
				const roleLocationData = generateApiRoleLocationData(role.id);

				const {
					body: { id, ...rest },
				} = await request(api)
					.post("/api/role-location")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(roleLocationData);

				expect(id).toBeNumber();
				expect(rest).toEqual(roleLocationData);
			});
		});

		describe("when invalid body is provided", () => {
			it("returns statusCode 400", async () => {
				const response = await request(api)
					.post("/api/role-location")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});
				expect(response.status).toBe(400);
			});

			it("returns an error message", async () => {
				const response = await request(api)
					.post("/api/role-location")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});

				expect(response.body.error).toBeString();
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const roleLocationData = generateRoleLocationData(role.id);

			const response = await request(api)
				.post("/api/role-location")
				.send(roleLocationData);

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const roleLocationData = generateRoleLocationData(role.id);

			const {
				body: { error },
			} = await request(api).post("/api/role-location").send(roleLocationData);

			expect(error).toEqual(authorisationErrorMessages.BAD_REQUEST);
		});
	});
});
