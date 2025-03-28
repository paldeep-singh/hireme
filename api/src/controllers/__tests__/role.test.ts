import {
	generateCompany,
	generateRole,
} from "shared/testHelpers/generators.js";
import { roleModel } from "../../models/role.js";
import { getMockReq, getMockRes } from "../../testUtils/index.js";
import { handleAddRole, handleGetRolePreviews } from "../role.js";

vi.mock("../../models/role");

const mockCreateRole = vi.mocked(roleModel.addRole);
const mockGetRolePreviews = vi.mocked(roleModel.getRolePreviews);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("handleAddRole", () => {
	const { id: company_id } = generateCompany();
	const role = generateRole(company_id);

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

	describe("when there is an error adding the role", () => {
		const req = getMockReq({
			body: {
				title: role.title,
				cover_letter: role.title,
				ad_url: role.ad_url,
			},
		});
		const { res, next } = getMockRes();

		const errorMessage = "Database query failed";

		beforeEach(() => {
			mockCreateRole.mockRejectedValue(new Error(errorMessage));
		});

		it("returns a 500 status code", async () => {
			await handleAddRole(req, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
		});

		it("returns an error message", async () => {
			await handleAddRole(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				error: errorMessage,
			});
		});
	});
});

describe("handleGetRolePreviews", () => {
	describe("when role previews are successfully fetched", () => {
		const rolePreviews = Array.from({ length: 3 }).map(() => {
			const { id: company_id, name: company } = generateCompany();

			return {
				company,
				...generateRole(company_id),
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

		it("returns the companies", async () => {
			const req = getMockReq();
			const { res, next } = getMockRes();
			await handleGetRolePreviews(req, res, next);

			expect(res.json).toHaveBeenCalledWith(rolePreviews);
		});
	});

	describe("when there is an error fetching the previews", () => {
		const errorMessage = "Database query failed";
		const error = new Error(errorMessage);

		beforeEach(() => {
			mockGetRolePreviews.mockRejectedValue(error);
		});

		it("returns a 500 status code", async () => {
			const req = getMockReq();
			const { res, next } = getMockRes();
			await handleGetRolePreviews(req, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
		});

		it("returns the error message", async () => {
			const req = getMockReq();
			const { res, next } = getMockRes();
			await handleGetRolePreviews(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				error: error.message,
			});
		});
	});
});
