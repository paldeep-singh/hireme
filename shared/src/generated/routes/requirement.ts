import { requirementInitializer } from "src/generated/db/hire_me/Requirement.js";

export const routes = {
  AddRequirement: {
    method: "post",
    path: "/api/requirement",
    schema: requirementInitializer,
  },
};
