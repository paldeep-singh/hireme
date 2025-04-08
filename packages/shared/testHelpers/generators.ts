import { randomBytes } from "crypto";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { addHours } from "date-fns";
import range from "postgres-range";
import DBAdmin, { DBAdminId } from "../generated/db/hire_me/Admin.js";
import DBApplication, {
	DBApplicationId,
} from "../generated/db/hire_me/Application.js";
import DBCompany, { DBCompanyId } from "../generated/db/hire_me/Company.js";
import { DBCompetencyId } from "../generated/db/hire_me/Competency.js";
import { DBContractId } from "../generated/db/hire_me/Contract.js";
import DBRequirement, {
	DBRequirementId,
} from "../generated/db/hire_me/Requirement.js";
import DBRequirementMatchLevel from "../generated/db/hire_me/RequirementMatchLevel.js";
import DBRole, { DBRoleId } from "../generated/db/hire_me/Role.js";
import DBRoleLocation, {
	DBRoleLocationId,
} from "../generated/db/hire_me/RoleLocation.js";
import DBSession, { DBSessionId } from "../generated/db/hire_me/Session.js";
import { NonNullableObject } from "../types/utils.js";

export function generateId<
	T extends
		| DBAdminId
		| DBCompanyId
		| DBRoleId
		| DBApplicationId
		| DBRequirementId
		| DBContractId
		| DBCompetencyId
		| DBRoleLocationId,
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
		id: generateId<DBCompanyId>(),
		...generateCompanyData(),
	};
}

export function generateRoleData(
	companyId: number,
): NonNullableObject<Omit<DBRole, "id">> {
	return {
		title: faker.person.jobTitle(),
		ad_url: faker.internet.url(),
		company_id: companyId as DBCompanyId,
		notes: faker.lorem.sentences(),
		date_added: new Date(),
	};
}

export function generateRole(
	companyId: DBCompanyId,
): NonNullableObject<DBRole> {
	return {
		id: generateId<DBRoleId>(),
		...generateRoleData(companyId),
	};
}

export function generateRoleLocationData(
	roleId: DBRoleId,
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
	roleId: DBRoleId,
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
		role_id: roleId as DBRoleId,
	};
}

export function generateRequirement(
	roleId: DBRoleId,
): NonNullableObject<DBRequirement> {
	return {
		id: generateId<DBRequirementId>(),
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
		id: generateId<DBAdminId>(),
		...(await generateAdminData()),
	};
}

export function generateAdminSession(admin_id: DBAdminId): DBSession {
	const id = randomBytes(32).toString("hex") as DBSessionId;

	return {
		id,
		expiry: addHours(new Date(), 2),
		admin_id,
	};
}
