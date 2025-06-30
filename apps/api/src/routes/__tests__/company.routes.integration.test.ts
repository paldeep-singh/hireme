import { faker } from "@faker-js/faker";
import { generateApiCompanyData } from "@repo/api-types/testUtils/generators";
import request from "supertest";
import api from "../../api";
import { db } from "../../db/database";
import { Company } from "../../db/generated/hire_me/Company";
import { Session } from "../../db/generated/hire_me/Session";
import { authorisationErrorMessages } from "../../middleware/authorisation";
import { companyErrorMessages } from "../../services/company.service";
import {
	clearAdminTable,
	clearCompanyTable,
	clearSessionTable,
	seedAdmin,
	seedAdminSession,
	seedCompanies,
} from "../../testUtils/dbHelpers";
import { generateCompanyData } from "../../testUtils/generators";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
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
			describe("when the company does not already exist", () => {
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

			describe("when the company already exists", () => {
				let company: Company;

				beforeEach(async () => {
					const companies = await seedCompanies(1);

					company = companies[0];
				});
				it("returns statusCode 409", async () => {
					const { id: _, ...rest } = company;
					const response = await request(api)
						.post("/api/company")
						.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
						.send(rest);
					expect(response.status).toBe(409);
				});

				it("returns the a COMPANY_EXISTS error", async () => {
					const {
						body: { error },
					} = await request(api)
						.post("/api/company")
						.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
						.send(company);

					expect(error).toEqual(companyErrorMessages.COMPANY_EXISTS);
				});
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

			it("returns an error message", async () => {
				const response = await request(api)
					.post("/api/company")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});

				expect(response.body.error).toBeString();
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

			expect(error).toEqual(authorisationErrorMessages.BAD_REQUEST);
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

			expect(error).toEqual(authorisationErrorMessages.BAD_REQUEST);
		});
	});
});

describe("POST /api/company/:company_id", async () => {
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
			let company: Company;

			beforeEach(async () => {
				const companies = await seedCompanies(1);

				company = companies[0];
			});
			it("returns statusCode 200", async () => {
				const updates = generateApiCompanyData();
				const response = await request(api)
					.post(`/api/company/${company.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(updates);

				expect(response.status).toBe(200);
			});

			it("returns the updated company", async () => {
				const updates = generateApiCompanyData();
				const response = await request(api)
					.post(`/api/company/${company.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(updates);

				expect(response.body).toEqual({
					...updates,
					id: company.id,
				});
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

			it("returns an error message", async () => {
				const response = await request(api)
					.post("/api/company")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});

				expect(response.body.error).toBeString();
			});
		});

		describe("when invalid company id is provided", () => {
			const updates = generateApiCompanyData();

			it("returns statusCode 400", async () => {
				const response = await request(api)
					.post("/api/company/invalid_id")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(updates);
				expect(response.status).toBe(400);
			});

			it("returns an error message", async () => {
				const response = await request(api)
					.post("/api/company/invalid_id")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(updates);
				expect(response.body.error).toEqual(
					"company_id is Expected number, received nan",
				);
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

			expect(error).toEqual(authorisationErrorMessages.BAD_REQUEST);
		});
	});
});
