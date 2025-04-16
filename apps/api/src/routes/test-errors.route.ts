import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/errors";

export const testErrorsRouter = Router();

export const APP_ERROR_MESSAGE = "An app error occurred.";
export const ERROR_MESSAGE = "An unexpected error occurred.";

// @ts-expect-error Params not used but declaration must have correct shape
// eslint-disable-next-line @typescript-eslint/no-unused-vars
testErrorsRouter.get("/error/app", async (req, res, next) => {
	throw new AppError(StatusCodes.BAD_GATEWAY, true, APP_ERROR_MESSAGE);
});

// @ts-expect-error Params not used but declaration must have correct shape
// eslint-disable-next-line @typescript-eslint/no-unused-vars
testErrorsRouter.get("/error/unexpected", async (req, res, next) => {
	throw new Error(ERROR_MESSAGE);
});
