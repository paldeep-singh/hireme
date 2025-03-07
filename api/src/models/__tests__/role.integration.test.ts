import { faker } from "@faker-js/faker";
import Company from "../../../generatedTypes/hire_me/Company";
import {
  clearCompanyTable,
  clearRoleTable,
  seedCompanies,
} from "../../testUtils";
import { roleModel } from "../role";
import db from "../db";

afterAll(() => {
  db.$pool.end();
});

let company: Company;

beforeEach(async () => {
  company = (await seedCompanies(1))[0];
});

afterEach(async () => {
  await clearRoleTable();
  await clearCompanyTable();
});

describe("createRole", () => {
  describe("when ad_url is not provided", () => {
    it("adds a new role to the database with null for ad_url", async () => {
      const title = faker.lorem.words();
      const cover_letter = faker.lorem.paragraph();

      const createdRole = await roleModel.createRole({
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
      const title = faker.lorem.words();
      const cover_letter = faker.lorem.paragraph();
      const ad_url = faker.internet.url();

      const createdRole = await roleModel.createRole({
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
