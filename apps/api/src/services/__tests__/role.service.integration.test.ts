import { generateApiRoleData } from "@repo/api-types/testUtils/generators";
import { RoleDetails } from "@repo/api-types/types/api/RoleDetails";
import { toNumrangeObject } from "@repo/api-types/utils/numrange";
import { addSeconds, subSeconds } from "date-fns";
import { omit } from "lodash-es";
import { db } from "../../db/database";
import {
	clearCompanyTable,
	clearRoleTable,
	seedApplication,
	seedCompanies,
	seedRequirement,
	seedRole,
	seedRoleLocation,
	seedSalary,
} from "../../testUtils/dbHelpers";
import { roleService } from "../role.service";

afterEach(async () => {
	await clearRoleTable();
	await clearCompanyTable();
});

afterAll(async () => {
	await db.withSchema("hire_me").destroy(); // Close the pool after each test file
});

describe("addRole", () => {
	it("adds a new role to the database", async () => {
		const company = (await seedCompanies(1))[0];
		const { date_added: _, ...roleData } = generateApiRoleData(company.id);

		const now = new Date();

		const { id, date_added, ...rest } = await roleService.addRole(roleData);

		expect(new Date(date_added).valueOf()).toBeWithin(
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

		const rolePreviews = await Promise.all(
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
			term: rp.term ? rp.term.toISOString() : null,
			date_added: rp.date_added.toISOString(),
			date_submitted: rp.date_submitted?.toISOString() ?? null,
		}));

		const fetchedPreviews = await roleService.getRolePreviews();

		expect(fetchedPreviews).toIncludeSameMembers(parsedRolePreviews);
	});
});

describe("getRoleDetails", async () => {
	let expectedRoleDetails: RoleDetails;

	beforeEach(async () => {
		const company = (await seedCompanies(1))[0];
		const role = await seedRole(company.id);
		const location = await seedRoleLocation(role.id);
		const app = await seedApplication(role.id);
		const salary = await seedSalary(role.id);

		const requirements = await Promise.all(
			Array.from({ length: 3 }).map(async () => seedRequirement(role.id)),
		);

		expectedRoleDetails = {
			...omit(role, ["company_id"]),
			term: role.term ? role.term.toISOString() : null,
			company,
			date_added: role.date_added.toISOString(),
			location: {
				...omit(location, ["role_id"]),
				office_days: toNumrangeObject(location.office_days),
			},
			application: {
				...omit(app, ["role_id"]),
				date_submitted: app.date_submitted?.toISOString() ?? null,
			},
			salary: {
				...omit(salary, ["role_id"]),
				salary_range: toNumrangeObject(salary.salary_range),
			},
			requirements: requirements.map((req) => omit(req, ["role_id"])),
		};
	});

	it("returns the role details", async () => {
		const { requirements, ...rest } = await roleService.getRoleDetails(
			expectedRoleDetails.id,
		);

		const { requirements: expectedRequirements, ...expectedRest } =
			expectedRoleDetails;

		expect(rest).toEqual(expectedRest);
		expect(requirements).toIncludeSameMembers(requirements!);
	});
});
