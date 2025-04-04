import { randomBytes } from "crypto";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { addHours } from "date-fns";
import range, { RANGE_LB_INC, RANGE_UB_INC } from "postgres-range";
import Admin, { AdminId } from "../generated/db/hire_me/Admin.js";
import { ApplicationId } from "../generated/db/hire_me/Application.js";
import Company, { CompanyId } from "../generated/db/hire_me/Company.js";
import { CompetencyId } from "../generated/db/hire_me/Competency.js";
import { ContractId } from "../generated/db/hire_me/Contract.js";
import Requirement, {
	RequirementId,
} from "../generated/db/hire_me/Requirement.js";
import RequirementMatchLevel from "../generated/db/hire_me/RequirementMatchLevel.js";
import Role, { RoleId } from "../generated/db/hire_me/Role.js";
import RoleLocation, {
	RoleLocationId,
} from "../generated/db/hire_me/RoleLocation.js";
import Session, { SessionId } from "../generated/db/hire_me/Session.js";
import { NonNullableObject } from "../types/utils.js";

export function generateId<
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
): NonNullableObject<Omit<Role, "id">> {
	return {
		title: faker.person.jobTitle(),
		ad_url: faker.internet.url(),
		company_id: companyId as CompanyId,
		notes: faker.lorem.sentences(),
		date_added: new Date(),
	};
}

export function generateRole(companyId: CompanyId): NonNullableObject<Role> {
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
			range.RANGE_UB_INC | RANGE_LB_INC,
		),
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
