import { generateApiRoleLocationData } from "@repo/api-types/testUtils/generators";
import { omit } from "lodash-es";
import { RoleLocationId } from "../../db/generated/hire_me/RoleLocation";
import { roleLocationService } from "../../services/role-location.service";
import { getMockReq, getMockRes } from "../../testUtils";
import {
	generateCompany,
	generateId,
	generateRole,
} from "../../testUtils/generators";
import { handleAddRoleLocation } from "../role-location.controller";

vi.mock("../../services/role-location.service");

const mockAddRoleLocation = vi.mocked(roleLocationService.addRoleLocation);

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
