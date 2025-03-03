import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompanyByName,
} from "../companies";
import { faker } from "@faker-js/faker";
import db from "../db";
import { expectError } from "../../testUtils";

afterAll(() => {
  db.$pool.end();
});

it("createCompany", async () => {
  const name = faker.company.name();
  const result = await createCompany(name);
  console.log(result);

  const company = await getCompanyByName(name);

  expect(company.name).toBe(name);
  expect(company.id).toBe(result.id);

  await deleteCompany(company.id);
});

it("getAllCompanies", async () => {
  const companies = Array.from({ length: 5 }, () => faker.company.name());
  await Promise.all(companies.map((name) => createCompany(name)));

  const allCompanies = await getAllCompanies();
  expect(allCompanies.length).toBe(companies.length);

  companies.forEach((name) => {
    expect(allCompanies.some((company) => company.name === name)).toBe(true);
  });

  await Promise.all(allCompanies.map((company) => deleteCompany(company.id)));
});

it("getCompanyByName", async () => {
  const name = faker.company.name();
  await createCompany(name);

  const company = await getCompanyByName(name);
  expect(company.name).toBe(name);

  await deleteCompany(company.id);
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
