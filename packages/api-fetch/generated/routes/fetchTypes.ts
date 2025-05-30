import {
	LoginRequest,
	LogoutRequest,
	ValidateSessionRequest,
} from "./admin.js";
import { AddApplicationRequest } from "./application.js";
import { AddCompanyRequest, GetCompaniesRequest } from "./company.js";
import {
	AddRequirementRequest,
	AddRequirementsRequest,
} from "./requirement.js";
import { AddRoleLocationRequest } from "./role-location.js";
import {
	AddRoleRequest,
	GetRoleDetailsRequest,
	GetRolePreviewsRequest,
} from "./role.js";
import { AddSalaryRequest } from "./salary.js";

// This file is generated and should not be modified directly.
export interface ApiRequests {
	Login: LoginRequest;
	ValidateSession: ValidateSessionRequest;
	Logout: LogoutRequest;
	AddApplication: AddApplicationRequest;
	AddCompany: AddCompanyRequest;
	GetCompanies: GetCompaniesRequest;
	AddRequirement: AddRequirementRequest;
	AddRequirements: AddRequirementsRequest;
	AddRoleLocation: AddRoleLocationRequest;
	AddRole: AddRoleRequest;
	GetRolePreviews: GetRolePreviewsRequest;
	GetRoleDetails: GetRoleDetailsRequest;
	AddSalary: AddSalaryRequest;
}
