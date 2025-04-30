import { generateApiRoleLocationData } from "@repo/api-types/testUtils/generators";
import { RoleDetails } from "@repo/api-types/types/api/RoleDetails";
import { toNumrangeString } from "@repo/api-types/utils/toNumrangeString";
import { addSeconds, subSeconds } from "date-fns";
import { omit } from "lodash";
import { db } from "../../db/database";
import {
	clearCompanyTable,
	clearRoleTable,
	seedApplication,
	seedCompanies,
	seedContract,
	seedRequirement,
	seedRole,
	seedRoleLocation,
} from "../../testUtils/dbHelpers";
import { generateRoleData } from "../../testUtils/generators";
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
		const { date_added: _, ...roleData } = generateRoleData(company.id);

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
		const contract = await seedContract(role.id);

		const requirements = await Promise.all(
			Array.from({ length: 3 }).map(async () => seedRequirement(role.id)),
		);

		expectedRoleDetails = {
			...omit(role, ["company_id"]),
			company,
			date_added: role.date_added.toISOString(),
			location: {
				...omit(location, ["role_id"]),
				office_days: toNumrangeString(location.office_days),
			},
			application: {
				...omit(app, ["role_id"]),
				date_submitted: app.date_submitted?.toISOString() ?? null,
			},
			contract: {
				...omit(contract, ["role_id"]),
				salary_range: toNumrangeString(contract.salary_range),
				term: contract.term?.toISOString() ?? null,
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

describe("addRoleLocation", () => {
	it("adds a new role to the database", async () => {
		const company = (await seedCompanies(1))[0];
		const role = await seedRole(company.id);

		const locationData = generateApiRoleLocationData(role.id);

		const { id, ...rest } = await roleService.addRoleLocation(locationData);

		expect(id).toBeNumber();
		expect(rest).toEqual(locationData);
	});
});
