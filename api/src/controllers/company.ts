import Company, {
  CompanyInitializer,
} from "../../generatedTypes/hire_me/Company";
import { companyModel, companyErrorCodes } from "../models/company";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { RequestHandler } from "./sharedTypes";

export const handleCreateCompany: RequestHandler<
  Company,
  CompanyInitializer
> = async (req, res) => {
  const { name } = req.body;

  try {
    const company = await companyModel.addCompany(name);
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
    const companies = await companyModel.getCompanies();
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
