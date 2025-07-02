import { generateApiCompanyData } from "@repo/api-types/testUtils/generators";
import { companyService } from "../../services/company.service";
import { generateCompany } from "../../testUtils/generators";
import { getMockReq, getMockRes } from "../../testUtils/index";
import {
	handleAddCompany,
	handleGetCompanies,
	handleUpdateCompany,
} from "../company.controller";

vi.mock("../../services/company.service");

const mockCreateCompany = vi.mocked(companyService.addCompany);
const mockGetAllCompanies = vi.mocked(companyService.getCompanies);
const mockUpdateCompany = vi.mocked(companyService.updateCompany);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("handleAddCompany", () => {
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
});

describe("handleUpdateCompany", () => {
	const company = generateCompany();

	const updates = generateApiCompanyData();

	const updatedCompany = {
		...updates,
		id: company.id,
	};

	const req = getMockReq({
		body: updatedCompany,
		parsedParams: { company_id: company.id },
	});
	const { res, next } = getMockRes();

	beforeEach(() => {
		mockUpdateCompany.mockResolvedValue(updatedCompany);
	});

	it("returns a 200 status code", async () => {
		await handleUpdateCompany(req, res, next);

		expect(res.status).toHaveBeenCalledWith(200);
	});

	it("returns the updated company", async () => {
		await handleUpdateCompany(req, res, next);

		expect(res.json).toHaveBeenCalledWith(updatedCompany);
	});
});
