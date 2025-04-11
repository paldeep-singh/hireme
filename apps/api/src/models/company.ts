import Company, {
	CompanyInitializer,
} from "@repo/shared/generated/api/hire_me/Company";
import { CompanyId } from "@repo/shared/generated/db/hire_me/Company";
import db from "../db/db";
import { addCompany as addCompanyQuery } from "./queries/company/AddCompany.queries";
import { getCompanies as getCompaniesQuery } from "./queries/company/GetCompanies.queries";
import { getCompanyByName } from "./queries/company/GetCompanyByName.queries";

export enum companyErrorCodes {
	COMPANY_EXISTS = "Company already exists",
}

async function addCompany({
	name,
	notes,
	website,
}: CompanyInitializer): Promise<Company> {
	try {
		const company = await db.oneOrNone(getCompanyByName, { name });

		if (company) {
			throw new Error(companyErrorCodes.COMPANY_EXISTS);
		}

		const result = await db.one(addCompanyQuery, { name, notes, website });

		return {
			...result,
			id: result.id as CompanyId,
		};
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getCompanies(): Promise<Company[]> {
	try {
		const companies = await db.any(getCompaniesQuery, undefined);

		return companies as Company[];
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const companyModel = {
	addCompany,
	getCompanies,
};
