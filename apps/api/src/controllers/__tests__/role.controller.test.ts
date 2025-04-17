import { roleService } from "../../services/role.service";
import {
	generateApplicationData,
	generateCompany,
	generateRole,
	generateRoleLocationData,
} from "../../testUtils/generators";
import { getMockReq, getMockRes } from "../../testUtils/index";
import { handleAddRole, handleGetRolePreviews } from "../role.controller";

vi.mock("../../services/role.service");

const mockCreateRole = vi.mocked(roleService.addRole);
const mockGetRolePreviews = vi.mocked(roleService.getRolePreviews);

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
