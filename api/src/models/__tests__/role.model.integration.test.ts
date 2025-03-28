import { addSeconds, subSeconds } from "date-fns";
import { RolePreview } from "shared/types/rolePreview.js";
import {
	clearCompanyTable,
	clearRoleTable,
	seedCompanies,
	seedRole,
} from "../../testUtils/dbHelpers.js";
import { generateRoleData } from "../../testUtils/index.js";
import db from "../db.js";
import { roleModel } from "../role.js";

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
	it("returns a list of application previews", async () => {
		const companies = await seedCompanies(3);

		const rolePreviews: RolePreview[] = await Promise.all(
			companies.map(async ({ id: company_id, name: company }) => {
				const role = await seedRole(company_id);

				return {
					company,
					...role,
				};
			}),
		);

		const fetchedPreviews = await roleModel.getRolePreviews();

		expect(fetchedPreviews).toIncludeSameMembers(rolePreviews);
	});
});
