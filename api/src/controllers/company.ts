import Company, {
  CompanyInitializer,
} from "../../generatedTypes/hire_me/Company";
import { companyModel } from "../models/company";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { RequestHandler } from "./sharedTypes";

export enum CompanyErrorCodes {
  COMPANY_EXISTS = "Company already exists",
}

export const handleCreateCompany: RequestHandler<
  Company,
  CompanyInitializer
> = async (req, res) => {
  const { name } = req.body;

  try {
    const companyExists = await companyModel.checkCompanyExists(name);

    if (companyExists) {
      res.status(StatusCodes.CONFLICT).json({
        error: CompanyErrorCodes.COMPANY_EXISTS,
      });
      return;
    }

    const company = await companyModel.createCompany(name);
    res.status(StatusCodes.CREATED).json(company);
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

export const handleGetAllCompanies: RequestHandler<Company[]> = async (
  _,
  res,
) => {
  try {
    const companies = await companyModel.getAllCompanies();
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
