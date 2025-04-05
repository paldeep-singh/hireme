import Application from "../generated/db/hire_me/Application";
import Company from "../generated/db/hire_me/Company";
import Contract from "../generated/db/hire_me/Contract";
import Requirement from "../generated/db/hire_me/Requirement";
import Role from "../generated/db/hire_me/Role";
import RoleLocation from "../generated/db/hire_me/RoleLocation";

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

export interface RoleDetails extends Role {
	company: Company;
	location: RoleLocation | null;
	contract: Contract | null;
	requirements: Requirement[] | null;
	date_submitted: Application["date_submitted"] | null;
}
