import { randomBytes } from "crypto";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { addHours } from "date-fns";
import Admin, { AdminId } from "../generated/db/hire_me/Admin.js";
import Company, { CompanyId } from "../generated/db/hire_me/Company.js";
import Requirement from "../generated/db/hire_me/Requirement.js";
import RequirementMatchLevel from "../generated/db/hire_me/RequirementMatchLevel.js";
import Role, { RoleId } from "../generated/db/hire_me/Role.js";
import Session, { SessionId } from "../generated/db/hire_me/Session.js";
import { NonNullableObject } from "../types/utils.js";

export function generateCompanyData(): NonNullableObject<Omit<Company, "id">> {
	return {
		name: faker.company.name(),
		notes: faker.lorem.sentences(),
		website: faker.internet.url(),
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

export function generateAdminSession(admin_id: AdminId): Session {
	const id = randomBytes(32).toString("hex") as SessionId;

	return {
		id,
		expiry: addHours(new Date(), 2),
		admin_id,
	};
}
