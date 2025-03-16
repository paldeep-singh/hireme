import { requirementInitializer } from "../db/hire_me/Requirement";

export const routes = {
  AddRequirement: {
    method: "post",
    path: "/api/requirement",
    schema: requirementInitializer,
  },
};
