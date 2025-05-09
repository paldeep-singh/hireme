import { generateApiRoleLocationData } from "@repo/api-types/testUtils/generators";
import { seedCompanies, seedRole } from "../../testUtils/dbHelpers";
import { roleLocationService } from "../role-location.service";

describe("addRoleLocation", () => {
	it("adds a new role to the database", async () => {
		const company = (await seedCompanies(1))[0];
		const role = await seedRole(company.id);

		const locationData = generateApiRoleLocationData(role.id);

		const { id, ...rest } =
			await roleLocationService.addRoleLocation(locationData);

		expect(id).toBeNumber();
		expect(rest).toEqual(locationData);
	});
});
