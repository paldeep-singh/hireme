import Salary from "@repo/api-types/generated/api/hire_me/Salary";
import { SalaryInput } from "@repo/api-types/validators/Salary";
import { StatusCodes } from "http-status-codes";
import { RoleId } from "../db/generated/hire_me/Role";
import { salaryService } from "../services/salary.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddSalary: RequestHandler<
	Salary,
	SalaryInput,
	{ role_id: number }
> = async (req, res) => {
	const salary = await salaryService.addSalary({
		...req.body,
		role_id: req.parsedParams.role_id as RoleId,
	});

	res.status(StatusCodes.CREATED).json(salary);
};
