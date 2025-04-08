import { randomBytes } from "crypto";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { addHours } from "date-fns";
import range from "postgres-range";
import DBAdmin, { AdminId } from "../generated/db/hire_me/Admin.js";
import DBApplication, {
	ApplicationId,
} from "../generated/db/hire_me/Application.js";
import DBCompany, { CompanyId } from "../generated/db/hire_me/Company.js";
import { CompetencyId } from "../generated/db/hire_me/Competency.js";
import { ContractId } from "../generated/db/hire_me/Contract.js";
import DBRequirement, {
	RequirementId,
} from "../generated/db/hire_me/Requirement.js";
import DBRequirementMatchLevel from "../generated/db/hire_me/RequirementMatchLevel.js";
import DBRole, { RoleId } from "../generated/db/hire_me/Role.js";
import DBRoleLocation, {
	RoleLocationId,
} from "../generated/db/hire_me/RoleLocation.js";
import DBSession, { SessionId } from "../generated/db/hire_me/Session.js";
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

export function generateCompanyData(): NonNullableObject<
	Omit<DBCompany, "id">
> {
	return {
		name: faker.company.name(),
		notes: faker.lorem.sentences(),
		website: faker.internet.url(),
	};
}

export function generateCompany(): NonNullableObject<DBCompany> {
	return {
		id: generateId<CompanyId>(),
		...generateCompanyData(),
	};
}

export function generateRoleData(
	companyId: number,
): NonNullableObject<Omit<DBRole, "id">> {
	return {
		title: faker.person.jobTitle(),
		ad_url: faker.internet.url(),
		company_id: companyId as CompanyId,
		notes: faker.lorem.sentences(),
		date_added: new Date(),
	};
}

export function generateRole(companyId: CompanyId): NonNullableObject<DBRole> {
	return {
		id: generateId<RoleId>(),
		...generateRoleData(companyId),
	};
}

export function generateRoleLocationData(
	roleId: RoleId,
): NonNullableObject<Omit<DBRoleLocation, "id">> {
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
): Omit<DBApplication, "id"> {
	const submitted = faker.datatype.boolean();

	return {
		role_id: roleId,
		cover_letter: faker.lorem.sentences(),
		date_submitted: submitted ? faker.date.recent() : null,
	};
}

export function getRandomMatchLevel(): DBRequirementMatchLevel {
	return faker.helpers.arrayElement<DBRequirementMatchLevel>([
		"exceeded",
		"met",
		"room_for_growth",
	]);
}

export function generateRequirementData(
	roleId: number,
): NonNullableObject<Omit<DBRequirement, "id">> {
	return {
		description: faker.lorem.sentence(),
		bonus: faker.datatype.boolean(),
		role_id: roleId as RoleId,
	};
}

export function generateRequirement(
	roleId: RoleId,
): NonNullableObject<DBRequirement> {
	return {
		id: generateId<RequirementId>(),
		...generateRequirementData(roleId),
	};
}

type AdminData = Omit<DBAdmin, "id"> & {
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
	NonNullableObject<DBAdmin> & { password: string }
> {
	return {
		id: generateId<AdminId>(),
		...(await generateAdminData()),
	};
}

export function generateAdminSession(admin_id: AdminId): DBSession {
	const id = randomBytes(32).toString("hex") as SessionId;

	return {
		id,
		expiry: addHours(new Date(), 2),
		admin_id,
	};
}
