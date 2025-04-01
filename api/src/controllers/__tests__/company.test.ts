import { faker } from "@faker-js/faker";
import { generateCompany } from "@repo/shared/testHelpers/generators.js";
import { companyErrorCodes, companyModel } from "../../models/company.js";
import { getMockReq, getMockRes } from "../../testUtils/index.js";
import { handleAddCompany, handleGetCompanies } from "../company.js";

vi.mock("../../models/company");

const mockCreateCompany = vi.mocked(companyModel.addCompany);
const mockGetAllCompanies = vi.mocked(companyModel.getCompanies);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("handleAddCompany", () => {
	describe("when the company does not exist", () => {
		describe("when the company is successfully added", () => {
			const company = generateCompany();

			const req = getMockReq({
				body: company,
			});
			const { res, next } = getMockRes();

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
				...generateCompany(),
			},
			{
				...generateCompany(),
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
