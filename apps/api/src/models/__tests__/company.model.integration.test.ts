import { faker } from "@faker-js/faker";
import { clearCompanyTable, seedCompanies } from "../../testUtils/dbHelpers";
import { generateCompanyData } from "../../testUtils/generators";
import { expectError } from "../../testUtils/index";
import testDb from "../../testUtils/testDb";
import { companyErrorCodes, companyModel } from "../company";

afterEach(async () => {
	await clearCompanyTable();
});

afterAll(async () => {
	await testDb.$pool.end(); // Close the pool after each test file
});

describe("addCompany", () => {
	describe("when the company does not already exist", () => {
		it("adds a new company to the database", async () => {
			const companyData = generateCompanyData();

			const { id, ...rest } = await companyModel.addCompany(companyData);

			expect(id).toBeNumber();
			expect(rest).toEqual(companyData);
		});
	});

	describe("when the company already exists", () => {
		it("throws a COMPANY_EXISTS error", async () => {
			const name = faker.company.name();
			await testDb.none("INSERT INTO company (name) VALUES ($1)", [name]);

			try {
				await companyModel.addCompany({ name });
			} catch (error) {
				expectError(error, companyErrorCodes.COMPANY_EXISTS);
			}
		});
	});
});

describe("getAllCompanies", () => {
	it('returns all companies from the "company" table', async () => {
		const companies = await seedCompanies(3);

		const fetchedCompanies = await companyModel.getCompanies();

		expect(fetchedCompanies).toIncludeSameMembers(companies);
	});
});
