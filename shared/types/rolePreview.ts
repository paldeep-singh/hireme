import Company from "generated/db/hire_me/Company.js";
import Role from "generated/db/hire_me/Role.js";

export interface RolePreview extends Role {
	company: Company["name"];
}
