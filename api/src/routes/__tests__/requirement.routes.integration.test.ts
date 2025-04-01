import Role from "@repo/shared/generated/db/hire_me/Role";
import Session from "@repo/shared/generated/db/hire_me/Session";
import { generateRequirementData } from "@repo/shared/testHelpers/generators";
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
	seedCompanies,
	seedRole,
} from "../../testUtils/dbHelpers";

afterAll(async () => {
	await db.$pool.end(); // Close the pool after each test file
});

describe("POST /api/requirement", () => {
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
				const requirementData = generateRequirementData(role.id);

				const response = await request(api)
					.post("/api/requirement")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(requirementData);

				expect(response.status).toEqual(201);
			});

			it("returns the requirement", async () => {
				const requirmentData = generateRequirementData(role.id);

				const {
					body: { id, ...rest },
				} = await request(api)
					.post("/api/requirement")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(requirmentData);

				expect(id).toBeNumber();
				expect(rest).toEqual(requirmentData);
			});
		});

		describe("when invalid body is provided", () => {
			it("returns statusCode 400", async () => {
				const response = await request(api)
					.post("/api/requirement")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});
				expect(response.status).toBe(400);
			});

			it("returns an INVALID_DATA error message", async () => {
				const response = await request(api)
					.post("/api/requirement")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});
				expect(response.body.error).toEqual(validationErrorCodes.INVALID_DATA);
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const requirementData = generateRequirementData(role.id);

			const response = await request(api)
				.post("/api/requirement")
				.send(requirementData);

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const requirementData = generateRequirementData(role.id);

			const {
				body: { error },
			} = await request(api).post("/api/requirement").send(requirementData);

			expect(error).toEqual(authorisationrErrors.BAD_REQUEST);
		});
	});
});
