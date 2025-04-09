import Company, {
	CompanyInitializer,
} from "@repo/shared/generated/api/hire_me/Company";
import DBCompany from "@repo/shared/generated/db/hire_me/Company";
import dbPromise from "./dbPromise";

export enum companyErrorCodes {
	COMPANY_EXISTS = "Company already exists",
}

async function addCompany({
	name,
	notes,
	website,
}: CompanyInitializer): Promise<Company> {
	try {
		const company = await dbPromise.oneOrNone<DBCompany>(
			"SELECT id, name FROM company WHERE name = $1",
			[name],
		);

		if (company) {
			throw new Error(companyErrorCodes.COMPANY_EXISTS);
		}

		const result = await dbPromise.one<DBCompany>(
			"INSERT INTO company (name, notes, website) VALUES ($1, $2, $3) RETURNING id, name, notes, website",
			[name, notes, website],
		);

		return result;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getCompanies(): Promise<Company[]> {
	try {
		const companies = await dbPromise.any<DBCompany>(
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
