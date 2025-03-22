import Company, { companyInitializer } from "../db/hire_me/Company.js";

export const AddCompany = {
  method: "post",
  path: "/api/company",
  schema: companyInitializer,
} as const;
export const GetCompanies = {
  method: "get",
  path: "/api/companies",
} as const;

export type AddCompanyReturnType = Company;
export type GetCompaniesReturnType = Company[];
