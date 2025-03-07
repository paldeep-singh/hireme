import { faker } from "@faker-js/faker/.";
import { requirementModel } from "../../models/requirement";
import Requirement, {
  RequirementId,
} from "../../../generatedTypes/hire_me/Requirement";
import { RoleId } from "../../../generatedTypes/hire_me/Role";
import { getRandomMatchLevel } from "../../testUtils";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { handleAddRequirement } from "../requirement";

jest.mock("../../models/requirement");

const mockAddRequirement = jest.mocked(requirementModel.addRequirement);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("handleAddRequirement", () => {
  const requirement: Requirement = {
    id: faker.number.int({ max: 100 }) as RequirementId,
    role_id: faker.number.int({ max: 100 }) as RoleId,
    bonus: faker.datatype.boolean(),
    description: faker.lorem.sentence(),
    match_justification: faker.lorem.sentence(),
    match_level: getRandomMatchLevel(),
  };

  describe("when the requirement is successfully added", () => {
    const req = getMockReq({
      body: {
        role_id: requirement.role_id,
        bonus: requirement.bonus,
        description: requirement.description,
        match_justification: requirement.description,
        match_level: requirement.match_level,
      },
    });

    const { res, next } = getMockRes();

    beforeEach(() => {
      mockAddRequirement.mockResolvedValue(requirement);
    });

    it("returns 201 status code", async () => {
      await handleAddRequirement(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("returns the requirement", async () => {
      await handleAddRequirement(req, res, next);

      expect(res.json).toHaveBeenCalledWith(requirement);
    });
  });

  describe("when there is an error adding the requirement", () => {
    const req = getMockReq({
      body: {
        role_id: requirement.role_id,
        bonus: requirement.bonus,
        description: requirement.description,
        match_justification: requirement.description,
        match_level: requirement.match_level,
      },
    });

    const { res, next } = getMockRes();

    const errorMessage = "Database query failed";

    beforeEach(() => {
      mockAddRequirement.mockRejectedValue(new Error(errorMessage));
    });

    it("returns status code 500", async () => {
      await handleAddRequirement(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("returns an error message", async () => {
      await handleAddRequirement(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });
});
