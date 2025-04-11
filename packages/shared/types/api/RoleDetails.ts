import Application from "../../generated/api/hire_me/Application.js";
import Company from "../../generated/api/hire_me/Company.js";
import Contract from "../../generated/api/hire_me/Contract.js";
import Requirement from "../../generated/api/hire_me/Requirement.js";
import Role from "../../generated/api/hire_me/Role.js";
import RoleLocation from "../../generated/api/hire_me/RoleLocation.js";
import { OmitStrict } from "../utils.js";

export interface RoleDetails extends OmitStrict<Role, "company_id"> {
	company: Company;
	location: OmitStrict<RoleLocation, "role_id"> | null;
	contract: OmitStrict<Contract, "role_id"> | null;
	application: OmitStrict<Application, "role_id"> | null;
	requirements: OmitStrict<Requirement, "role_id">[] | null;
}
