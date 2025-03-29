import Company from "shared/generated/db/hire_me/Company.js";
import Session from "shared/generated/db/hire_me/Session.js";
import { generateRoleData } from "shared/testHelpers/generators.js";
import { RolePreview } from "shared/types/rolePreview.js";
import request from "supertest";
import api from "../../api.js";
import { authorisationrErrors } from "../../middleware/authorisation.js";
import { validationErrorCodes } from "../../middleware/validation.js";
import db from "../../models/db.js";
import {
	clearAdminTable,
	clearCompanyTable,
	clearRoleTable,
	clearSessionTable,
	seedAdmin,
	seedAdminSession,
	seedCompanies,
	seedRole,
} from "../../testUtils/dbHelpers.js";

afterAll(async () => {
	await db.$pool.end(); // Close the pool after each test file
});

describe("POST /api/role", () => {
	let company: Company;

	beforeEach(async () => {
		company = (await seedCompanies(1))[0];
	});

	afterEach(async () => {
		await clearRoleTable();
		await clearCompanyTable();
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
			it("returns statusCode 201", async () => {
				const { date_added: _, ...roleData } = generateRoleData(company.id);

				const response = await request(api)
					.post("/api/role")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(roleData);
				expect(response.status).toBe(201);
			});

			it("returns the role", async () => {
				const { date_added: _, ...roleData } = generateRoleData(company.id);

				const {
					body: { id, date_added, ...rest },
				} = await request(api)
					.post("/api/role")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(roleData);

				expect(id).toBeNumber();
				expect(new Date(date_added).valueOf()).not.toBeNaN();
				expect(rest).toEqual(roleData);
			});
		});

		describe("when invalid body is provided", () => {
			it("returns statusCode 400", async () => {
				const response = await request(api)
					.post("/api/role")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});
				expect(response.status).toBe(400);
			});

			it("returns an INVALID_DATA error message", async () => {
				const response = await request(api)
					.post("/api/role")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});
				expect(response.body.error).toEqual(validationErrorCodes.INVALID_DATA);
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const roleData = generateRoleData(company.id);

			const response = await request(api).post("/api/role").send(roleData);

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const roleData = generateRoleData(company.id);

			const response = await request(api).post("/api/role").send(roleData);

			expect(response.body.error).toEqual(authorisationrErrors.BAD_REQUEST);
		});
	});
});

describe("GET /api/roles/previews", () => {
	let rolePreviews: RolePreview[];

	beforeEach(async () => {
		const companies = await seedCompanies(3);

		rolePreviews = await Promise.all(
			companies.map(async ({ id: company_id, name: company }) => {
				const role = await seedRole(company_id);

				return {
					company,
					...role,
				};
			}),
		);
	});

	afterEach(async () => {
		await clearRoleTable();
		await clearCompanyTable();
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

		it("returns statusCode 200", async () => {
			const response = await request(api)
				.get("/api/roles/previews")
				.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

			expect(response.status).toBe(200);
		});

		it("returns an array of application previews", async () => {
			const response = await request(api)
				.get("/api/roles/previews")
				.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

			const rolePreviewsWithDateAddedString = rolePreviews.map(
				({ date_added, ...rest }) => ({
					date_added: date_added.toISOString(),
					...rest,
				}),
			);

			expect(response.body).toIncludeSameMembers(
				rolePreviewsWithDateAddedString,
			);
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const response = await request(api).get("/api/roles/previews");

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const response = await request(api).get("/api/roles/previews");

			expect(response.body.error).toEqual(authorisationrErrors.BAD_REQUEST);
		});
	});
});
