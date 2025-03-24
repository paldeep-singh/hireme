import { faker } from "@faker-js/faker";
import Requirement, {
	RequirementId,
} from "shared/generated/db/hire_me/Requirement.js";
import { RoleId } from "shared/generated/db/hire_me/Role.js";
import { requirementModel } from "../../models/requirement.js";
import { getMockReq, getMockRes } from "../../testUtils/index.js";
import { handleAddRequirement } from "../requirement.js";

vi.mock("../../models/requirement");

const mockAddRequirement = vi.mocked(requirementModel.addRequirement);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("handleAddRequirement", () => {
	const requirement: Requirement = {
		id: faker.number.int({ max: 100 }) as RequirementId,
		role_id: faker.number.int({ max: 100 }) as RoleId,
		bonus: faker.datatype.boolean(),
		description: faker.lorem.sentence(),
	};

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
