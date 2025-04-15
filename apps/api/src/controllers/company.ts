import Company, {
	CompanyInitializer,
} from "@repo/api-types/generated/api/hire_me/Company";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { companyErrorCodes, companyService } from "../services/company.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddCompany: RequestHandler<
	Company,
	CompanyInitializer
> = async (req, res) => {
	try {
		const company = await companyService.addCompany(req.body);
		res.status(StatusCodes.CREATED).json(company);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === companyErrorCodes.COMPANY_EXISTS) {
				res.status(StatusCodes.CONFLICT).json({
					error: companyErrorCodes.COMPANY_EXISTS,
				});
				return;
			}

			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: error.message,
			});
			return;
		}

		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: ReasonPhrases.INTERNAL_SERVER_ERROR,
		});
	}
};

export const handleGetCompanies: RequestHandler<Company[]> = async (_, res) => {
	try {
		const companies = await companyService.getCompanies();
		res.json(companies);
	} catch (error) {
		if (error instanceof Error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: error.message,
			});
			return;
		}

		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: ReasonPhrases.INTERNAL_SERVER_ERROR,
		});
	}
};
