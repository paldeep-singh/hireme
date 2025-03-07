import { companyErrorCodes, companyModel } from "../company";
import { faker } from "@faker-js/faker";
import db from "../db";
import { expectError } from "../../testUtils";

afterEach(async () => {
  db.none("TRUNCATE TABLE company RESTART IDENTITY CASCADE");
});

afterAll(() => {
  db.$pool.end();
});

describe("createCompany", () => {
  describe("when the company does not already exist", () => {
    it("adds a new company to the database", async () => {
      const name = faker.company.name();

      const createdCompany = await companyModel.createCompany(name);

      expect(createdCompany.name).toBe(name);

      const fetchedCompany = await db.one(
        "SELECT id, name FROM company WHERE name = $1",
        [name],
      );

      expect(fetchedCompany.name).toBe(createdCompany.name);
      expect(fetchedCompany.id).toBe(createdCompany.id);
    });
  });

  describe("when the company already exists", () => {
    it("throws a COMPANY_EXISTS error", async () => {
      const name = faker.company.name();
      await db.none("INSERT INTO company (name) VALUES ($1)", [name]);

      try {
        await companyModel.createCompany(name);
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
