import Application from "@repo/api-types/generated/api/hire_me/Application";
import { RoleId } from "@repo/api-types/generated/api/hire_me/Role";
import { ApplicationInput } from "@repo/api-types/validators/Application";
import { StatusCodes } from "http-status-codes";
import { ApplicationId } from "../db/generated/hire_me/Application";
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

export const handleUpdateApplication: RequestHandler<
	Application,
	ApplicationInput,
	{ role_id: number; application_id: number }
> = async (req, res) => {
	const updatedApplication = await applicationService.updateApplication({
		...req.body,
		id: req.parsedParams.application_id as ApplicationId,
	});

	res.status(StatusCodes.OK).json(updatedApplication);
};
