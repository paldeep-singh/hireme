import { faker } from "@faker-js/faker";
import Company from "@repo/shared/generated/db/hire_me/Company";
import Session from "@repo/shared/generated/db/hire_me/Session";
import { generateCompanyData } from "@repo/shared/testHelpers/generators";
import request from "supertest";
import api from "../../api";
import { authorisationrErrors } from "../../middleware/authorisation";
import { validationErrorCodes } from "../../middleware/validation";
import dbPromise from "../../models/dbPromise";
import {
	clearAdminTable,
	clearCompanyTable,
	clearSessionTable,
	seedAdmin,
	seedAdminSession,
	seedCompanies,
} from "../../testUtils/dbHelpers";

afterAll(async () => {
	await dbPromise.$pool.end(); // Close the pool after each test file
});

describe("POST /api/company", async () => {
	describe("when a valid session is provided", async () => {
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
			it("returns statusCode 201", async () => {
				const company = generateCompanyData();

				const response = await request(api)
					.post("/api/company")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(company);
				expect(response.status).toBe(201);
			});

			it("returns the company", async () => {
				const company = generateCompanyData();

				const {
					body: { id, ...rest },
				} = await request(api)
					.post("/api/company")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(company);

				expect(rest).toEqual(company);
				expect(id).toBeNumber();
			});
		});

		describe("when invalid body is provided", () => {
			it("returns statusCode 400", async () => {
				const response = await request(api)
					.post("/api/company")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});
				expect(response.status).toBe(400);
			});

			it("returns an INVALID_DATA error message", async () => {
				const response = await request(api)
					.post("/api/company")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});
				expect(response.body.error).toEqual(validationErrorCodes.INVALID_DATA);
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const company = generateCompanyData();

			const response = await request(api).post("/api/company").send(company);
			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const company = generateCompanyData();

			const {
				body: { error },
			} = await request(api).post("/api/company").send(company);

			expect(error).toEqual(authorisationrErrors.BAD_REQUEST);
		});
	});
});

describe("GET /api/companies", async () => {
	describe("when a valid session is provided", () => {
		let companies: Company[];
		const companyCount = faker.number.int({ min: 2, max: 10 });

		let session: Session;

		beforeEach(async () => {
			const admin = await seedAdmin();
			session = await seedAdminSession(admin.id);
			companies = await seedCompanies(companyCount);
		});

		afterEach(async () => {
			await clearCompanyTable();
			await clearSessionTable();
			await clearAdminTable();
		});

		it("returns statusCode 200", async () => {
			const response = await request(api)
				.get("/api/companies")
				.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

			expect(response.status).toBe(200);
		});

		it("returns an array of companies", async () => {
			const response = await request(api)
				.get("/api/companies")
				.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

			expect(response.body).toIncludeSameMembers(companies);
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const response = await request(api).get("/api/companies");
			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const {
				body: { error },
			} = await request(api).get("/api/companies");

			expect(error).toEqual(authorisationrErrors.BAD_REQUEST);
		});
	});
});
