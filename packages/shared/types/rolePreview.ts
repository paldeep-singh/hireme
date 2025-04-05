import Application from "../generated/db/hire_me/Application.js";
import Company from "../generated/db/hire_me/Company.js";
import Role from "../generated/db/hire_me/Role.js";
import RoleLocation from "../generated/db/hire_me/RoleLocation.js";

export interface RolePreview extends Role {
	company: Company["name"];
	location: RoleLocation["location"] | null;
	date_submitted: Application["date_submitted"] | null;
}

export interface RolePreviewJson
	extends Omit<RolePreview, "date_added" | "date_submitted"> {
	date_added: string;
	date_submitted: string | null;
}
