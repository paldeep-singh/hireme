import { generateApiRoleData } from "@repo/api-types/testUtils/generators";
import { RoleDetails } from "@repo/api-types/types/api/RoleDetails";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { toNumrangeObject } from "@repo/api-types/utils/numrange";
import { omit } from "lodash-es";
import request from "supertest";
import api from "../../api";
import { db } from "../../db/database";
import { Company } from "../../db/generated/hire_me/Company";
import { Session } from "../../db/generated/hire_me/Session";
import { authorisationErrorMessages } from "../../middleware/authorisation";
import {
	clearAdminTable,
	clearCompanyTable,
	clearRoleTable,
	clearSessionTable,
	seedAdmin,
	seedAdminSession,
	seedApplication,
	seedCompanies,
	seedRequirement,
	seedRole,
	seedRoleLocation,
	seedSalary,
} from "../../testUtils/dbHelpers";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
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
				const { date_added: _, ...roleData } = generateApiRoleData(company.id);

				const response = await request(api)
					.post("/api/role")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(roleData);
				expect(response.status).toBe(201);
			});

			it("returns the role", async () => {
				const { date_added: _, ...roleData } = generateApiRoleData(company.id);

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

			it("returns an  error message", async () => {
				const response = await request(api)
					.post("/api/role")
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});

				expect(response.body.error).toBeString();
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const roleData = generateApiRoleData(company.id);

			const response = await request(api).post("/api/role").send(roleData);

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const roleData = generateApiRoleData(company.id);

			const response = await request(api).post("/api/role").send(roleData);

			expect(response.body.error).toEqual(
				authorisationErrorMessages.BAD_REQUEST,
			);
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
				const { location } = await seedRoleLocation(role.id);
				const { date_submitted } = await seedApplication(role.id);

				return {
					company,
					...role,
					term: role.term ? role.term.toISOString() : null,
					date_added: role.date_added.toISOString(),
					location,
					date_submitted: date_submitted?.toISOString() ?? null,
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

			expect(response.body).toIncludeSameMembers(rolePreviews);
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const response = await request(api).get("/api/roles/previews");

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const response = await request(api).get("/api/roles/previews");

			expect(response.body.error).toEqual(
				authorisationErrorMessages.BAD_REQUEST,
			);
		});
	});
});

describe("GET /api/role/:id", () => {
	describe("when a valid session is provided", () => {
		let session: Session;
		let expectedRoleDetails: RoleDetails;

		beforeEach(async () => {
			const admin = await seedAdmin();
			session = await seedAdminSession(admin.id);

			const company = (await seedCompanies(1))[0];
			const role = await seedRole(company.id);
			const location = await seedRoleLocation(role.id);
			const app = await seedApplication(role.id);
			const salary = await seedSalary(role.id);

			const requirements = await Promise.all(
				Array.from({ length: 3 }).map(async () => seedRequirement(role.id)),
			);

			expectedRoleDetails = {
				...omit(role, ["company_id"]),
				term: role.term?.toISOString() ?? null,
				company,
				date_added: role.date_added.toISOString(),
				location: {
					...omit(location, ["role_id"]),
					office_days: toNumrangeObject(location.office_days),
				},
				application: {
					...omit(app, ["role_id"]),
					date_submitted: app.date_submitted?.toISOString() ?? null,
				},
				salary: {
					...omit(salary, ["role_id"]),
					salary_range: toNumrangeObject(salary.salary_range),
				},
				requirements: requirements.map((req) => omit(req, ["role_id"])),
			};
		});

		afterEach(async () => {
			await clearSessionTable();
			await clearAdminTable();
			await clearRoleTable();
		});

		describe("when a valid id param is provided", () => {
			it("returns statusCode 200", async () => {
				const response = await request(api)
					.get(`/api/role/${expectedRoleDetails.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

				expect(response.status).toEqual(200);
			});

			it("returns the role details", async () => {
				const response = await request(api)
					.get(`/api/role/${expectedRoleDetails.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

				const { requirements: expectedRequirements, ...expectedRest } =
					expectedRoleDetails;

				const { requirements, ...rest } = response.body;

				expect(requirements).toIncludeSameMembers(expectedRequirements!);

				expect(rest).toEqual(expectedRest);
			});
		});

		describe("when no id param is provided", () => {
			it("returns status code 404", async () => {
				const response = await request(api)
					.get(`/api/role`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`]);

				expect(response.status).toEqual(404);
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const response = await request(api).get("/api/role/1");

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const response = await request(api).get("/api/role/1");

			expect(response.body.error).toEqual(
				authorisationErrorMessages.BAD_REQUEST,
			);
		});
	});
});
