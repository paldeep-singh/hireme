import { generateRoleData } from "../../testUtils";
import {
  clearCompanyTable,
  clearRoleTable,
  seedCompanies,
  seedRole,
} from "../../testUtils/dbHelpers";
import db from "../db";
import { roleModel, RolePreview } from "../role";
afterEach(async () => {
  await clearRoleTable();
  await clearCompanyTable();
});

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

describe("addRole", () => {
  it("adds a new role to the database", async () => {
    const company = (await seedCompanies(1))[0];
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

describe("getRolePreviews", () => {
  it("returns a list of application previews", async () => {
    const companies = await seedCompanies(3);

    const rolePreviews: RolePreview[] = await Promise.all(
      companies.map(async ({ id: company_id, name: company }) => {
        const role = await seedRole(company_id);

        return {
          company,
          ...role,
        };
      }),
    );

    const fetchedPreviews = await roleModel.getRolePreviews();

    expect(fetchedPreviews).toIncludeSameMembers(rolePreviews);
  });
});
