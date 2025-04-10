import DBCompany from "@repo/shared/generated/db/hire_me/Company";
import DBSession from "@repo/shared/generated/db/hire_me/Session";
import { generateRoleData } from "@repo/shared/testHelpers/generators";
import { DBRolePreview } from "@repo/shared/types/db/RolePreview";
import request from "supertest";
import api from "../../api";
import { authorisationrErrors } from "../../middleware/authorisation";
import { validationErrorCodes } from "../../middleware/validation";
import {
	clearAdminTable,
	clearCompanyTable,
	clearRoleTable,
	clearSessionTable,
	seedAdmin,
	seedAdminSession,
	seedApplication,
	seedCompanies,
	seedRole,
	seedRoleLocation,
} from "../../testUtils/dbHelpers";
import testDb from "../../testUtils/testDb";

afterAll(async () => {
	await testDb.$pool.end(); // Close the pool after each test file
});

describe("POST /api/role", () => {
	let company: DBCompany;

	beforeEach(async () => {
		company = (await seedCompanies(1))[0];
	});

	afterEach(async () => {
		await clearRoleTable();
		await clearCompanyTable();
	});

	describe("when a valid session is provided", () => {
		let session: DBSession;

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
	let rolePreviews: DBRolePreview[];

	beforeEach(async () => {
		const companies = await seedCompanies(3);

		rolePreviews = await Promise.all(
			companies.map(async ({ id: company_id, name: company }) => {
				const role = await seedRole(company_id);
				const { location } = await seedRoleLocation(role.id);
				const { date_submitted } = await seedApplication(role.id);

				return {
					company,
					...role,
					location,
					date_submitted,
				};
			}),
		);
	});

	afterEach(async () => {
		await clearRoleTable();
		await clearCompanyTable();
	});

	describe("when a valid session is provided", () => {
		let session: DBSession;

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

			const rolePreviewsJson = rolePreviews.map(
				({ date_added, date_submitted, ...rest }) => ({
					date_added: date_added.toISOString(),
					date_submitted: date_submitted?.toISOString() ?? null,
					...rest,
				}),
			);

			expect(response.body).toIncludeSameMembers(rolePreviewsJson);
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
