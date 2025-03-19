import { AdminErrorCodes, adminModel } from "../models/admin.js";
import { RequestHandler } from "./sharedTypes.js";
import { StatusCodes } from "http-status-codes";
import { isError } from "../utils/errors.js";
import { controllerErrorMessages } from "./errors.js";
import { SessionId } from "shared/generated/db/hire_me/Session.js";
import { UserCredentials } from "shared/types/userCredentials.js";

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
