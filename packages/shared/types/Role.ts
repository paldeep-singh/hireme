import Application from "../generated/db/hire_me/Application";
import Company from "../generated/db/hire_me/Company";
import DBContract from "../generated/db/hire_me/Contract";
import Requirement from "../generated/db/hire_me/Requirement";
import Role from "../generated/db/hire_me/Role";
import RoleLocation from "../generated/db/hire_me/RoleLocation";
import { FormattedNumberRange } from "./FormattedAttributes";

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

interface Contract
	extends Omit<DBContract, "role_id" | "salary_range" | "term"> {
	salary_range: FormattedNumberRange;
	term: string | null;
}

interface Location extends Omit<RoleLocation, "role_id" | "office_days"> {
	office_days: FormattedNumberRange;
}

export interface FetchedRoleDetails extends Omit<Role, "company_id"> {
	company: Company;
	location: Omit<RoleLocation, "role_id" | "office_days">;
	contract: Omit<Contract, "role_id" | "salary_range" | "term">;
	requirements: Omit<Requirement, "role_id">[];
	application: Omit<Application, "role_id">;
	// The values below require custom parsing, as such
	// we fetch them separately and add them to the
	// appropriate objects after parsing.
	office_days: RoleLocation["office_days"];
	salary_range: DBContract["salary_range"];
	term: DBContract["term"];
}

export interface RoleDetails extends Omit<Role, "company_id"> {
	company: Company;
	location: Location;
	contract: Contract;
	requirements: Omit<Requirement, "role_id">[];
	application: Omit<Application, "role_id">;
}
