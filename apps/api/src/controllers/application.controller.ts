import Application, {
	ApplicationInitializer,
} from "@repo/api-types/generated/api/hire_me/Application";
import { StatusCodes } from "http-status-codes";
import { applicationService } from "../services/application.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddApplication: RequestHandler<
	Application,
	ApplicationInitializer
> = async (req, res) => {
	const application = await applicationService.addApplication(req.body);

	res.status(StatusCodes.CREATED).json(application);
};
