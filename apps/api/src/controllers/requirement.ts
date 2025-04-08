import DBRequirement, {
	DBRequirementInitializer,
} from "@repo/shared/generated/db/hire_me/Requirement";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { requirementModel } from "../models/requirement";
import { RequestHandler } from "./sharedTypes";

export const handleAddRequirement: RequestHandler<
	DBRequirement,
	DBRequirementInitializer
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
