import { AdminErrorCodes, adminModel } from "../models/admin.js";
import { RequestHandler } from "./sharedTypes.js";
import { StatusCodes } from "http-status-codes";
import { isError } from "../utils/errors.js";
import { controllerErrorMessages } from "./errors.js";
import { SessionId } from "shared/generated/db/hire_me/Session.js";
import { UserCredentials } from "shared/types/userCredentials.js";
import { authorisationrErrors } from "../middleware/authorisation.js";

export const handleLogin: RequestHandler<
  { id: SessionId },
  UserCredentials
> = async (req, res) => {
  try {
    const { email, password } = req.body;

    const session_id = await adminModel.login(email, password);

    res.status(StatusCodes.CREATED).json({
      id: session_id,
    });
  } catch (error) {
    if (!isError(error)) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: controllerErrorMessages.DATABASE_ERROR,
      });
      return;
    }

    if (error.message === AdminErrorCodes.INVALID_USER) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: controllerErrorMessages.INVALID_CREDENTIALS,
      });
      return;
    }

    if (error.message === AdminErrorCodes.MULTIPLE_USERS) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: controllerErrorMessages.DATABASE_ERROR,
      });
      return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: controllerErrorMessages.UNKNOWN_ERROR,
    });
  }
};

export const handleValidateSession: RequestHandler = async (req, res) => {
  if (!req.cookies) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: authorisationrErrors.BAD_REQUEST });
    return;
  }

  const { session } = req.cookies;

  if (!session || !(typeof session === "string")) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: authorisationrErrors.BAD_REQUEST,
    });
    return;
  }

  try {
    const result = await adminModel.validateSession(session as SessionId);

    if (result.valid) {
      res.status(StatusCodes.OK).send();
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
