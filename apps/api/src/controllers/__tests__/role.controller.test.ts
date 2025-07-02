import {
	generateApiApplicationData,
	generateApiCompany,
	generateApiRole,
	generateApiRoleData,
	generateApiRoleDetails,
	generateApiRoleLocationData,
} from "@repo/api-types/testUtils/generators";
import { roleService } from "../../services/role.service";
import { getMockReq, getMockRes } from "../../testUtils/index";
import {
	handleAddRole,
	handleDeleteRole,
	handleGetRoleDetails,
	handleGetRolePreviews,
	handleUpdateRole,
} from "../role.controller";

vi.mock("../../services/role.service");

const mockCreateRole = vi.mocked(roleService.addRole);
const mockGetRolePreviews = vi.mocked(roleService.getRolePreviews);
const mockGetRoleDetails = vi.mocked(roleService.getRoleDetails);
const mockUpdateRole = vi.mocked(roleService.updateRole);
const mockDeleteRole = vi.mocked(roleService.deleteRole);

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

describe("handleUpdateRole", () => {
	const { id: company_id } = generateApiCompany();

	const role = generateApiRole(company_id);

	const {
		company_id: _,
		date_added: __,
		...updates
	} = generateApiRoleData(company_id);

	describe("when the role is successfully updated", () => {
		const req = getMockReq({
			body: updates,
			parsedParams: {
				role_id: role.id,
			},
		});
		const { res, next } = getMockRes();

		beforeEach(() => {
			mockUpdateRole.mockResolvedValue({
				...role,
				...updates,
			});
		});

		it("returns a 200 status code", async () => {
			await handleUpdateRole(req, res, next);

			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("returns the updated role", async () => {
			await handleUpdateRole(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				...role,
				...updates,
			});
		});
	});
});

describe("handleDeleteRole", () => {
	const company = generateApiCompany();
	const role = generateApiRole(company.id);

	it("deletes the role from the database", async () => {
		const req = getMockReq({
			parsedParams: { role_id: role.id },
		});

		const { res, next } = getMockRes();

		await handleDeleteRole(req, res, next);

		expect(mockDeleteRole).toHaveBeenCalledExactlyOnceWith(role.id);
	});

	it("returns status code 204", async () => {
		const req = getMockReq({
			parsedParams: role.id,
		});

		const { res, next } = getMockRes();

		await handleDeleteRole(req, res, next);

		expect(res.status).toHaveBeenCalledWith(204);
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
