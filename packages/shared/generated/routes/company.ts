import DBCompany, { DBCompanyInitializer } from "../db/hire_me/Company.js";

// This file is generated and should not be modified directly.
export interface AddCompanyRequest {
	method: "post";
	path: "/api/company";
	responseBody: DBCompany;
	body: DBCompanyInitializer;
}

export interface GetCompaniesRequest {
	method: "get";
	path: "/api/companies";
	responseBody: DBCompany[];
	body: null;
}
