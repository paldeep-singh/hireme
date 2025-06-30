import { generateApiApplicationData } from "@repo/api-types/testUtils/generators";
import { omit } from "lodash-es";
import request from "supertest";
import api from "../../api";
import { db } from "../../db/database";
import { Application } from "../../db/generated/hire_me/Application";
import { Role } from "../../db/generated/hire_me/Role";
import { Session } from "../../db/generated/hire_me/Session";
import { authorisationErrorMessages } from "../../middleware/authorisation";
import {
	clearAdminTable,
	clearSessionTable,
	seedAdmin,
	seedAdminSession,
	seedApplication,
	seedCompanies,
	seedRole,
} from "../../testUtils/dbHelpers";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

describe("POST /api/role/:role_id/application", () => {
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
				const { date_submitted: _, ...applicationData } =
					generateApiApplicationData(role.id);
				const applicationInput = omit(applicationData, [
					"role_id",
					"date_submitted",
				]);

				const response = await request(api)
					.post(`/api/role/${role.id}/application`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(applicationInput);

				expect(response.status).toEqual(201);
			});

			it("returns the application", async () => {
				const { date_submitted: _, ...applicationData } =
					generateApiApplicationData(role.id);

				const applicationInput = omit(applicationData, [
					"role_id",
					"date_submitted",
				]);

				const {
					body: { id, ...rest },
				} = await request(api)
					.post(`/api/role/${role.id}/application`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(applicationInput);

				expect(id).toBeNumber();
				expect(rest).toEqual({ ...applicationData, date_submitted: null });
			});
		});

		describe("when invalid body is provided", () => {
			it("returns statusCode 400", async () => {
				const response = await request(api)
					.post(`/api/role/${role.id}/application`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({ rando: "a thing" });

				expect(response.status).toBe(400);
			});

			it("returns an error message", async () => {
				const response = await request(api)
					.post(`/api/role/${role.id}/application`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({ rando: "a thing" });

				expect(response.body.error).toBeString();
			});
		});

		describe("when invalid role_id is provided", () => {
			it("returns status code 400", async () => {
				const { date_submitted: _, ...applicationData } =
					generateApiApplicationData(role.id);
				const applicationInput = omit(applicationData, [
					"role_id",
					"date_submitted",
				]);

				const response = await request(api)
					.post(`/api/role/invalid_id/application`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(applicationInput);

				expect(response.status).toBe(400);
			});

			it("returns an  error message", async () => {
				const { date_submitted: _, ...applicationData } =
					generateApiApplicationData(role.id);
				const applicationInput = omit(applicationData, [
					"role_id",
					"date_submitted",
				]);

				const response = await request(api)
					.post(`/api/role/invalid_id/application`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(applicationInput);

				expect(response.body.error).toBeString();
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const applicationData = generateApiApplicationData(role.id);

			const response = await request(api)
				.post(`/api/role/${role.id}/application`)
				.send(applicationData);

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const applicationData = generateApiApplicationData(role.id);

			const {
				body: { error },
			} = await request(api)
				.post(`/api/role/${role.id}/application`)
				.send(applicationData);

			expect(error).toEqual(authorisationErrorMessages.BAD_REQUEST);
		});
	});
});

describe("POST /api/role/:role_id/application/:application_id", () => {
	let role: Role;
	let application: Application;

	beforeEach(async () => {
		const company = (await seedCompanies(1))[0];
		role = await seedRole(company.id);
		application = await seedApplication(role.id);
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
			it("returns status code 200", async () => {
				const { date_submitted: _, ...applicationData } =
					generateApiApplicationData(role.id);
				const applicationInput = omit(applicationData, [
					"role_id",
					"date_submitted",
				]);

				const response = await request(api)
					.post(`/api/role/${role.id}/application/${application.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(applicationInput);

				expect(response.status).toEqual(200);
			});

			it("returns the updated application", async () => {
				const { date_submitted: _, ...applicationData } =
					generateApiApplicationData(role.id);

				const applicationInput = omit(applicationData, ["role_id"]);

				const {
					body: { id, ...rest },
				} = await request(api)
					.post(`/api/role/${role.id}/application/${application.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(applicationInput);

				expect(id).toEqual(application.id);
				expect(rest).toEqual({
					...applicationData,
					date_submitted: application.date_submitted?.toISOString() ?? null,
				});
			});
		});

		describe("when invalid body is provided", () => {
			it("returns statusCode 400", async () => {
				const response = await request(api)
					.post(`/api/role/${role.id}/application/${application.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({ rando: "a thing" });

				expect(response.status).toBe(400);
			});

			it("returns an error message", async () => {
				const response = await request(api)
					.post(`/api/role/${role.id}/application/${application.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({ rando: "a thing" });

				expect(response.body.error).toBeString();
			});
		});

		describe("when invalid application_id is provided", () => {
			it("returns status code 400", async () => {
				const { date_submitted: _, ...applicationData } =
					generateApiApplicationData(role.id);
				const applicationInput = omit(applicationData, [
					"role_id",
					"date_submitted",
				]);

				const response = await request(api)
					.post(`/api/role/${role.id}/application/invalid_id`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(applicationInput);

				expect(response.status).toBe(400);
			});

			it("returns an  error message", async () => {
				const { date_submitted: _, ...applicationData } =
					generateApiApplicationData(role.id);
				const applicationInput = omit(applicationData, [
					"role_id",
					"date_submitted",
				]);

				const response = await request(api)
					.post(`/api/role/${role.id}/application/invalid_id`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(applicationInput);

				expect(response.body.error).toBeString();
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const applicationData = generateApiApplicationData(role.id);

			const response = await request(api)
				.post(`/api/role/${role.id}/application/${application.id}`)
				.send(applicationData);

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const applicationData = generateApiApplicationData(role.id);

			const {
				body: { error },
			} = await request(api)
				.post(`/api/role/${role.id}/application/${application.id}`)
				.send(applicationData);

			expect(error).toEqual(authorisationErrorMessages.BAD_REQUEST);
		});
	});
});
