import { generateApiSalaryData } from "@repo/api-types/testUtils/generators";
import { omit } from "lodash-es";
import { SalaryId } from "../../db/generated/hire_me/Salary";
import { salaryService } from "../../services/salary.service";
import { getMockReq, getMockRes } from "../../testUtils";
import {
	generateCompany,
	generateId,
	generateRole,
} from "../../testUtils/generators";
import { handleAddSalary } from "../salary.controller";

vi.mock("../../services/salary.service");

const mockAddSalary = vi.mocked(salaryService.addSalary);

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
