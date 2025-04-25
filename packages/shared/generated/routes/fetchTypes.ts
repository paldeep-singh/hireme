import {
	LoginRequest,
	LogoutRequest,
	ValidateSessionRequest,
} from "./admin.js";
import { AddCompanyRequest, GetCompaniesRequest } from "./company.js";
import { AddRequirementRequest } from "./requirement.js";
import {
	AddRoleRequest,
	GetRoleDetailsRequest,
	GetRolePreviewsRequest,
} from "./role.js";

// This file is generated and should not be modified directly.
export interface ApiRequests {
	Login: LoginRequest;
	ValidateSession: ValidateSessionRequest;
	Logout: LogoutRequest;
	AddCompany: AddCompanyRequest;
	GetCompanies: GetCompaniesRequest;
	AddRequirement: AddRequirementRequest;
	AddRole: AddRoleRequest;
	GetRolePreviews: GetRolePreviewsRequest;
	GetRoleDetails: GetRoleDetailsRequest;
}
