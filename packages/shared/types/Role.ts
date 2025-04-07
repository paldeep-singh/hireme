import DBApplication from "../generated/db/hire_me/Application.js";
import DBCompany from "../generated/db/hire_me/Company.js";
import DBContract from "../generated/db/hire_me/Contract.js";
import DBRequirement from "../generated/db/hire_me/Requirement.js";
import DBRole from "../generated/db/hire_me/Role.js";
import DBRoleLocation from "../generated/db/hire_me/RoleLocation.js";
import { FormattedNumberRange } from "./FormattedAttributes.js";
import { OmitStrict } from "./utils.js";

export interface RolePreview extends DBRole {
	company: DBCompany["name"];
	location: DBRoleLocation["location"] | null;
	date_submitted: DBApplication["date_submitted"] | null;
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

interface Location extends Omit<DBRoleLocation, "role_id" | "office_days"> {
	office_days: FormattedNumberRange;
}

export interface DBRoleDetails
	extends DBRole,
		OmitStrict<DBCompany, "id">,
		OmitStrict<DBRoleLocation, "id" | "role_id">,
		OmitStrict<DBContract, "id" | "role_id">,
		OmitStrict<DBApplication, "id" | "role_id"> {
	location_id: DBRoleLocation["id"];
	contract_id: DBContract["id"];
	application_id: DBApplication["id"];
	requirements: OmitStrict<DBRequirement, "role_id">[];
}

export interface RoleDetails extends Omit<DBRole, "company_id"> {
	company: DBCompany;
	location: Location;
	contract: Contract;
	requirements: Omit<DBRequirement, "role_id">[];
	application: Omit<DBApplication, "role_id">;
}
