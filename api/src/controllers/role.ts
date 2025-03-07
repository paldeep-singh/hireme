import Role, { RoleInitializer } from "../../generatedTypes/hire_me/Role";
import { roleModel } from "../models/role";
import { RequestHandler } from "./sharedTypes";

export const handleCreateRole: RequestHandler<Role, RoleInitializer> = async (
  req,
  res,
) => {
  const { title, company_id, cover_letter, ad_url } = req.body;

  try {
    const role = await roleModel.createRole({
      title,
      company_id,
      cover_letter,
      ad_url,
    });
    res.status(201).json(role);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};
