import { generateApiRequirementData } from "@repo/api-types/testUtils/generators";
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
	handleUpdateRequirement,
} from "../requirement.controller";

vi.mock("../../services/requirement.service");

const mockAddRequirement = vi.mocked(requirementService.addRequirement);
const mockAddRequirements = vi.mocked(requirementService.addRequirements);
const mockUpdateRequirement = vi.mocked(requirementService.updateRequirement);

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
				bonus: requirement.bonus,
				description: requirement.description,
			},
			parsedParams: { role_id },
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
			body: requirementsList.map(({ id: _, role_id: __, ...rest }) => rest),
			parsedParams: { role_id },
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

describe("handleUpdateRequirement", () => {
	const { id: company_id } = generateCompany();
	const { id: role_id } = generateRole(company_id);
	const requirement = generateRequirement(role_id);

	const updates = generateApiRequirementData(role_id);

	describe("when the requirement is successfully added", () => {
		const req = getMockReq({
			body: {
				bonus: requirement.bonus,
				description: requirement.description,
			},
			parsedParams: { role_id },
		});

		const { res, next } = getMockRes();

		beforeEach(() => {
			mockUpdateRequirement.mockResolvedValue({
				...updates,
				id: requirement.id,
			});
		});

		it("returns 200 status code", async () => {
			await handleUpdateRequirement(req, res, next);

			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("returns the updated requirement", async () => {
			await handleUpdateRequirement(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				...updates,
				id: requirement.id,
			});
		});
	});
});
