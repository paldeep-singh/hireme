import Company from "@repo/api-types/generated/api/hire_me/Company";
import { CompanyUpdateInput } from "@repo/api-types/validators/Company";
import { StatusCodes } from "http-status-codes";
import { CompanyId, NewCompany } from "../db/generated/hire_me/Company";
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

	return newCompany;
}

async function getCompanies(): Promise<Company[]> {
	const companies = await companyModel.getCompanies();

	return companies;
}

async function updateCompany(
	updates: CompanyUpdateInput,
	id: CompanyId,
): Promise<Company> {
	const updatedCompany = await companyModel.updateCompany(updates, id);

	return updatedCompany;
}

export const companyService = {
	addCompany,
	getCompanies,
	updateCompany,
};
