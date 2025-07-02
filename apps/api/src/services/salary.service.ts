import Salary, {
	SalaryInitializer,
} from "@repo/api-types/generated/api/hire_me/Salary";
import { toNumrangeObject } from "@repo/api-types/utils/numrange";
import { SalaryUpdateInput } from "@repo/api-types/validators/Salary";
import { SalaryId } from "../db/generated/hire_me/Salary";
import { salaryModel } from "../models/salary.model";
import { toPostgresNumRange } from "../utils/postgresRange";

async function addSalary(salaryDetails: SalaryInitializer): Promise<Salary> {
	const newSalary = await salaryModel.addSalary({
		...salaryDetails,
		salary_range: toPostgresNumRange(
			salaryDetails.salary_range,
			"salary_range",
		)!,
	});

	return {
		...newSalary,
		salary_range: toNumrangeObject(newSalary.salary_range),
	};
}

async function updateSalary(
	{ salary_range, ...updates }: SalaryUpdateInput,
	id: SalaryId,
): Promise<Salary> {
	const updatedSalary = await salaryModel.updateSalary(
		{
			...updates,
			...(salary_range && {
				salary_range: toPostgresNumRange(salary_range, "salary_range")!,
			}),
		},
		id,
	);

	return {
		...updatedSalary,
		salary_range: toNumrangeObject(updatedSalary.salary_range),
	};
}

export const salaryService = {
	addSalary,
	updateSalary,
};
