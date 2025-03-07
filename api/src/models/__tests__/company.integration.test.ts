import { companyModel } from "../company";
import { faker } from "@faker-js/faker";
import db from "../db";
import { clearAllTables, expectError } from "../../testUtils";

afterEach(async () => {
  await clearAllTables();
});

afterAll(() => {
  db.$pool.end();
});

it("createCompany", async () => {
  const name = faker.company.name();
  const result = await db.one(
    "INSERT INTO company (name) VALUES ($1) RETURNING *",
    [name],
  );

  const company = await companyModel.getCompanyByName(name);

  expect(company.name).toBe(name);
  expect(company.id).toBe(result.id);
});

it("getAllCompanies", async () => {
  const companies = Array.from({ length: 5 }, () => faker.company.name());
  await Promise.all(
    companies.map((name) =>
      db.none("INSERT INTO company (name) VALUES ($1)", [name]),
    ),
  );

  const allCompanies = await companyModel.getAllCompanies();
  expect(allCompanies.length).toBe(companies.length);

  companies.forEach((name) => {
    expect(allCompanies.some((company) => company.name === name)).toBe(true);
  });
});

it("getCompanyByName", async () => {
  const name = faker.company.name();
  await companyModel.createCompany(name);

  const company = await companyModel.getCompanyByName(name);
  expect(company.name).toBe(name);
});

it("deleteCompany", async () => {
  const name = faker.company.name();
  const company = await companyModel.createCompany(name);

  await companyModel.deleteCompany(company.id);

  try {
    await companyModel.getCompanyByName(name);
  } catch (error) {
    expectError(error, "No data returned from the query.");
  }
});
