import { generateApiApplicationData } from "@repo/api-types/testUtils/generators";
import { db } from "../../db/database";
import { Role } from "../../db/generated/hire_me/Role";
import {
	clearRoleTable,
	seedApplication,
	seedCompanies,
	seedRole,
} from "../../testUtils/dbHelpers";
import { applicationService } from "../application.service";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

describe("applicationService", () => {
	let role: Role;

	beforeEach(async () => {
		const company = (await seedCompanies(1))[0];
		role = await seedRole(company.id);
	});

	afterEach(async () => {
		await clearRoleTable();
	});

	describe("addApplication", () => {
		it("adds an application to the database", async () => {
			const applicationData = generateApiApplicationData(role.id);

			const { id, ...rest } =
				await applicationService.addApplication(applicationData);

			expect(id).toBeNumber();
			expect(rest).toEqual(applicationData);
		});
	});

	describe("updateApplication", () => {
		it("updates the application in the database", async () => {
			const application = await seedApplication(role.id);

			const { role_id: _, ...updates } = generateApiApplicationData(role.id);

			const updatedApplication = await applicationService.updateApplication(
				updates,
				application.id,
			);

			expect(updatedApplication).toEqual({
				...updates,
				id: application.id,
				role_id: application.role_id,
			});

			const fetchedApp = await db
				.withSchema("hire_me")
				.selectFrom("application")
				.where("id", "=", application.id)
				.selectAll()
				.executeTakeFirstOrThrow();

			expect(fetchedApp).toEqual({
				...updates,
				id: application.id,
				role_id: application.role_id,
				date_submitted: updatedApplication.date_submitted
					? new Date(updatedApplication.date_submitted)
					: null,
			});
		});
	});
});
