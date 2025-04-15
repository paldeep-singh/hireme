import Company, {
	CompanyInitializer,
} from "@repo/api-types/generated/api/hire_me/Company";
import { db } from "../db/database";

export enum companyErrorCodes {
	COMPANY_EXISTS = "Company already exists",
}

async function addCompany({
	name,
	notes,
	website,
}: CompanyInitializer): Promise<Company> {
	try {
		const company = await db
			.withSchema("hire_me")
			.selectFrom("company")
			.where("name", "=", name)
			.select("id")
			.executeTakeFirst();

		if (company) {
			throw new Error(companyErrorCodes.COMPANY_EXISTS);
		}

		const newCompany = await db
			.withSchema("hire_me")
			.insertInto("company")
			.values({
				name,
				notes,
				website,
			})
			.returning(["id", "name", "notes", "website"])
			.executeTakeFirstOrThrow();

		return newCompany;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getCompanies(): Promise<Company[]> {
	try {
		const companies = await db
			.withSchema("hire_me")
			.selectFrom("company")
			.select(["id", "name", "company.notes", "website"])
			.execute();

		return companies;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const companyModel = {
	addCompany,
	getCompanies,
};
