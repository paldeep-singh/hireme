import { faker } from "@faker-js/faker";
import { RoleId } from "shared/generated/hire_me/Role";
import { roleModel } from "../../models/role";
import { handleAddRole, handleGetRolePreviews } from "../role";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { generateCompanyData, generateRoleData } from "../../testUtils";
import { CompanyId } from "shared/generated/hire_me/Company";

jest.mock("../../models/role");

const mockCreateRole = jest.mocked(roleModel.addRole);
const mockGetRolePreviews = jest.mocked(roleModel.getRolePreviews);

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

describe("handleGetRolePreviews", () => {
  describe("when role previews are successfully fetched", () => {
    const rolePreviews = Array.from({ length: 3 }).map(() => {
      const company_id = faker.number.int({ max: 100 }) as CompanyId;
      const { name: company } = generateCompanyData();

      return {
        id: faker.number.int({ max: 100 }) as RoleId,
        company,
        ...generateRoleData(company_id),
      };
    });

    beforeEach(() => {
      mockGetRolePreviews.mockResolvedValue(rolePreviews);
    });

    it("returns a 200 status code", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();
      await handleGetRolePreviews(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("returns the companies", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();
      await handleGetRolePreviews(req, res, next);

      expect(res.json).toHaveBeenCalledWith(rolePreviews);
    });
  });

  describe("when there is an error fetching the previews", () => {
    const errorMessage = "Database query failed";
    const error = new Error(errorMessage);

    beforeEach(() => {
      mockGetRolePreviews.mockRejectedValue(error);
    });

    it("returns a 500 status code", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();
      await handleGetRolePreviews(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("returns the error message", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();
      await handleGetRolePreviews(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });
  });
});
