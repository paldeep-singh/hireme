import Salary, {
	SalaryInitializer,
} from "@repo/api-types/generated/api/hire_me/Salary";
import { StatusCodes } from "http-status-codes";
import { salaryService } from "../services/salary.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddSalary: RequestHandler<
	Salary,
	SalaryInitializer
> = async (req, res) => {
	const salary = await salaryService.addSalary(req.body);

	res.status(StatusCodes.CREATED).json(salary);
};
