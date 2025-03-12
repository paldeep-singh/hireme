import { faker } from "@faker-js/faker";
import { RoleId } from "../../../generatedTypes/hire_me/Role";
import { roleModel } from "../../models/role";
import { handleAddRole } from "../role";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { generateRoleData } from "../../testUtils";

jest.mock("../../models/role");

const mockCreateRole = jest.mocked(roleModel.addRole);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("handleAddRole", () => {
  const role = {
    id: faker.number.int({ max: 100 }) as RoleId,
    ...generateRoleData(faker.number.int({ max: 100 })),
  };
  describe("when the role is successfully added", () => {
    const req = getMockReq({
      body: {
        title: role.title,
        cover_letter: role.title,
        ad_url: role.ad_url,
      },
    });
    const { res, next } = getMockRes();

    beforeEach(() => {
      mockCreateRole.mockResolvedValue(role);
    });

    it("returns a 201 status code", async () => {
      await handleAddRole(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("returns the role", async () => {
      await handleAddRole(req, res, next);

      expect(res.json).toHaveBeenCalledWith(role);
    });
  });

  describe("when there is an error adding the role", () => {
    const req = getMockReq({
      body: {
        title: role.title,
        cover_letter: role.title,
        ad_url: role.ad_url,
      },
    });
    const { res, next } = getMockRes();

    const errorMessage = "Database query failed";

    beforeEach(() => {
      mockCreateRole.mockRejectedValue(new Error(errorMessage));
    });

    it("returns a 500 status code", async () => {
      await handleAddRole(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("returns an error message", async () => {
      await handleAddRole(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });
});
