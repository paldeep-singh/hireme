import DBApplication from "../../generated/db/hire_me/Application.js";
import DBCompany from "../../generated/db/hire_me/Company.js";
import DBRole from "../../generated/db/hire_me/Role.js";
import DBRoleLocation from "../../generated/db/hire_me/RoleLocation.js";

export default interface DBRolePreview extends DBRole {
	company: DBCompany["name"];
	location: DBRoleLocation["location"] | null;
	date_submitted: DBApplication["date_submitted"] | null;
}
