import Application from "../generated/db/hire_me/Application.js";
import Company from "../generated/db/hire_me/Company.js";
import Role from "../generated/db/hire_me/Role.js";
import RoleLocation from "../generated/db/hire_me/RoleLocation.js";

export interface RolePreview extends Role {
	company: Company["name"];
	location: RoleLocation["location"] | null;
	submitted: Application["submitted"] | null;
}

export interface RolePreviewJson extends Omit<RolePreview, "date_added"> {
	date_added: string;
}
