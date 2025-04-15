import { requirementService } from "../../services/requirement.service";
import {
	generateCompany,
	generateRequirement,
	generateRole,
} from "../../testUtils/generators";
import { getMockReq, getMockRes } from "../../testUtils/index";
import { handleAddRequirement } from "../requirement";

vi.mock("../../services/requirement.service");

const mockAddRequirement = vi.mocked(requirementService.addRequirement);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("handleAddRequirement", () => {
	const { id: company_id } = generateCompany();
	const { id: role_id } = generateRole(company_id);
	const requirement = generateRequirement(role_id);

	describe("when the requirement is successfully added", () => {
		const req = getMockReq({
			body: {
				role_id: requirement.role_id,
				bonus: requirement.bonus,
				description: requirement.description,
			},
		});

		const { res, next } = getMockRes();

		beforeEach(() => {
			mockAddRequirement.mockResolvedValue(requirement);
		});

		it("returns 201 status code", async () => {
			await handleAddRequirement(req, res, next);

			expect(res.status).toHaveBeenCalledWith(201);
		});

		it("returns the requirement", async () => {
			await handleAddRequirement(req, res, next);

			expect(res.json).toHaveBeenCalledWith(requirement);
		});
	});

	describe("when there is an error adding the requirement", () => {
		const req = getMockReq({
			body: {
				role_id: requirement.role_id,
				bonus: requirement.bonus,
				description: requirement.description,
			},
		});

		const { res, next } = getMockRes();

		const errorMessage = "Database query failed";

		beforeEach(() => {
			mockAddRequirement.mockRejectedValue(new Error(errorMessage));
		});

		it("returns status code 500", async () => {
			await handleAddRequirement(req, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
		});

		it("returns an error message", async () => {
			await handleAddRequirement(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				error: errorMessage,
			});
		});
	});
});
