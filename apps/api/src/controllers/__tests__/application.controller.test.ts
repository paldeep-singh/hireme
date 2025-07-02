import {
	generateApiApplication,
	generateApiApplicationData,
	generateApiRole,
} from "@repo/api-types/testUtils/generators";
import { omit } from "lodash-es";
import { ApplicationId } from "../../db/generated/hire_me/Application";
import { applicationService } from "../../services/application.service";
import { getMockReq, getMockRes } from "../../testUtils";
import {
	generateCompany,
	generateId,
	generateRole,
} from "../../testUtils/generators";
import {
	handleAddApplication,
	handleUpdateApplication,
} from "../application.controller";

vi.mock("../../services/application.service");

const mockAddApplication = vi.mocked(applicationService.addApplication);
const mockUpdateApplication = vi.mocked(applicationService.updateApplication);

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

describe("handleUpdateApplication", () => {
	describe("when the application is successfully updated", () => {
		const company = generateCompany();
		const role = generateApiRole(company.id);
		const app = generateApiApplication(role.id);
		const { role_id: _, ...updates } = generateApiApplicationData(role.id);

		const req = getMockReq({
			body: updates,
			parsedParams: { role_id: role.id, company_id: company.id },
		});
		const { res, next } = getMockRes();

		beforeEach(() => {
			mockUpdateApplication.mockResolvedValue({
				id: app.id,
				role_id: app.role_id,
				...updates,
			});
		});

		it("returns 200 status code", async () => {
			await handleUpdateApplication(req, res, next);

			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("returns the application", async () => {
			await handleUpdateApplication(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				id: app.id,
				role_id: app.role_id,
				...updates,
			});
		});
	});
});
