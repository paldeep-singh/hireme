import { faker } from "@faker-js/faker";
import { RoleId } from "../../../generatedTypes/hire_me/Role";
import { roleModel } from "../../models/role";
import { handleCreateRole } from "../role";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { CompanyId } from "../../../generatedTypes/hire_me/Company";

jest.mock("../../models/role");

const mockCreateRole = jest.mocked(roleModel.createRole);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("handleCreateRole", () => {
  const role = {
    id: faker.number.int({ max: 100 }) as RoleId,
    company_id: faker.number.int({ max: 100 }) as CompanyId,
    title: faker.lorem.words(),
    cover_letter: faker.lorem.paragraph(),
    ad_url: faker.internet.url(),
  };
  describe("when the role is successfully created", () => {
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
      await handleCreateRole(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("returns the role", async () => {
      await handleCreateRole(req, res, next);

      expect(res.json).toHaveBeenCalledWith(role);
    });
  });

  describe("when there is an error creating the role", () => {
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
      await handleCreateRole(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("returns an error message", async () => {
      await handleCreateRole(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });
});
