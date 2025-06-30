import Application from "@repo/api-types/generated/api/hire_me/Application";
import { RoleId } from "@repo/api-types/generated/api/hire_me/Role";
import { ApplicationInput } from "@repo/api-types/validators/Application";
import { StatusCodes } from "http-status-codes";
import { applicationService } from "../services/application.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddApplication: RequestHandler<
	Application,
	ApplicationInput,
	{ role_id: number }
> = async (req, res) => {
	const application = await applicationService.addApplication({
		...req.body,
		role_id: req.parsedParams.role_id as RoleId,
	});

	res.status(StatusCodes.CREATED).json(application);
};
