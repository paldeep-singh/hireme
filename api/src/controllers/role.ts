import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Role, { RoleInitializer } from "shared/src/generated/db/hire_me/Role";
import { roleModel, RolePreview } from "../models/role";
import { RequestHandler } from "./sharedTypes";

export const handleAddRole: RequestHandler<Role, RoleInitializer> = async (
  req,
  res,
) => {
  try {
    const role = await roleModel.addRole(req.body);
    res.status(StatusCodes.CREATED).json(role);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
      return;
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

export const handleGetRolePreviews: RequestHandler<RolePreview[]> = async (
  _,
  res,
) => {
  try {
    const rolePreviews = await roleModel.getRolePreviews();

    res.status(StatusCodes.OK);
    res.json(rolePreviews);
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
