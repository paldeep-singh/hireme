import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { CompanyInitializer } from "../../generatedTypes/hire_me/Company";
import { companyModel } from "../models/company";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export async function handleCreateCompany(
  req: Request<ParamsDictionary, CompanyInitializer>,
  res: Response
) {
  const { name } = req.body;

  try {
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
}
