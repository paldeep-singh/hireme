import { generateApiApplicationData } from "@repo/api-types/testUtils/generators";
import { omit } from "lodash-es";
import { ApplicationId } from "../../db/generated/hire_me/Application";
import { applicationService } from "../../services/application.service";
import { getMockReq, getMockRes } from "../../testUtils";
import {
	generateCompany,
	generateId,
	generateRole,
} from "../../testUtils/generators";
import { handleAddApplication } from "../application.controller";

vi.mock("../../services/application.service");

const mockAddApplication = vi.mocked(applicationService.addApplication);

describe("handleAddApplication", () => {
	describe("when the application is successfully added", () => {
		const company = generateCompany();
		const role = generateRole(company.id);
		const applicationData = generateApiApplicationData(role.id);
		const applicationId = generateId<ApplicationId>();

		const req = getMockReq({
			body: omit(applicationData, "role_id"),
			parsedParams: { role_id: role.id },
		});
		const { res, next } = getMockRes();

		beforeEach(() => {
			mockAddApplication.mockResolvedValue({
				id: applicationId,
				...applicationData,
			});
		});

		it("returns 201 status code", async () => {
			await handleAddApplication(req, res, next);

			expect(res.status).toHaveBeenCalledWith(201);
		});

		it("returns the application", async () => {
			await handleAddApplication(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				id: applicationId,
				...applicationData,
			});
		});
	});
});
