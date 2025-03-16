import { faker } from "@faker-js/faker";
import api from "../../api";
import request from "supertest";
import { validationErrorCodes } from "../../middleware/validation";
import Company from "shared/src/generated/db/hire_me/Company";
import { clearCompanyTable, seedCompanies } from "../../testUtils/dbHelpers";
import db from "../../models/db";
import { generateCompanyData } from "../../testUtils";

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

describe("POST /api/company", () => {
  describe("when valid body is provided", () => {
    it("returns statusCode 201", async () => {
      const company = generateCompanyData();

      const response = await request(api).post("/api/company").send(company);
      expect(response.status).toBe(201);
    });

    it("returns the company", async () => {
      const company = generateCompanyData();

      const {
        body: { id, ...rest },
      } = await request(api).post("/api/company").send(company);

      expect(rest).toEqual(company);
      expect(id).toBeNumber();
    });
  });

  describe("when invalid body is provided", () => {
    it("returns statusCode 400", async () => {
      const response = await request(api).post("/api/company").send({});
      expect(response.status).toBe(400);
    });

    it("returns an INVALID_DATA error message", async () => {
      const response = await request(api).post("/api/company").send({});
      expect(response.body.error).toEqual(validationErrorCodes.INVALID_DATA);
    });
  });
});

describe("GET /api/companies", () => {
  let companies: Company[];
  const companyCount = faker.number.int({ min: 2, max: 10 });

  beforeEach(async () => {
    companies = await seedCompanies(companyCount);
  });

  afterEach(async () => {
    await clearCompanyTable();
  });

  it("returns statusCode 200", async () => {
    const response = await request(api).get("/api/companies");
    expect(response.status).toBe(200);
  });

  it("returns an array of companies", async () => {
    const response = await request(api).get("/api/companies");

    expect(response.body).toIncludeSameMembers(companies);
  });
});
