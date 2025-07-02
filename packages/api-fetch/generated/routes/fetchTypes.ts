import {
	LoginRequest,
	LogoutRequest,
	ValidateSessionRequest,
} from "./admin.js";
import {
	AddApplicationRequest,
	UpdateApplicationRequest,
} from "./application.js";
import {
	AddCompanyRequest,
	GetCompaniesRequest,
	UpdateCompanyRequest,
} from "./company.js";
import {
	AddRequirementRequest,
	AddRequirementsRequest,
	UpdateRequirementRequest,
} from "./requirement.js";
import {
	AddRoleLocationRequest,
	UpdateRoleLocationRequest,
} from "./role-location.js";
import {
	AddRoleRequest,
	DeleteRoleRequest,
	GetRoleDetailsRequest,
	GetRolePreviewsRequest,
	UpdateRoleRequest,
} from "./role.js";
import { AddSalaryRequest, UpdateSalaryRequest } from "./salary.js";

// This file is generated and should not be modified directly.
export interface ApiRequests {
	Login: LoginRequest;
	ValidateSession: ValidateSessionRequest;
	Logout: LogoutRequest;
	AddApplication: AddApplicationRequest;
	UpdateApplication: UpdateApplicationRequest;
	AddCompany: AddCompanyRequest;
	GetCompanies: GetCompaniesRequest;
	UpdateCompany: UpdateCompanyRequest;
	AddRequirement: AddRequirementRequest;
	AddRequirements: AddRequirementsRequest;
	UpdateRequirement: UpdateRequirementRequest;
	AddRoleLocation: AddRoleLocationRequest;
	UpdateRoleLocation: UpdateRoleLocationRequest;
	AddRole: AddRoleRequest;
	UpdateRole: UpdateRoleRequest;
	DeleteRole: DeleteRoleRequest;
	GetRolePreviews: GetRolePreviewsRequest;
	GetRoleDetails: GetRoleDetailsRequest;
	AddSalary: AddSalaryRequest;
	UpdateSalary: UpdateSalaryRequest;
}
