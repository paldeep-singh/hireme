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
import Contract, { ContractId } from "../generated/api/hire_me/Contract.js";
import Requirement, {
	RequirementId,
} from "../generated/api/hire_me/Requirement.js";
import RequirementMatchLevel from "../generated/api/hire_me/RequirementMatchLevel.js";
import Role, { RoleId } from "../generated/api/hire_me/Role.js";
import RoleLocation, {
	RoleLocationId,
} from "../generated/api/hire_me/RoleLocation.js";
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
		| ContractId
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
): NonNullableObject<Omit<Role, "id">> {
	return {
		title: faker.person.jobTitle(),
		ad_url: faker.internet.url(),
		company_id: companyId as CompanyId,
		notes: faker.lorem.sentences(),
		date_added: new Date().toISOString(),
	};
}

export function generateApiRole(companyId: CompanyId): NonNullableObject<Role> {
	return {
		id: generateApiId<RoleId>(),
		...generateApiRoleData(companyId),
	};
}

export function generateApiRoleLocationData(
	roleId: RoleId,
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
	};
}

export function generateApiRoleLocation(
	roleId: RoleId,
): NonNullableObject<RoleLocation> {
	return {
		id: generateApiId<RoleLocationId>(),
		...generateApiRoleLocationData(roleId),
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

export function generateApiContractData(
	roleId: RoleId,
	overrides: Partial<
		NonNullableObject<OmitStrict<Contract, "id" | "term">> & {
			term: Contract["term"]; // Allow term to be null since permanent contracts should not have a term.
		}
	> = {},
): NonNullableObject<OmitStrict<Contract, "id" | "term">> & {
	term: Contract["term"]; // Allow term to be null since permanent contracts should not have a term.
} {
	const type = faker.helpers.arrayElement(["permanent", "fixed_term"]);

	const termPeriod = faker.helpers.arrayElement(["years", "months"]);

	const termValue =
		termPeriod === "months"
			? faker.number.int({ min: 1, max: 9 })
			: faker.number.int({ min: 1, max: 2 });

	const term = PostgresInterval(`${termValue} ${termPeriod}`);

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
		term: type === "permanent" ? null : term.toISOString(),
		type,
		...overrides,
	};
}

export function generateApiContract(roleId: RoleId): NonNullableObject<
	OmitStrict<Contract, "term">
> & {
	term: Contract["term"]; // Allow term to be null since permanent contracts should not have a term.
} {
	return {
		id: generateApiId<ContractId>(),
		...generateApiContractData(roleId),
	};
}

interface NonNullableRoleDetails extends OmitStrict<Role, "company_id"> {
	company: NonNullableObject<Company>;
	location: NonNullableObject<OmitStrict<RoleLocation, "role_id">>;
	contract: NonNullableObject<OmitStrict<Contract, "role_id" | "term">> & {
		term: Contract["term"]; // Allow term to be null since permanent contracts should not have a term.
	};
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
		contract: omit(generateApiContract(role.id), ["role_id"]),
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
