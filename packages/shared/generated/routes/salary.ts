import Salary, { SalaryInitializer } from "../api/hire_me/Salary.js";

// This file is generated and should not be modified directly.
export interface AddSalaryRequest {
	method: "post";
	path: "/api/salary";
	params: null;
	responseBody: Salary;
	body: SalaryInitializer;
}
