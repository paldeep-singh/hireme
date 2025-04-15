import Company from "@repo/api-types/generated/api/hire_me/Company";
import { NewCompany } from "../db/generated/hire_me/Company";
import { companyModel } from "../models/company.model";

export enum companyErrorCodes {
	COMPANY_EXISTS = "Company already exists",
}

async function addCompany({
	name,
	notes,
	website,
}: NewCompany): Promise<Company> {
	try {
		const company = await companyModel.getCompanyByName(name);

		if (company) {
			throw new Error(companyErrorCodes.COMPANY_EXISTS);
		}

		const newCompany = await companyModel.addCompany({
			name,
			notes,
			website,
		});

		if (!newCompany) {
			throw new Error("no data");
		}

		return newCompany;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

async function getCompanies(): Promise<Company[]> {
	try {
		const companies = await companyModel.getCompanies();

		return companies;
	} catch (error) {
		throw new Error(`Database query failed: ${error}`);
	}
}

export const companyService = {
	addCompany,
	getCompanies,
};
