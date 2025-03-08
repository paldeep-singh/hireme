import Role from "../../../generatedTypes/hire_me/Role";
import api from "../../api";
import { validationErrorCodes } from "../../middleware/validation";
import {
  generateRequirementData,
  seedCompanies,
  seedRole,
} from "../../testUtils";
import request from "supertest";

describe("POST /api/requirement", () => {
  let role: Role;

  beforeEach(async () => {
    const company = (await seedCompanies(1))[0];
    role = await seedRole({ companyId: company.id, hasAdUrl: true });
  });

  describe("when valid body is provided", () => {
    it("returns status code 201", async () => {
      const requirement = generateRequirementData(role.id);

      const response = await request(api)
        .post("/api/requirement")
        .send(requirement);

      expect(response.status).toEqual(201);
    });

    it("returns the requirement", async () => {
      const requirement = generateRequirementData(role.id);

      const response = await request(api)
        .post("/api/requirement")
        .send(requirement);

      expect(response.body.description).toEqual(requirement.description);
      expect(response.body.match_level).toEqual(requirement.match_level);
      expect(response.body.match_justification).toEqual(
        requirement.match_justification,
      );
      expect(response.body.bonus).toEqual(requirement.bonus);
      expect(response.body.role_id).toEqual(requirement.role_id);
      expect(response.body.id).toBeNumber();
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
