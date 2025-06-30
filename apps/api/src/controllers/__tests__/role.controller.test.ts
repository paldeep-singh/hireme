import {
	generateApiApplicationData,
	generateApiCompany,
	generateApiRole,
	generateApiRoleDetails,
	generateApiRoleLocationData,
} from "@repo/api-types/testUtils/generators";
import { roleService } from "../../services/role.service";
import { getMockReq, getMockRes } from "../../testUtils/index";
import {
	handleAddRole,
	handleGetRoleDetails,
	handleGetRolePreviews,
} from "../role.controller";

vi.mock("../../services/role.service");

const mockCreateRole = vi.mocked(roleService.addRole);
const mockGetRolePreviews = vi.mocked(roleService.getRolePreviews);
const mockGetRoleDetails = vi.mocked(roleService.getRoleDetails);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("handleAddRole", () => {
	const { id: company_id } = generateApiCompany();
	const role = generateApiRole(company_id);

	describe("when the role is successfully added", () => {
		const req = getMockReq({
			body: {
				title: role.title,
				cover_letter: role.title,
				ad_url: role.ad_url,
			},
			parsedParams: {
				company_id,
			},
		});
		const { res, next } = getMockRes();

		beforeEach(() => {
			mockCreateRole.mockResolvedValue(role);
		});

		it("returns a 201 status code", async () => {
			await handleAddRole(req, res, next);

			expect(res.status).toHaveBeenCalledWith(201);
		});

		it("returns the role", async () => {
			await handleAddRole(req, res, next);

			expect(res.json).toHaveBeenCalledWith(role);
		});
	});
});

describe("handleGetRolePreviews", () => {
	describe("when role previews are successfully fetched", () => {
		const rolePreviews = Array.from({ length: 3 }).map(() => {
			const { id: company_id, name: company } = generateApiCompany();
			const role = generateApiRole(company_id);
			const { location } = generateApiRoleLocationData(role.id);
			const { date_submitted } = generateApiApplicationData(role.id);

			return {
				company,
				...role,
				location,
				date_submitted,
			};
		});

		beforeEach(() => {
			mockGetRolePreviews.mockResolvedValue(rolePreviews);
		});

		it("returns a 200 status code", async () => {
			const req = getMockReq();
			const { res, next } = getMockRes();
			await handleGetRolePreviews(req, res, next);

			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("returns the role previews", async () => {
			const req = getMockReq();
			const { res, next } = getMockRes();
			await handleGetRolePreviews(req, res, next);

			expect(res.json).toHaveBeenCalledWith(rolePreviews);
		});
	});
});

describe("handleGetRoleDetails", () => {
	describe("when a valid roleId is provided", () => {
		const roleDetails = generateApiRoleDetails();

		beforeEach(() => {
			mockGetRoleDetails.mockResolvedValue(roleDetails);
		});

		it("returns 200 status code", async () => {
			const req = getMockReq({
				parsedParams: { id: roleDetails.id },
			});
			const { res, next } = getMockRes();
			await handleGetRoleDetails(req, res, next);

			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("returns the role details", async () => {
			const req = getMockReq({
				parsedParams: { id: roleDetails.id },
			});
			const { res, next } = getMockRes();
			await handleGetRoleDetails(req, res, next);

			expect(res.json).toHaveBeenCalledWith(roleDetails);
		});
	});
});
