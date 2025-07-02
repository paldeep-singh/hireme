import Company, {
	CompanyInitializer,
} from "@repo/api-types/generated/api/hire_me/Company";
import { CompanyUpdateInput } from "@repo/api-types/validators/Company";
import { StatusCodes } from "http-status-codes";
import { CompanyId } from "../db/generated/hire_me/Company";
import { companyService } from "../services/company.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddCompany: RequestHandler<
	Company,
	CompanyInitializer
> = async (req, res) => {
	const company = await companyService.addCompany(req.body);
	res.status(StatusCodes.CREATED).json(company);
};

export const handleGetCompanies: RequestHandler<Company[]> = async (_, res) => {
	const companies = await companyService.getCompanies();
	res.json(companies);
};

export const handleUpdateCompany: RequestHandler<
	Company,
	CompanyUpdateInput,
	{ company_id: number }
> = async (req, res) => {
	const updatedCompany = await companyService.updateCompany(
		req.body,
		req.parsedParams.company_id as CompanyId,
	);

	res.status(StatusCodes.OK).json(updatedCompany);
};
