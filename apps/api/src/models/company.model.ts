import { db } from "../db/database";
import {
	CompanyId,
	CompanyUpdate,
	NewCompany,
} from "../db/generated/hire_me/Company";

async function addCompany(company: NewCompany) {
	return await db
		.withSchema("hire_me")
		.insertInto("company")
		.values(company)
		.returningAll()
		.executeTakeFirstOrThrow();
}

async function getCompanyByName(name: string) {
	return await db
		.withSchema("hire_me")
		.selectFrom("company")
		.where("name", "=", name)
		.selectAll()
		.executeTakeFirst();
}

async function getCompanies() {
	return await db
		.withSchema("hire_me")
		.selectFrom("company")
		.selectAll()
		.execute();
}

async function updateCompany(updates: CompanyUpdate, id: CompanyId) {
	return await db
		.withSchema("hire_me")
		.updateTable("company")
		.set(updates)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export const companyModel = {
	addCompany,
	getCompanyByName,
	getCompanies,
	updateCompany,
};
