import Salary, {
	SalaryInitializer,
} from "@repo/api-types/generated/api/hire_me/Salary";

// This file is generated and should not be modified directly.
export interface AddSalaryRequest {
	method: "post";
	path: "/api/salary";
	params: null;
	responseBody: Salary;
	body: SalaryInitializer;
}
