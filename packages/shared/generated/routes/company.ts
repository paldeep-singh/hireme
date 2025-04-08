import Company, { CompanyInitializer } from "../api/hire_me/Company.js";

// This file is generated and should not be modified directly.
export interface AddCompanyRequest {
	method: "post";
	path: "/api/company";
	responseBody: Company;
	body: CompanyInitializer;
}

export interface GetCompaniesRequest {
	method: "get";
	path: "/api/companies";
	responseBody: Company[];
	body: null;
}
