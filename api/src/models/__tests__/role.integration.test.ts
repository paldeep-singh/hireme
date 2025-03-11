import Company from "../../../generatedTypes/hire_me/Company";
import { generateRoleData } from "../../testUtils";
import {
  clearCompanyTable,
  clearRoleTable,
  seedCompanies,
} from "../../testUtils/dbHelpers";
import db from "../db";
import { roleModel } from "../role";

let company: Company;

beforeEach(async () => {
  company = (await seedCompanies(1))[0];
});

afterEach(async () => {
  await clearRoleTable();
  await clearCompanyTable();
});

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

describe("addRole", () => {
  it("adds a new role to the database with null for ad_url", async () => {
    const { title, ad_url, notes } = generateRoleData(company.id);

    const createdRole = await roleModel.addRole({
      title,
      company_id: company.id,
      ad_url,
      notes,
    });

    expect(createdRole.title).toEqual(title);
    expect(createdRole.company_id).toEqual(company.id);
    expect(createdRole.ad_url).toEqual(ad_url);
    expect(createdRole.notes).toEqual(notes);
    expect(createdRole.id).toBeNumber();
  });
});
