import { generateRoleData } from "@repo/shared/testHelpers/generators";
import { RolePreview } from "@repo/shared/types/rolePreview";
import { addSeconds, subSeconds } from "date-fns";
import {
	clearCompanyTable,
	clearRoleTable,
	seedApplication,
	seedCompanies,
	seedRole,
	seedRoleLocation,
} from "../../testUtils/dbHelpers";
import db from "../db";
import { roleModel } from "../role";

afterEach(async () => {
	await clearRoleTable();
	await clearCompanyTable();
});

afterAll(async () => {
	await db.$pool.end(); // Close the pool after each test file
});

describe("addRole", () => {
	it("adds a new role to the database", async () => {
		const company = (await seedCompanies(1))[0];
		const { date_added: _, ...roleData } = generateRoleData(company.id);

		const now = new Date();

		const { id, date_added, ...rest } = await roleModel.addRole(roleData);

		expect(date_added).toBeInstanceOf(Date);
		expect(date_added.valueOf()).toBeWithin(
			subSeconds(now, 10).valueOf(),
			addSeconds(now, 10).valueOf(),
		);

		expect(id).toBeNumber();
		expect(rest).toEqual(roleData);
	});
});

describe("getRolePreviews", () => {
	it("returns a list of role previews", async () => {
		const companies = await seedCompanies(3);

		const rolePreviews: RolePreview[] = await Promise.all(
			companies.map(async ({ id: company_id, name: company }) => {
				const role = await seedRole(company_id);
				const { location } = await seedRoleLocation(role.id);
				const { date_submitted } = await seedApplication(role.id);

				return {
					company,
					...role,
					location,
					date_submitted,
				};
			}),
		);

		const fetchedPreviews = await roleModel.getRolePreviews();

		expect(fetchedPreviews).toIncludeSameMembers(rolePreviews);
	});
});
