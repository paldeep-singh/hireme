import Requirement from "@repo/api-types/generated/api/hire_me/Requirement";
import { RequirementInput } from "@repo/api-types/validators/Requirement";
import { StatusCodes } from "http-status-codes";
import { RoleId } from "../db/generated/hire_me/Role";
import { requirementService } from "../services/requirement.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddRequirement: RequestHandler<
	Requirement,
	RequirementInput,
	{ role_id: number }
> = async (req, res) => {
	const requirement = await requirementService.addRequirement({
		...req.body,
		role_id: req.parsedParams.role_id as RoleId,
	});
	res.status(StatusCodes.CREATED).json(requirement);
};

export const handleAddRequirements: RequestHandler<
	Requirement[],
	RequirementInput[],
	{ role_id: number }
> = async (req, res) => {
	const requirements = await requirementService.addRequirements(
		req.body.map((data) => ({
			...data,
			role_id: req.parsedParams.role_id as RoleId,
		})),
	);
	res.status(StatusCodes.CREATED).json(requirements);
};
