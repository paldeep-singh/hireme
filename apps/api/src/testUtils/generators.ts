import { randomBytes } from "crypto";
import { faker } from "@faker-js/faker";
import { NonNullableObject, OmitStrict } from "@repo/api-types/types/utils";
import bcrypt from "bcryptjs";
import { addHours } from "date-fns";
import PostgresInterval from "postgres-interval";
import range from "postgres-range";
import { Admin, AdminId } from "../db/generated/hire_me/Admin.js";
import {
	Application,
	ApplicationId,
} from "../db/generated/hire_me/Application.js";
import { Company, CompanyId } from "../db/generated/hire_me/Company.js";
import { CompetencyId } from "../db/generated/hire_me/Competency.js";
import ContractType from "../db/generated/hire_me/ContractType.js";
import {
	Requirement,
	RequirementId,
} from "../db/generated/hire_me/Requirement.js";
import RequirementMatchLevel from "../db/generated/hire_me/RequirementMatchLevel.js";
import { Role, RoleId } from "../db/generated/hire_me/Role.js";
import {
	RoleLocation,
	RoleLocationId,
} from "../db/generated/hire_me/RoleLocation.js";
import { Salary, SalaryId } from "../db/generated/hire_me/Salary.js";
import { Session, SessionId } from "../db/generated/hire_me/Session.js";

export function generateId<
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

export function generateCompanyData(): NonNullableObject<Omit<Company, "id">> {
	return {
		name: faker.company.name(),
		notes: faker.lorem.sentences(),
		website: faker.internet.url(),
	};
}

export function generateCompany(): NonNullableObject<Company> {
	return {
		id: generateId<CompanyId>(),
		...generateCompanyData(),
	};
}

export function generateRoleData(
	companyId: number,
	type: ContractType = "permanent",
): NonNullableObject<Omit<Role, "id" | "term">> & Pick<Role, "term"> {
	const termPeriod = faker.helpers.arrayElement(["years", "months"]);

	const termValue =
		termPeriod === "months"
			? faker.number.int({ min: 1, max: 9 })
			: faker.number.int({ min: 1, max: 2 });

	const term = PostgresInterval(`${termValue} ${termPeriod}`);

	return {
		title: faker.person.jobTitle(),
		ad_url: faker.internet.url(),
		company_id: companyId as CompanyId,
		notes: faker.lorem.sentences(),
		date_added: new Date(),
		type,
		term: type === "permanent" ? null : term,
	};
}

export function generateRole(
	companyId: CompanyId,
): NonNullableObject<Omit<Role, "term">> & Pick<Role, "term"> {
	return {
		id: generateId<RoleId>(),
		...generateRoleData(companyId),
	};
}

export function generateRoleLocationData(
	roleId: RoleId,
): NonNullableObject<Omit<RoleLocation, "id">> {
	return {
		hybrid: faker.datatype.boolean(),
		on_site: faker.datatype.boolean(),
		remote: faker.datatype.boolean(),
		role_id: roleId,
		location: `${faker.location.city()}, ${faker.location.country()}`,
		office_days: new range.Range(
			faker.number.int({ min: 0, max: 2 }),
			faker.number.int({ min: 3, max: 5 }),
			0,
		),
	};
}

export function generateApplicationData(
	roleId: RoleId,
): Omit<Application, "id"> {
	const submitted = faker.datatype.boolean();

	return {
		role_id: roleId,
		cover_letter: faker.lorem.sentences(),
		date_submitted: submitted ? faker.date.recent() : null,
	};
}

export function getRandomMatchLevel(): RequirementMatchLevel {
	return faker.helpers.arrayElement<RequirementMatchLevel>([
		"exceeded",
		"met",
		"room_for_growth",
	]);
}

export function generateRequirementData(
	roleId: number,
): NonNullableObject<Omit<Requirement, "id">> {
	return {
		description: faker.lorem.sentence(),
		bonus: faker.datatype.boolean(),
		role_id: roleId as RoleId,
	};
}

export function generateRequirement(
	roleId: RoleId,
): NonNullableObject<Requirement> {
	return {
		id: generateId<RequirementId>(),
		...generateRequirementData(roleId),
	};
}

export function generateSalaryData(
	roleId: RoleId,
): NonNullableObject<OmitStrict<Salary, "id">> {
	return {
		role_id: roleId,
		salary_currency: faker.helpers.arrayElement(["AUD", "SGD"]),
		salary_includes_super: faker.datatype.boolean(),
		salary_period: faker.helpers.arrayElement(["year", "month", "week", "day"]),
		salary_range: new range.Range(
			faker.number.int({ min: 120000, max: 140000 }),
			faker.number.int({ min: 150000, max: 160000 }),
			0,
		),
	};
}

export function generateSalary(roleId: RoleId): NonNullableObject<Salary> {
	return {
		id: generateId<SalaryId>(),
		...generateSalaryData(roleId),
	};
}

type AdminData = Omit<Admin, "id"> & {
	password: string;
};

export async function generateAdminData(): Promise<AdminData> {
	const password = faker.internet.password();
	const password_hash = await bcrypt.hash(password, 10);

	return {
		email: faker.internet.email(),
		password_hash,
		password,
	};
}

export async function generateAdmin(): Promise<
	NonNullableObject<Admin> & { password: string }
> {
	return {
		id: generateId<AdminId>(),
		...(await generateAdminData()),
	};
}

export function generateAdminSession(admin_id: AdminId): Session {
	const id = randomBytes(32).toString("hex") as SessionId;

	return {
		id,
		expiry: addHours(new Date(), 2),
		admin_id,
	};
}
