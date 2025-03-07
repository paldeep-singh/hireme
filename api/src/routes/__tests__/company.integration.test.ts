import { faker } from "@faker-js/faker";
import app from "../../app";
import request from "supertest";
import { validationErrorCodes } from "../../middleware/validation";
import Company from "../../../generatedTypes/hire_me/Company";
import { clearCompanyTable, seedCompanies } from "../../testUtils";

describe("POST /company", () => {
  describe("when valid body is provided", () => {
    it("returns statusCode 201", async () => {
      const name = faker.company.name();

      const response = await request(app).post("/company").send({ name });
      expect(response.status).toBe(201);
    });

    it("returns the company", async () => {
      const name = faker.company.name();

      const response = await request(app).post("/company").send({ name });
      expect(response.body.name).toBe(name);
      expect(typeof response.body.id).toBe("number");
    });
  });

  describe("when invalid body is provided", () => {
    it("returns statusCode 400", async () => {
      const response = await request(app).post("/company").send({});
      expect(response.status).toBe(400);
    });

    it("returns an INVALID_DATA error message", async () => {
      const response = await request(app).post("/company").send({});
      expect(response.body.error).toEqual(validationErrorCodes.INVALID_DATA);
    });
  });
});

describe("GET /companies", () => {
  let companies: Company[];
  const companyCount = faker.number.int({ min: 2, max: 10 });

  beforeEach(async () => {
    companies = await seedCompanies(companyCount);
  });

  afterEach(async () => {
    await clearCompanyTable();
  });

  it("returns statusCode 200", async () => {
    const response = await request(app).get("/companies");
    expect(response.status).toBe(200);
  });

  it("returns an array of companies", async () => {
    const response = await request(app).get("/companies");

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(companyCount);
    expect(response.body).toIncludeAllMembers(companies);
  });
});
