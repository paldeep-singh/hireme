import request from "supertest";
import api from "../../api";
import { validationErrorCodes } from "../../middleware/validation";
import Company from "../../../generatedTypes/hire_me/Company";
import {
  clearCompanyTable,
  clearRoleTable,
  seedCompanies,
} from "../../testUtils/dbHelpers";
import { generateRoleData } from "../../testUtils/index";
import db from "../../models/db";

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

describe("POST /api/role", () => {
  let company: Company;

  beforeEach(async () => {
    company = (await seedCompanies(1))[0];
  });

  afterEach(async () => {
    await clearRoleTable();
    await clearCompanyTable();
  });

  describe("when valid body is provided", () => {
    it("returns statusCode 201", async () => {
      const requirementData = generateRoleData(company.id);

      const response = await request(api)
        .post("/api/role")
        .send(requirementData);
      expect(response.status).toBe(201);
    });

    it("returns the role", async () => {
      const requirementData = generateRoleData(company.id);

      const {
        body: { id, ...rest },
      } = await request(api).post("/api/role").send(requirementData);

      expect(id).toBeNumber();
      expect(rest).toEqual(requirementData);
    });
  });

  describe("when invalid body is provided", () => {
    it("returns statusCode 400", async () => {
      const response = await request(api).post("/api/role").send({});
      expect(response.status).toBe(400);
    });

    it("returns an INVALID_DATA error message", async () => {
      const response = await request(api).post("/api/role").send({});
      expect(response.body.error).toEqual(validationErrorCodes.INVALID_DATA);
    });
  });
});
