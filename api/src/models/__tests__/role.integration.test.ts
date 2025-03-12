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
    const roleData = generateRoleData(company.id);

    const { id, ...rest } = await roleModel.addRole(roleData);

    expect(id).toBeNumber();
    expect(rest).toEqual(roleData);
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
