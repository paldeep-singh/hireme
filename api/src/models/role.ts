import Role, { RoleInitializer } from "../../generatedTypes/hire_me/Role";
import db from "./db";

async function addRole({
  title,
  company_id,
  cover_letter,
  ad_url,
}: RoleInitializer) {
  try {
    const role = await db.one<Role>(
      "INSERT INTO role (company_id, title, cover_letter, ad_url) VALUES ($1, $2, $3, $4) RETURNING id, company_id, title, cover_letter, ad_url",
      [company_id, title, cover_letter, ad_url ?? null],
    );

    return role;
  } catch (error) {
    throw new Error(`Database query failed: ${error}`);
  }
}

export const roleModel = {
  addRole,
};
