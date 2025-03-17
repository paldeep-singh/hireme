import Role from "shared/generated/db/hire_me/Role.js";
import api from "../../api.js";
import { validationErrorCodes } from "../../middleware/validation.js";
import db from "../../models/db.js";
import { generateRequirementData } from "../../testUtils/index.js";
import { seedCompanies, seedRole } from "../../testUtils/dbHelpers.js";
import request from "supertest";

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

describe("POST /api/requirement", () => {
  let role: Role;

  beforeEach(async () => {
    const company = (await seedCompanies(1))[0];
    role = await seedRole(company.id);
  });

  describe("when valid body is provided", () => {
    it("returns status code 201", async () => {
      const requirementData = generateRequirementData(role.id);

      const response = await request(api)
        .post("/api/requirement")
        .send(requirementData);

      expect(response.status).toEqual(201);
    });

    it("returns the requirement", async () => {
      const requirmentData = generateRequirementData(role.id);

      const {
        body: { id, ...rest },
      } = await request(api).post("/api/requirement").send(requirmentData);

      expect(id).toBeNumber();
      expect(rest).toEqual(requirmentData);
    });
  });

  describe("when invalid body is provided", () => {
    it("returns statusCode 400", async () => {
      const response = await request(api).post("/api/requirement").send({});
      expect(response.status).toBe(400);
    });

    it("returns an INVALID_DATA error message", async () => {
      const response = await request(api).post("/api/requirement").send({});
      expect(response.body.error).toEqual(validationErrorCodes.INVALID_DATA);
    });
  });
});
