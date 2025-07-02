import {
	generateApiSalary,
	generateApiSalaryData,
} from "@repo/api-types/testUtils/generators";
import { omit } from "lodash-es";
import { SalaryId } from "../../db/generated/hire_me/Salary";
import { salaryService } from "../../services/salary.service";
import { getMockReq, getMockRes } from "../../testUtils";
import {
	generateCompany,
	generateId,
	generateRole,
} from "../../testUtils/generators";
import { handleAddSalary, handleUpdateSalary } from "../salary.controller";

vi.mock("../../services/salary.service");

const mockAddSalary = vi.mocked(salaryService.addSalary);
const mockUpdateSalary = vi.mocked(salaryService.updateSalary);

describe("handleAddSalary", () => {
	describe("when the salary is successfully added", () => {
		const company = generateCompany();

		const role = generateRole(company.id);

		const salaryData = generateApiSalaryData(role.id);

		const salaryInput = omit(salaryData, ["role_id"]);

		const salaryId = generateId<SalaryId>();

		const req = getMockReq({
			body: salaryInput,
			parsedParams: { role_id: role.id },
		});
		const { res, next } = getMockRes();

		beforeEach(() => {
			mockAddSalary.mockResolvedValue({
				id: salaryId,
				...salaryData,
			});
		});

		it("returns 201 status code", async () => {
			await handleAddSalary(req, res, next);

			expect(res.status).toHaveBeenCalledWith(201);
		});

		it("returns the salary", async () => {
			await handleAddSalary(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				id: salaryId,
				...salaryData,
			});
		});
	});
});

describe("handleUpdateSalary", () => {
	describe("when the salary is successfully updated", () => {
		const company = generateCompany();

		const role = generateRole(company.id);

		const salary = generateApiSalary(role.id);

		const { role_id: _, ...updates } = generateApiSalaryData(role.id);

		const req = getMockReq({
			body: updates,
			parsedParams: { role_id: role.id },
		});
		const { res, next } = getMockRes();

		beforeEach(() => {
			mockUpdateSalary.mockResolvedValue({
				id: salary.id,
				...updates,
				role_id: role.id,
			});
		});

		it("returns 200 status code", async () => {
			await handleUpdateSalary(req, res, next);

			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("returns the salary", async () => {
			await handleUpdateSalary(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				...updates,
				id: salary.id,
				role_id: role.id,
			});
		});
	});
});
