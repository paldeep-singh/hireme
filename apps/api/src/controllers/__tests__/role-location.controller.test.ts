import { generateApiRoleLocation } from "@repo/api-types/testUtils/generators";
import { roleLocationService } from "../../services/role-location.service";
import { getMockReq, getMockRes } from "../../testUtils";
import { generateCompany, generateRole } from "../../testUtils/generators";
import { handleAddRoleLocation } from "../role-location.controller";

vi.mock("../../services/role-location.service");

const mockAddRoleLocation = vi.mocked(roleLocationService.addRoleLocation);

describe("handleAddRoleLocation", () => {
	describe("when the role location is successfully added", () => {
		const company = generateCompany();

		const role = generateRole(company.id);

		const locationData = generateApiRoleLocation(role.id);

		const req = getMockReq({
			body: locationData,
		});
		const { res, next } = getMockRes();

		beforeEach(() => {
			mockAddRoleLocation.mockResolvedValue(locationData);
		});

		it("returns 201 status code", async () => {
			await handleAddRoleLocation(req, res, next);

			expect(res.status).toHaveBeenCalledWith(201);
		});

		it("returns the role location", async () => {
			await handleAddRoleLocation(req, res, next);

			expect(res.json).toHaveBeenCalledWith(locationData);
		});
	});
});
