import { faker } from "@faker-js/faker";
import { generateApiContractData } from "@repo/api-types/testUtils/generators";
import PostgresInterval from "postgres-interval";
import { db } from "../../db/database";
import { Role } from "../../db/generated/hire_me/Role";
import {
	clearRoleTable,
	seedCompanies,
	seedRole,
} from "../../testUtils/dbHelpers";
import { contractService } from "../contract.service";

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

describe("contractService", () => {
	let role: Role;

	beforeEach(async () => {
		const company = (await seedCompanies(1))[0];
		role = await seedRole(company.id);
	});

	afterEach(async () => {
		await clearRoleTable();
	});

	describe("addContract", () => {
		describe("when a permanent contract is provided", () => {
			it("adds a contract to the database", async () => {
				const contractData = generateApiContractData(role.id, {
					type: "permanent",
					term: null,
				});

				const { id, ...rest } = await contractService.addContract(contractData);

				expect(id).toBeNumber();

				expect(rest).toEqual(contractData);
			});
		});

		describe("when a fixed term contract with term is provided", () => {
			it("adds a contract to the database", async () => {
				const contractData = generateApiContractData(role.id, {
					type: "fixed_term",
					term: PostgresInterval(
						`${faker.number.int({ min: 1, max: 9 })} months`,
					).toISOString(),
				});

				const { id, ...rest } = await contractService.addContract(contractData);

				expect(id).toBeNumber();

				expect(rest).toEqual(contractData);
			});
		});
	});
});
