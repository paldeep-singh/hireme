import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompanyByName,
} from "../company";
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
    "INSERT INTO companies (name) VALUES ($1) RETURNING *",
    [name]
  );

  const company = await getCompanyByName(name);
  console.log(company);

  expect(company.name).toBe(name);
  expect(company.id).toBe(result.id);
});

it("getAllCompanies", async () => {
  const companies = Array.from({ length: 5 }, () => faker.company.name());
  await Promise.all(
    companies.map((name) =>
      db.none("INSERT INTO companies (name) VALUES ($1)", [name])
    )
  );

  const allCompanies = await getAllCompanies();
  expect(allCompanies.length).toBe(companies.length);

  companies.forEach((name) => {
    expect(allCompanies.some((company) => company.name === name)).toBe(true);
  });
});

it("getCompanyByName", async () => {
  const name = faker.company.name();
  await createCompany(name);

  const company = await getCompanyByName(name);
  expect(company.name).toBe(name);
});

it("deleteCompany", async () => {
  const name = faker.company.name();
  const company = await createCompany(name);

  await deleteCompany(company.id);

  try {
    await getCompanyByName(name);
  } catch (error) {
    expectError(error, "No data returned from the query.");
  }
});
