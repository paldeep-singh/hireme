import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Role, { RoleInitializer } from "../../generatedTypes/hire_me/Role";
import { roleModel } from "../models/role";
import { RequestHandler } from "./sharedTypes";

export const handleAddRole: RequestHandler<Role, RoleInitializer> = async (
  req,
  res,
) => {
  const { title, company_id, cover_letter, ad_url } = req.body;

  try {
    const role = await roleModel.addRole({
      title,
      company_id,
      cover_letter,
      ad_url,
    });
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
