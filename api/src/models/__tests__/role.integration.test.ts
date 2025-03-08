import Company from "../../../generatedTypes/hire_me/Company";
import {
  clearCompanyTable,
  clearRoleTable,
  generateRoleData,
  seedCompanies,
} from "../../testUtils";
import { roleModel } from "../role";

let company: Company;

beforeEach(async () => {
  company = (await seedCompanies(1))[0];
});

afterEach(async () => {
  await clearRoleTable();
  await clearCompanyTable();
});

describe("addRole", () => {
  describe("when ad_url is not provided", () => {
    it("adds a new role to the database with null for ad_url", async () => {
      const { title, cover_letter } = generateRoleData({
        companyId: company.id,
        hasAdUrl: false,
      });

      const createdRole = await roleModel.addRole({
        title,
        company_id: company.id,
        cover_letter,
      });

      expect(createdRole.title).toEqual(title);
      expect(createdRole.company_id).toEqual(company.id);
      expect(createdRole.cover_letter).toEqual(cover_letter);
      expect(createdRole.ad_url).toBeNull();
      expect(createdRole.id).toBeNumber();
    });
  });

  describe("when ad_url is provided", () => {
    it("adds a new role to the database with the provided ad_url", async () => {
      const { title, cover_letter, ad_url } = generateRoleData({
        companyId: company.id,
        hasAdUrl: true,
      });

      const createdRole = await roleModel.addRole({
        title,
        company_id: company.id,
        cover_letter,
        ad_url,
      });

      expect(createdRole.title).toEqual(title);
      expect(createdRole.company_id).toEqual(company.id);
      expect(createdRole.cover_letter).toEqual(cover_letter);
      expect(createdRole.ad_url).toEqual(ad_url);
      expect(createdRole.id).toBeNumber();
    });
  });
});
