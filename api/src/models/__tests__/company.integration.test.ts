import { companyErrorCodes, companyModel } from "../company";
import { faker } from "@faker-js/faker";
import db from "../db";
import { clearCompanyTable } from "../../testUtils/dbHelpers";
import { expectError, generateCompanyData } from "../../testUtils";

afterEach(async () => {
  await clearCompanyTable();
});

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

describe("addCompany", () => {
  describe("when the company does not already exist", () => {
    it("adds a new company to the database", async () => {
      const company = generateCompanyData();

      const createdCompany = await companyModel.addCompany(company);

      expect(createdCompany.id).toBeNumber();
      expect(createdCompany.name).toEqual(company.name);
      expect(createdCompany.notes).toEqual(company.notes);
      expect(createdCompany.website).toEqual(company.website);
    });
  });

  describe("when the company already exists", () => {
    it("throws a COMPANY_EXISTS error", async () => {
      const name = faker.company.name();
      await db.none("INSERT INTO company (name) VALUES ($1)", [name]);

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
    const companies = Array.from({ length: 5 }, () => faker.company.name());
    await Promise.all(
      companies.map((name) =>
        db.none("INSERT INTO company (name) VALUES ($1)", [name]),
      ),
    );

    const allCompanies = await companyModel.getCompanies();
    expect(allCompanies.length).toBe(companies.length);

    companies.forEach((name) => {
      expect(allCompanies.some((company) => company.name === name)).toBe(true);
    });
  });
});
