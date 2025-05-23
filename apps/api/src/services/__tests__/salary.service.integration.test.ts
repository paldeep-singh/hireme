import { generateApiSalaryData } from "@repo/api-types/testUtils/generators";
import { db } from "../../db/database";
import { Role } from "../../db/generated/hire_me/Role";
import {
	clearRoleTable,
	seedCompanies,
	seedRole,
} from "../../testUtils/dbHelpers";
import { salaryService } from "../salary.service";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

describe("salaryService", () => {
	let role: Role;

	beforeEach(async () => {
		const company = (await seedCompanies(1))[0];
		role = await seedRole(company.id);
	});

	afterEach(async () => {
		await clearRoleTable();
	});

	describe("addSalary", () => {
		describe("when a permanent salary is provided", () => {
			it("adds a salary to the database", async () => {
				const salaryData = generateApiSalaryData(role.id);

				const { id, ...rest } = await salaryService.addSalary(salaryData);

				expect(id).toBeNumber();

				expect(rest).toEqual(salaryData);
			});
		});

		describe("when a fixed term salary with term is provided", () => {
			it("adds a salary to the database", async () => {
				const salaryData = generateApiSalaryData(role.id);

				const { id, ...rest } = await salaryService.addSalary(salaryData);

				expect(id).toBeNumber();

				expect(rest).toEqual(salaryData);
			});
		});
	});
});
