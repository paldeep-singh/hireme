import Salary, {
	SalaryInitializer,
} from "@repo/api-types/generated/api/hire_me/Salary";
import { toNumrangeObject } from "@repo/api-types/utils/numrange";
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

export const salaryService = {
	addSalary,
};
