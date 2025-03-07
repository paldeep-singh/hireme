import { getMockReq, getMockRes } from "@jest-mock/express";
import { companyModel } from "../../models/company";
import { handleAddCompany, handleGetCompanies } from "../company";
import { companyErrorCodes } from "../../models/company";
import { CompanyId } from "../../../generatedTypes/hire_me/Company";
import { faker } from "@faker-js/faker/.";

jest.mock("../../models/company");

const mockCreateCompany = jest.mocked(companyModel.addCompany);
const mockGetAllCompanies = jest.mocked(companyModel.getCompanies);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("handleAddCompany", () => {
  describe("when the company does not exist", () => {
    describe("when the company is successfully added", () => {
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
        await handleAddCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
      });

      it("returns the company", async () => {
        await handleAddCompany(req, res, next);

        expect(res.json).toHaveBeenCalledWith(company);
      });
    });

    describe("when there is an error adding the company", () => {
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
        await handleAddCompany(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
      });

      it("returns an error message", async () => {
        await handleAddCompany(req, res, next);

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
      mockCreateCompany.mockRejectedValue(
        new Error(companyErrorCodes.COMPANY_EXISTS),
      );
    });

    it("returns a 409 status code", async () => {
      await handleAddCompany(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("returns a COMPANY_EXISTS error", async () => {
      await handleAddCompany(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: companyErrorCodes.COMPANY_EXISTS,
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
      await handleGetCompanies(req, res, next);

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
      await handleGetCompanies(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("returns an error message", async () => {
      await handleGetCompanies(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });
  });
});
