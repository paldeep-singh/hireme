import Company, { CompanyInitializer } from "@repo/api-types/generated/api/hire_me/Company";
import { CompanyUpdateInput } from "@repo/api-types/validators/Company";

// This file is generated and should not be modified directly.
export interface AddCompanyRequest {
	method: "post";
	path: "/api/company";
	params: null;
	responseBody: Company;
	body: CompanyInitializer;
}

export interface GetCompaniesRequest {
	method: "get";
	path: "/api/companies";
	params: null;
	responseBody: Company[];
	body: null;
}

export interface UpdateCompanyRequest {
	method: "patch";
	path: "/api/company/:company_id";
	params: { company_id: number };
	responseBody: Company;
	body: CompanyUpdateInput;
}
