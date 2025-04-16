import Company from "@repo/api-types/generated/api/hire_me/Company";
import { StatusCodes } from "http-status-codes";
import { NewCompany } from "../db/generated/hire_me/Company";
import { companyModel } from "../models/company.model";
import { AppError } from "../utils/errors";

export enum companyErrorCodes {
	COMPANY_EXISTS = "Company already exists.",
}

export const companyErrorMessages = {
	COMPANY_EXISTS: "Company with same name already exists.",
	COMPANY_CREATION_FAILED: "Failed to create company.",
} as const;

async function addCompany({
	name,
	notes,
	website,
}: NewCompany): Promise<Company> {
	const company = await companyModel.getCompanyByName(name);

	if (company) {
		throw new AppError(
			StatusCodes.CONFLICT,
			true,
			companyErrorMessages.COMPANY_EXISTS,
		);
	}

	const newCompany = await companyModel.addCompany({
		name,
		notes,
		website,
	});

	if (!newCompany) {
		throw new AppError(
			StatusCodes.INTERNAL_SERVER_ERROR,
			true,
			companyErrorMessages.COMPANY_CREATION_FAILED,
		);
	}

	return newCompany;
}

async function getCompanies(): Promise<Company[]> {
	const companies = await companyModel.getCompanies();

	return companies;
}

export const companyService = {
	addCompany,
	getCompanies,
};
