import { LoginRequest, ValidateSessionRequest } from "./admin.js";
import { AddCompanyRequest, GetCompaniesRequest } from "./company.js";
import { AddRequirementRequest } from "./requirement.js";
import { AddRoleRequest, GetRolePreviewsRequest } from "./role.js";

export interface ApiRequests {
	Login: LoginRequest;
	ValidateSession: ValidateSessionRequest;
	AddCompany: AddCompanyRequest;
	GetCompanies: GetCompaniesRequest;
	AddRequirement: AddRequirementRequest;
	AddRole: AddRoleRequest;
	GetRolePreviews: GetRolePreviewsRequest;
}
