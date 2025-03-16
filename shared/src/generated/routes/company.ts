import { companyInitializer } from "src/generated/db/hire_me/Company";

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
