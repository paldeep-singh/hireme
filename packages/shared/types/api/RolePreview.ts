import Application from "../../generated/api/hire_me/Application.js";
import Company from "../../generated/api/hire_me/Company.js";
import Role from "../../generated/api/hire_me/Role.js";
import RoleLocation from "../../generated/api/hire_me/RoleLocation.js";

export interface RolePreview extends Role {
	company: Company["name"];
	location: RoleLocation["location"] | null;
	date_submitted: Application["date_submitted"] | null;
}
