import Company, { CompanyInitializer } from "@repo/api-types/generated/api/hire_me/Company";

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
