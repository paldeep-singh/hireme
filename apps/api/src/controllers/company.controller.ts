import Company, {
	CompanyInitializer,
} from "@repo/api-types/generated/api/hire_me/Company";
import { StatusCodes } from "http-status-codes";
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
