import Salary from "@repo/api-types/generated/api/hire_me/Salary";
import { SalaryInput } from "@repo/api-types/validators/Salary";

// This file is generated and should not be modified directly.
export interface AddSalaryRequest {
	method: "post";
	path: "/api/role/:role_id/salary";
	params: { role_id: number };
	responseBody: Salary;
	body: SalaryInput;
}
