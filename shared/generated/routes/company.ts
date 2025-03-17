import { companyInitializer } from "../db/hire_me/Company.js";

export const routes = {
  AddCompany: {
    method: "post",
    path: "/api/company",
    schema: companyInitializer,
  },
  GetCompanies: {
    method: "get",
    path: "/api/companies",
  },
};
