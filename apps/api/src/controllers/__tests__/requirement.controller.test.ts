import { requirementService } from "../../services/requirement.service";
import {
	generateCompany,
	generateRequirement,
	generateRole,
} from "../../testUtils/generators";
import { getMockReq, getMockRes } from "../../testUtils/index";
import {
	handleAddRequirement,
	handleAddRequirements,
} from "../requirement.controller";

vi.mock("../../services/requirement.service");

const mockAddRequirement = vi.mocked(requirementService.addRequirement);
const mockAddRequirements = vi.mocked(requirementService.addRequirements);

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
});

describe("handleAddRequirements", () => {
	const { id: company_id } = generateCompany();
	const { id: role_id } = generateRole(company_id);
	const requirementsList = Array.from({ length: 5 }).map(() =>
		generateRequirement(role_id),
	);

	describe("when the requirement is successfully added", () => {
		const req = getMockReq({
			body: requirementsList.map(({ id: _, ...rest }) => rest),
		});

		const { res, next } = getMockRes();

		beforeEach(() => {
			mockAddRequirements.mockResolvedValue(requirementsList);
		});

		it("returns 201 status code", async () => {
			await handleAddRequirements(req, res, next);

			expect(res.status).toHaveBeenCalledWith(201);
		});

		it("returns the requirement", async () => {
			await handleAddRequirements(req, res, next);

			expect(res.json).toHaveBeenCalledWith(requirementsList);
		});
	});
});
