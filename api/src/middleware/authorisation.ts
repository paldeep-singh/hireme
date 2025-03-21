import { NextFunction, RequestHandler, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AdminErrorCodes, adminModel } from "../models/admin.js";
import { SessionId } from "shared/generated/db/hire_me/Session.js";
import { isError } from "../utils/errors.js";

export enum authorisationrErrors {
  BAD_REQUEST = "Invalid session.",
  UNAUTHORISED_EXPIRED = "Session has expired, please login again.",
  UNAUTHORISED_INVALID = "Session invalid, please login again.",
  UNKNOWN = "An unknown error occurred",
}

export function authoriseRequest(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.cookies) {
        res.status(StatusCodes.BAD_REQUEST).json({
          error: authorisationrErrors.BAD_REQUEST,
        });
        return;
      }

      const { session } = req.cookies;

      if (!session || !(typeof session === "string")) {
        res.status(StatusCodes.BAD_REQUEST).json({
          error: authorisationrErrors.BAD_REQUEST,
        });
        return;
      }

      const result = await adminModel.validateSession(session as SessionId);

      if (result.valid) {
        next();
        return;
      }

      if (result.code === AdminErrorCodes.EXPIRED_SESSION) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: authorisationrErrors.UNAUTHORISED_EXPIRED });
        return;
      }

      if (result.code === AdminErrorCodes.INVALID_SESSION) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          error: authorisationrErrors.UNAUTHORISED_INVALID,
        });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: authorisationrErrors.UNKNOWN });
      return;
    } catch (error) {
      if (!isError(error)) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: authorisationrErrors.UNKNOWN });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };
}
