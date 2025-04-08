import DBCompany, {
	DBCompanyInitializer,
} from "@repo/shared/generated/db/hire_me/Company";
import db from "./db";

export enum companyErrorCodes {
	COMPANY_EXISTS = "Company already exists",
}

async function addCompany({
	name,
	notes,
	website,
}: DBCompanyInitializer): Promise<DBCompany> {
	try {
		const company = await db.oneOrNone<DBCompany>(
			"SELECT id, name FROM company WHERE name = $1",
			[name],
		);

		if (company) {
			throw new Error(companyErrorCodes.COMPANY_EXISTS);
		}

		const result = await db.one<DBCompany>(
			"INSERT INTO company (name, notes, website) VALUES ($1, $2, $3) RETURNING id, name, notes, website",
			[name, notes, website],
		);

		return result;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getCompanies(): Promise<DBCompany[]> {
	try {
		const companies = await db.any<DBCompany>(
			"SELECT id, name, notes, website FROM company ORDER BY name",
		);
		return companies;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const companyModel = {
	addCompany,
	getCompanies,
};
