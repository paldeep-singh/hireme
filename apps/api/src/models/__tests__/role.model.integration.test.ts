import { generateRoleData } from "@repo/shared/testHelpers/generators";
import { DBRolePreview } from "@repo/shared/types/db/RolePreview";
import { addSeconds, subSeconds } from "date-fns";
import {
	clearCompanyTable,
	clearRoleTable,
	seedApplication,
	seedCompanies,
	seedRole,
	seedRoleLocation,
} from "../../testUtils/dbHelpers";
import dbPromise from "../dbPromise";
import { roleModel } from "../role";

afterEach(async () => {
	await clearRoleTable();
	await clearCompanyTable();
});

afterAll(async () => {
	await dbPromise.$pool.end(); // Close the pool after each test file
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

		const rolePreviews: DBRolePreview[] = await Promise.all(
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

		const parsedRolePreviews = rolePreviews.map((rp) => ({
			...rp,
			date_added: rp.date_added.toISOString(),
			date_submitted: rp.date_submitted?.toISOString() ?? null,
		}));

		const fetchedPreviews = await roleModel.getRolePreviews();

		expect(fetchedPreviews).toIncludeSameMembers(parsedRolePreviews);
	});
});
