import { randomBytes } from "crypto";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { addHours } from "date-fns";
import { omit } from "lodash";
import PostgresInterval from "postgres-interval";
import range from "postgres-range";
import Admin, { AdminId } from "../generated/api/hire_me/Admin.js";
import Application, {
	ApplicationId,
} from "../generated/api/hire_me/Application.js";
import Company, { CompanyId } from "../generated/api/hire_me/Company.js";
import { CompetencyId } from "../generated/api/hire_me/Competency.js";
import Requirement, {
	RequirementId,
} from "../generated/api/hire_me/Requirement.js";
import RequirementMatchLevel from "../generated/api/hire_me/RequirementMatchLevel.js";
import Role, { RoleId } from "../generated/api/hire_me/Role.js";
import RoleLocation, {
	RoleLocationId,
} from "../generated/api/hire_me/RoleLocation.js";
import Salary, { SalaryId } from "../generated/api/hire_me/Salary.js";
import Session, { SessionId } from "../generated/api/hire_me/Session.js";
import { NonNullableObject, OmitStrict } from "../types/utils.js";
import { toNumrangeObject } from "../utils/numrange.js";

export function generateApiId<
	T extends
		| AdminId
		| CompanyId
		| RoleId
		| ApplicationId
		| RequirementId
		| SalaryId
		| CompetencyId
		| RoleLocationId,
>(): T {
	return faker.number.int() as T;
}

export function generateApiCompanyData(): NonNullableObject<
	Omit<Company, "id">
> {
	return {
		name: faker.company.name(),
		notes: faker.lorem.sentences(),
		website: faker.internet.url(),
	};
}

export function generateApiCompany(): NonNullableObject<Company> {
	return {
		id: generateApiId<CompanyId>(),
		...generateApiCompanyData(),
	};
}

export function generateApiRoleData(
	companyId: number,
	overrides: Partial<NonNullableObject<Role>> = {},
): NonNullableObject<Omit<Role, "id" | "term">> & Pick<Role, "term"> {
	const termPeriod = faker.helpers.arrayElement(["years", "months"]);

	const termValue =
		termPeriod === "months"
			? faker.number.int({ min: 1, max: 9 })
			: faker.number.int({ min: 1, max: 2 });

	const term = PostgresInterval(`${termValue} ${termPeriod}`).toISOString();

	const type = faker.helpers.arrayElement(["permanent", "fixed_term"]);

	return {
		title: faker.person.jobTitle(),
		ad_url: faker.internet.url(),
		company_id: companyId as CompanyId,
		notes: faker.lorem.sentences(),
		date_added: new Date().toISOString(),
		type,
		term: type === "permanent" ? null : term,
		...overrides,
	};
}

export function generateApiRole(
	companyId: CompanyId,
	overrides: Partial<NonNullableObject<Role>> = {},
): NonNullableObject<Omit<Role, "term">> & Pick<Role, "term"> {
	return {
		id: generateApiId<RoleId>(),
		...generateApiRoleData(companyId),
		...overrides,
	};
}

export function generateApiRoleLocationData(
	roleId: RoleId,
	overrides: Partial<NonNullableObject<Omit<RoleLocation, "id">>> = {},
): NonNullableObject<Omit<RoleLocation, "id">> {
	return {
		hybrid: faker.datatype.boolean(),
		on_site: faker.datatype.boolean(),
		remote: faker.datatype.boolean(),
		role_id: roleId,
		location: `${faker.location.city()}, ${faker.location.country()}`,
		office_days: toNumrangeObject(
			new range.Range(
				faker.number.int({ min: 0, max: 2 }),
				faker.number.int({ min: 3, max: 5 }),
				0,
			),
		),
		...overrides,
	};
}

export function generateApiRoleLocation(
	roleId: RoleId,
	overrides: Partial<NonNullableObject<RoleLocation>> = {},
): NonNullableObject<RoleLocation> {
	const { id, ...rest } = overrides;

	return {
		id: id ?? generateApiId<RoleLocationId>(),
		...generateApiRoleLocationData(roleId, rest),
	};
}

export function generateApiApplicationData(
	roleId: RoleId,
): NonNullableObject<Omit<Application, "id">> {
	return {
		role_id: roleId,
		cover_letter: faker.lorem.sentences(),
		date_submitted: faker.date.recent().toISOString(),
	};
}

export function generateApiApplication(
	roleId: RoleId,
): NonNullableObject<Application> {
	return {
		id: generateApiId<ApplicationId>(),
		...generateApiApplicationData(roleId),
	};
}

export function getRandomMatchLevel(): RequirementMatchLevel {
	return faker.helpers.arrayElement<RequirementMatchLevel>([
		"exceeded",
		"met",
		"room_for_growth",
	]);
}

export function generateApiRequirementData(
	roleId: number,
): NonNullableObject<Omit<Requirement, "id">> {
	return {
		description: faker.lorem.sentence(),
		bonus: faker.datatype.boolean(),
		role_id: roleId as RoleId,
	};
}

export function generateApiRequirement(
	roleId: RoleId,
): NonNullableObject<Requirement> {
	return {
		id: generateApiId<RequirementId>(),
		...generateApiRequirementData(roleId),
	};
}

export function generateApiSalaryData(
	roleId: RoleId,
	overrides: Partial<NonNullableObject<OmitStrict<Salary, "id">>> = {},
): NonNullableObject<OmitStrict<Salary, "id">> {
	return {
		role_id: roleId,
		salary_currency: faker.helpers.arrayElement(["AUD", "SGD"]),
		salary_includes_super: faker.datatype.boolean(),
		salary_period: faker.helpers.arrayElement(["year", "month", "week", "day"]),
		salary_range: toNumrangeObject(
			new range.Range(
				faker.number.int({ min: 120000, max: 140000 }),
				faker.number.int({ min: 150000, max: 160000 }),
				0,
			),
		),
		...overrides,
	};
}

export function generateApiSalary(roleId: RoleId): NonNullableObject<Salary> {
	return {
		id: generateApiId<SalaryId>(),
		...generateApiSalaryData(roleId),
	};
}

interface NonNullableRoleDetails extends OmitStrict<Role, "company_id"> {
	company: NonNullableObject<Company>;
	location: NonNullableObject<OmitStrict<RoleLocation, "role_id">>;
	salary: NonNullableObject<OmitStrict<Salary, "role_id">>;
	application: NonNullableObject<OmitStrict<Application, "role_id">>;
	requirements: NonNullableObject<OmitStrict<Requirement, "role_id">>[];
}

export function generateApiRoleDetails(): NonNullableRoleDetails {
	const company = generateApiCompany();
	const role = generateApiRole(company.id);

	return {
		...omit(role, ["company_id"]),
		company,
		location: omit(generateApiRoleLocation(role.id), ["role_id"]),
		application: omit(generateApiApplication(role.id), ["role_id"]),
		salary: omit(generateApiSalary(role.id), ["role_id"]),
		requirements: Array.from({ length: 3 }).map(() =>
			generateApiRequirement(role.id),
		),
	};
}

type AdminData = Omit<Admin, "id"> & {
	password: string;
};

export async function generateApiAdminData(): Promise<AdminData> {
	const password = faker.internet.password();
	const password_hash = await bcrypt.hash(password, 10);

	return {
		email: faker.internet.email(),
		password_hash,
		password,
	};
}

export async function generateApiAdmin(): Promise<
	NonNullableObject<Admin> & { password: string }
> {
	return {
		id: generateApiId<AdminId>(),
		...(await generateApiAdminData()),
	};
}

export function generateApiAdminSession(admin_id: AdminId): Session {
	const id = randomBytes(32).toString("hex") as SessionId;

	return {
		id,
		expiry: addHours(new Date(), 2).toISOString(),
		admin_id,
	};
}
