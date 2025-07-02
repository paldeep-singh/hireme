import { omit } from "lodash-es";
import request from "supertest";
import api from "../../api";
import { db } from "../../db/database";
import { Requirement } from "../../db/generated/hire_me/Requirement";
import { Role } from "../../db/generated/hire_me/Role";
import { Session } from "../../db/generated/hire_me/Session";
import { authorisationErrorMessages } from "../../middleware/authorisation";
import {
	clearAdminTable,
	clearSessionTable,
	seedAdmin,
	seedAdminSession,
	seedCompanies,
	seedRequirement,
	seedRole,
} from "../../testUtils/dbHelpers";
import { generateRequirementData } from "../../testUtils/generators";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

describe("POST /api/role/:role_id/requirement", () => {
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

				const requirementInput = omit(requirementData, ["role_id"]);

				const response = await request(api)
					.post(`/api/role/${role.id}/requirement`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(requirementInput);

				expect(response.status).toEqual(201);
			});

			it("returns the requirement", async () => {
				const requirmentData = generateRequirementData(role.id);

				const {
					body: { id, ...rest },
				} = await request(api)
					.post(`/api/role/${role.id}/requirement`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(requirmentData);

				expect(id).toBeNumber();
				expect(rest).toEqual(requirmentData);
			});
		});

		describe("when invalid body is provided", () => {
			it("returns statusCode 400", async () => {
				const response = await request(api)
					.post(`/api/role/${role.id}/requirement`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});
				expect(response.status).toBe(400);
			});

			it("returns an error message", async () => {
				const response = await request(api)
					.post(`/api/role/${role.id}/requirement`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});

				expect(response.body.error).toBeString();
			});
		});

		describe("when invalid role_id is provided", () => {
			it("returns status code 400", async () => {
				const requirementData = generateRequirementData(role.id);

				const requirementInput = omit(requirementData, ["role_id"]);

				const response = await request(api)
					.post(`/api/role/invalid_id/requirement`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(requirementInput);

				expect(response.status).toBe(400);
			});

			it("returns an  error message", async () => {
				const requirementData = generateRequirementData(role.id);

				const requirementInput = omit(requirementData, ["role_id"]);

				const response = await request(api)
					.post(`/api/role/invalid_id/requirement`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(requirementInput);

				expect(response.body.error).toBeString();
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const requirementData = generateRequirementData(role.id);

			const requirementInput = omit(requirementData, ["role_id"]);

			const response = await request(api)
				.post(`/api/role/${role.id}/requirement`)
				.send(requirementInput);

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const requirementData = generateRequirementData(role.id);

			const requirementInput = omit(requirementData, ["role_id"]);

			const {
				body: { error },
			} = await request(api)
				.post(`/api/role/${role.id}/requirement`)
				.send(requirementInput);

			expect(error).toEqual(authorisationErrorMessages.BAD_REQUEST);
		});
	});
});

describe("POST /api/role/:role_id/requirements", () => {
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
				const requirementsDataList = Array.from({ length: 5 }).map(() =>
					generateRequirementData(role.id),
				);

				const requirementInputList = requirementsDataList.map((data) =>
					omit(data, ["role_id"]),
				);

				const response = await request(api)
					.post(`/api/role/${role.id}/requirements`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(requirementInputList);

				expect(response.status).toEqual(201);
			});

			it("returns the requirements", async () => {
				const requirementsDataList = Array.from({ length: 5 }).map(() =>
					generateRequirementData(role.id),
				);
				const requirementInputList = requirementsDataList.map((data) =>
					omit(data, ["role_id"]),
				);

				const { body } = await request(api)
					.post(`/api/role/${role.id}/requirements`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(requirementInputList);

				// @ts-expect-error Ok since this is a test.
				body.map(({ id, ...rest }) => {
					expect(id).toBeNumber();
					expect(requirementsDataList).toIncludeAllMembers([rest]);
				});
			});
		});

		describe("when invalid body is provided", () => {
			it("returns statusCode 400", async () => {
				const response = await request(api)
					.post(`/api/role/${role.id}/requirements`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});
				expect(response.status).toBe(400);
			});

			it("returns an error message", async () => {
				const response = await request(api)
					.post(`/api/role/${role.id}/requirements`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({});

				expect(response.body.error).toBeString();
			});
		});

		describe("when invalid role_id is provided", () => {
			it("returns status code 400", async () => {
				const requirementsDataList = Array.from({ length: 5 }).map(() =>
					generateRequirementData(role.id),
				);
				const requirementInputList = requirementsDataList.map((data) =>
					omit(data, ["role_id"]),
				);

				const { status } = await request(api)
					.post(`/api/role/invalid_id/requirements`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(requirementInputList);

				expect(status).toBe(400);
			});

			it("returns an  error message", async () => {
				const requirementsDataList = Array.from({ length: 5 }).map(() =>
					generateRequirementData(role.id),
				);
				const requirementInputList = requirementsDataList.map((data) =>
					omit(data, ["role_id"]),
				);

				const { body } = await request(api)
					.post(`/api/role/invalid_id/requirements`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(requirementInputList);

				expect(body.error).toBeString();
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const requirementData = generateRequirementData(role.id);

			const requirementInput = omit(requirementData, ["role_id"]);

			const response = await request(api)
				.post(`/api/role/${role.id}/requirements`)
				.send(requirementInput);

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const requirementData = generateRequirementData(role.id);

			const requirementInput = omit(requirementData, ["role_id"]);

			const {
				body: { error },
			} = await request(api)
				.post(`/api/role/${role.id}/requirements`)
				.send(requirementInput);

			expect(error).toEqual(authorisationErrorMessages.BAD_REQUEST);
		});
	});
});

describe("POST /api/requirement/:requirement_id", () => {
	let role: Role;
	let requirement: Requirement;

	beforeEach(async () => {
		const company = (await seedCompanies(1))[0];
		role = await seedRole(company.id);
		requirement = await seedRequirement(role.id);
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
				const requirementData = generateRequirementData(role.id);

				const updates = omit(requirementData, ["role_id"]);

				const response = await request(api)
					.patch(`/api/requirement/${requirement.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(updates);

				expect(response.status).toEqual(200);
			});

			it("returns the updated requirement", async () => {
				const requirementData = generateRequirementData(role.id);

				const updates = omit(requirementData, ["role_id"]);

				const response = await request(api)
					.patch(`/api/requirement/${requirement.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(updates);

				expect(response.body).toEqual({
					...updates,
					id: requirement.id,
					role_id: role.id,
				});
			});
		});

		describe("when invalid body is provided", () => {
			it("returns statusCode 400", async () => {
				const response = await request(api)
					.patch(`/api/requirement/${requirement.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({ random: "a random value" });
				expect(response.status).toBe(400);
			});

			it("returns an error message", async () => {
				const response = await request(api)
					.patch(`/api/requirement/${requirement.id}`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send({ random: "a random value" });

				expect(response.body.error).toBeString();
			});
		});

		describe("when invalid requirement_id is provided", () => {
			it("returns status code 400", async () => {
				const requirementData = generateRequirementData(role.id);

				const updates = omit(requirementData, ["role_id"]);

				const response = await request(api)
					.patch(`/api/requirement/invalid_id`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(updates);

				expect(response.status).toBe(400);
			});

			it("returns an  error message", async () => {
				const requirementData = generateRequirementData(role.id);

				const updates = omit(requirementData, ["role_id"]);

				const response = await request(api)
					.patch(`/api/requirement/invalid_id`)
					.set("Cookie", [`session=${JSON.stringify({ id: session.id })}`])
					.send(updates);

				expect(response.body.error).toBeString();
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns statusCode 400", async () => {
			const requirementData = generateRequirementData(role.id);

			const updates = omit(requirementData, ["role_id"]);

			const response = await request(api)
				.patch(`/api/requirement/${requirement.id}`)
				.send(updates);

			expect(response.status).toBe(400);
		});

		it("returns the a BAD_REQUEST error message", async () => {
			const requirementData = generateRequirementData(role.id);

			const updates = omit(requirementData, ["role_id"]);

			const {
				body: { error },
			} = await request(api)
				.patch(`/api/requirement/${requirement.id}`)
				.send(updates);

			expect(error).toEqual(authorisationErrorMessages.BAD_REQUEST);
		});
	});
});
