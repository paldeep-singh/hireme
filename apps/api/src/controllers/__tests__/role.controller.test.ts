import { faker } from "@faker-js/faker";
import { generateApiRoleDetails } from "@repo/api-types/testUtils/generators";
import { roleService } from "../../services/role.service";
import {
	generateApplicationData,
	generateCompany,
	generateRole,
	generateRoleLocationData,
} from "../../testUtils/generators";
import {
	expectThrowsAppError,
	getMockReq,
	getMockReqWithParams,
	getMockRes,
} from "../../testUtils/index";
import {
	handleAddRole,
	handleGetRoleDetails,
	handleGetRolePreviews,
	roleErrorMessages,
} from "../role.controller";

vi.mock("../../services/role.service");

const mockCreateRole = vi.mocked(roleService.addRole);
const mockGetRolePreviews = vi.mocked(roleService.getRolePreviews);
const mockGetRoleDetails = vi.mocked(roleService.getRoleDetails);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("handleAddRole", () => {
	const { id: company_id } = generateCompany();
	const role = generateRole(company_id);

	const parsedRole = {
		...role,
		date_added: role.date_added.toISOString(),
	};

	describe("when the role is successfully added", () => {
		const req = getMockReq({
			body: {
				title: role.title,
				cover_letter: role.title,
				ad_url: role.ad_url,
			},
		});
		const { res, next } = getMockRes();

		beforeEach(() => {
			mockCreateRole.mockResolvedValue(parsedRole);
		});

		it("returns a 201 status code", async () => {
			await handleAddRole(req, res, next);

			expect(res.status).toHaveBeenCalledWith(201);
		});

		it("returns the role", async () => {
			await handleAddRole(req, res, next);

			expect(res.json).toHaveBeenCalledWith(parsedRole);
		});
	});
});

describe("handleGetRolePreviews", () => {
	describe("when role previews are successfully fetched", () => {
		const rolePreviews = Array.from({ length: 3 }).map(() => {
			const { id: company_id, name: company } = generateCompany();
			const role = generateRole(company_id);
			const { location } = generateRoleLocationData(role.id);
			const { date_submitted } = generateApplicationData(role.id);

			return {
				company,
				...role,
				location,
				date_submitted,
			};
		});

		const rolePreviewsResponse = rolePreviews.map((rp) => ({
			...rp,
			date_added: rp.date_added.toISOString(),
			date_submitted: rp.date_submitted?.toISOString() ?? null,
		}));

		beforeEach(() => {
			mockGetRolePreviews.mockResolvedValue(rolePreviewsResponse);
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

			expect(res.json).toHaveBeenCalledWith(rolePreviewsResponse);
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
			const req = getMockReqWithParams({ id: roleDetails.id.toString() });
			const { res, next } = getMockRes();
			await handleGetRoleDetails(req, res, next);

			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("returns the role details", async () => {
			const req = getMockReqWithParams({ id: roleDetails.id.toString() });
			const { res, next } = getMockRes();
			await handleGetRoleDetails(req, res, next);

			expect(res.json).toHaveBeenCalledWith(roleDetails);
		});
	});

	describe("when an invalid role id is provided", () => {
		it("throws an AppError", async () => {
			const req = getMockReqWithParams({ id: faker.lorem.word() });
			const { res, next } = getMockRes();

			expectThrowsAppError(
				async () => handleGetRoleDetails(req, res, next),
				400,
				roleErrorMessages.INVALID_ROLE_ID,
				true,
			);
		});
	});
});
