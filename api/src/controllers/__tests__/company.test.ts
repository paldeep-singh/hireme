import { getMockReq, getMockRes } from "@jest-mock/express";
import { companyModel } from "../../models/company";
import {
  CompanyErrorCodes,
  handleCreateCompany,
  handleGetAllCompanies,
} from "../company";
import { CompanyId } from "../../../generatedTypes/hire_me/Company";
import { faker } from "@faker-js/faker/.";

jest.mock("../../models/company");

console.log(companyModel);

const mockCreateCompany = jest.mocked(companyModel.createCompany);
const mockGetAllCompanies = jest.mocked(companyModel.getAllCompanies);
const mockCheckCompanyExists = jest.mocked(companyModel.checkCompanyExists);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("handleCreateCompany", () => {
  describe("when the company does not exist", () => {
    beforeEach(() => {
      mockCheckCompanyExists.mockResolvedValue(false);
    });

    describe("when the company is successfully created", () => {
      const companyName = faker.company.name();

      const req = getMockReq({
        body: {
          name: companyName,
        },
      });
      const { res, next } = getMockRes();

      const company = {
        id: faker.number.int({ max: 100 }) as CompanyId,
        name: companyName,
      };

      beforeEach(() => {
        mockCreateCompany.mockResolvedValue(company);
      });

      it("returns a 201 status code", async () => {
        await handleCreateCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
      });

      it("returns the company", async () => {
        await handleCreateCompany(req, res, next);

        expect(res.json).toHaveBeenCalledWith(company);
      });
    });

    describe("when there is an error creating the company", () => {
      const req = getMockReq({
        body: {
          name: faker.company.name(),
        },
      });
      const { res, next } = getMockRes();
      const errorMessage = "Database query failed";
      const error = new Error(errorMessage);

      beforeEach(() => {
        mockCreateCompany.mockRejectedValue(error);
      });

      it("returns a 500 status code", async () => {
        await handleCreateCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
      });

      it("returns an error message", async () => {
        await handleCreateCompany(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
          error: error.message,
        });
      });
    });
  });

  describe("when the company already exists", () => {
    const { res, next } = getMockRes();
    const companyName = faker.company.name();

    const req = getMockReq({
      body: {
        name: companyName,
      },
    });

    beforeEach(() => {
      mockCheckCompanyExists.mockResolvedValue(true);
    });

    it("returns a 409 status code", async () => {
      await handleCreateCompany(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("returns a COMPANY_EXISTS error", async () => {
      await handleCreateCompany(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: CompanyErrorCodes.COMPANY_EXISTS,
      });
    });
  });
});

describe("handleGetAllCompanies", () => {
  const req = getMockReq();
  const { res, next } = getMockRes();
  describe("when companies are successfully fetched from the database", () => {
    const companies = [
      {
        id: faker.number.int({ max: 100 }) as CompanyId,
        name: faker.company.name(),
      },
      {
        id: faker.number.int({ max: 100 }) as CompanyId,
        name: faker.company.name(),
      },
    ];

    beforeEach(() => {
      mockGetAllCompanies.mockResolvedValue(companies);
    });

    it("returns the companies", async () => {
      await handleGetAllCompanies(req, res, next);

      expect(res.json).toHaveBeenCalledWith(companies);
    });
  });

  describe("when there is an error getting the companies", () => {
    const errorMessage = "Database query failed";
    const error = new Error(errorMessage);

    beforeEach(() => {
      mockGetAllCompanies.mockRejectedValue(error);
    });

    it("returns a 500 status code", async () => {
      await handleGetAllCompanies(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("returns an error message", async () => {
      await handleGetAllCompanies(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });
  });
});
