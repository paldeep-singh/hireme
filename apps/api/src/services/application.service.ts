import Application, {
	ApplicationInitializer,
} from "@repo/api-types/generated/api/hire_me/Application";
import {
	applicationModel,
	ApplicationUpdateArgs,
} from "../models/application.model";

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
	updates: ApplicationUpdateArgs,
): Promise<Application> {
	const updatedApp = await applicationModel.updateApplication(updates);

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
