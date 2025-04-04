import Company, { CompanyInitializer } from "../db/hire_me/Company";

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
