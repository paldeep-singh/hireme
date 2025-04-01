import Requirement, {
	RequirementInitializer,
} from "@repo/shared/generated/db/hire_me/Requirement.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { requirementModel } from "../models/requirement.js";
import { RequestHandler } from "./sharedTypes.js";

export const handleAddRequirement: RequestHandler<
	Requirement,
	RequirementInitializer
> = async (req, res) => {
	try {
		const requirement = await requirementModel.addRequirement(req.body);
		res.status(StatusCodes.CREATED).json(requirement);
	} catch (error) {
		if (error instanceof Error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: error.message,
			});
			return;
		}

		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
	}
};
