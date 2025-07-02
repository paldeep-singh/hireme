import { generateApiRoleLocationData } from "@repo/api-types/testUtils/generators";
import { db } from "../../db/database";
import {
	seedCompanies,
	seedRole,
	seedRoleLocation,
} from "../../testUtils/dbHelpers";
import { toPostgresNumRange } from "../../utils/postgresRange";
import { roleLocationService } from "../role-location.service";

describe("addRoleLocation", () => {
	it("adds a new role location to the database", async () => {
		const company = (await seedCompanies(1))[0];
		const role = await seedRole(company.id);

		const locationData = generateApiRoleLocationData(role.id);

		const { id, ...rest } =
			await roleLocationService.addRoleLocation(locationData);

		expect(id).toBeNumber();
		expect(rest).toEqual(locationData);
	});
});

describe("updateRoleLocation", () => {
	it("updates the location in the database", async () => {
		const company = (await seedCompanies(1))[0];
		const role = await seedRole(company.id);
		const location = await seedRoleLocation(role.id);

		const { role_id, ...updates } = generateApiRoleLocationData(role.id);

		const updatedRole = await roleLocationService.updateRoleLocation(
			updates,
			location.id,
		);

		expect(updatedRole).toEqual({
			...updates,
			id: location.id,
			role_id: role.id,
		});

		const fetchedLocation = await db
			.withSchema("hire_me")
			.selectFrom("role_location")
			.where("id", "=", location.id)
			.selectAll()
			.executeTakeFirstOrThrow();

		expect(fetchedLocation).toEqual({
			...updates,
			id: location.id,
			office_days: toPostgresNumRange(updates.office_days, "office_days"),
			role_id: role.id,
		});
	});
});
