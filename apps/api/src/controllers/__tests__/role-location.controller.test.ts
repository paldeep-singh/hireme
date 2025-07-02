import { generateApiRoleLocationData } from "@repo/api-types/testUtils/generators";
import { omit } from "lodash-es";
import { RoleLocationId } from "../../db/generated/hire_me/RoleLocation";
import { roleLocationService } from "../../services/role-location.service";
import { getMockReq, getMockRes } from "../../testUtils";
import {
	generateCompany,
	generateId,
	generateRole,
	generateRoleLocation,
} from "../../testUtils/generators";
import {
	handleAddRoleLocation,
	handleUpdateRoleLocation,
} from "../role-location.controller";

vi.mock("../../services/role-location.service");

const mockAddRoleLocation = vi.mocked(roleLocationService.addRoleLocation);
const mockUpdateRoleLocation = vi.mocked(
	roleLocationService.updateRoleLocation,
);

describe("handleAddRoleLocation", () => {
	describe("when the role location is successfully added", () => {
		const company = generateCompany();

		const role = generateRole(company.id);

		const locationData = generateApiRoleLocationData(role.id);

		const locationInput = omit(locationData, ["role_id"]);

		const locationId = generateId<RoleLocationId>();

		const req = getMockReq({
			body: locationInput,
			parsedParams: { role_id: role.id },
		});
		const { res, next } = getMockRes();

		beforeEach(() => {
			mockAddRoleLocation.mockResolvedValue({
				id: locationId,
				...locationData,
			});
		});

		it("returns 201 status code", async () => {
			await handleAddRoleLocation(req, res, next);

			expect(res.status).toHaveBeenCalledWith(201);
		});

		it("returns the role location", async () => {
			await handleAddRoleLocation(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				id: locationId,
				...locationData,
			});
		});
	});
});

describe("handleUpdateRoleLocation", () => {
	const { id: company_id } = generateCompany();
	const { id: role_id } = generateRole(company_id);
	const location = generateRoleLocation(role_id);

	const { role_id: _, ...updates } = generateApiRoleLocationData(role_id);

	describe("when the requirement is successfully added", () => {
		const req = getMockReq({
			body: updates,
			parsedParams: { location_id: location.id },
		});

		const { res, next } = getMockRes();

		beforeEach(() => {
			mockUpdateRoleLocation.mockResolvedValue({
				...updates,
				id: location.id,
				role_id,
			});
		});

		it("returns 200 status code", async () => {
			await handleUpdateRoleLocation(req, res, next);

			expect(res.status).toHaveBeenCalledWith(200);
		});

		it("returns the updated location", async () => {
			await handleUpdateRoleLocation(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				...updates,
				id: location.id,
				role_id,
			});
		});
	});
});
