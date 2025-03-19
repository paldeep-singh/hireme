import { AdminErrorCodes, adminModel, AdminSession } from "../models/admin.js";
import { RequestHandler } from "./sharedTypes.js";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { AdminId } from "shared/generated/db/hire_me/Admin.js";
import { isError } from "../utils/errors.js";
import { controllerErrorMessages } from "./errors.js";

export const handleLogin: RequestHandler<
  { id: AdminId; session_token: string },
  { email: string; password: string }
> = async (req, res) => {
  try {
    const { email: providedEmail, password } = req.body;

    const { password_hash, id } =
      await adminModel.getAdminDetails(providedEmail);

    const passwordMatch = await bcrypt.compare(password, password_hash);

    if (!passwordMatch) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: controllerErrorMessages.INVALID_CREDENTIALS,
      });

      return;
    }

    const session = await adminModel.createNewSession({ id });

    res.status(StatusCodes.OK).json(session);
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
