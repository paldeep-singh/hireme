import Application, {
	ApplicationInitializer,
} from "@repo/api-types/generated/api/hire_me/Application";
import { ApplicationUpdateInput } from "@repo/api-types/validators/Application";
import { ApplicationId } from "../db/generated/hire_me/Application";
import { applicationModel } from "../models/application.model";

async function addApplication(
	appDetails: ApplicationInitializer,
): Promise<Application> {
	const newApp = await applicationModel.addApplication(appDetails);

	return {
		...newApp,
		date_submitted: newApp.date_submitted
			? newApp.date_submitted.toISOString()
			: null,
	};
}

async function updateApplication(
	updates: ApplicationUpdateInput,
	id: ApplicationId,
): Promise<Application> {
	const updatedApp = await applicationModel.updateApplication(updates, id);

	return {
		...updatedApp,
		date_submitted: updatedApp.date_submitted
			? updatedApp.date_submitted.toISOString()
			: null,
	};
}

export const applicationService = {
	addApplication,
	updateApplication,
};
