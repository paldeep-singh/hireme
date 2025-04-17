import Requirement, {
	RequirementInitializer,
} from "@repo/api-types/generated/api/hire_me/Requirement";
import { StatusCodes } from "http-status-codes";
import { requirementService } from "../services/requirement.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddRequirement: RequestHandler<
	Requirement,
	RequirementInitializer
> = async (req, res) => {
	const requirement = await requirementService.addRequirement(req.body);
	res.status(StatusCodes.CREATED).json(requirement);
};
