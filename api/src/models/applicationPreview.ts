import Company from "../../generatedTypes/hire_me/Company";
import Role from "../../generatedTypes/hire_me/Role";
import db from "./db";

// TODO: THis should just be in the "role" model?
export interface ApplicationPreview extends Omit<Role, "id"> {
  role_id: Role["id"];
  company: Company["name"];
}

async function getApplicationPreviews(): Promise<ApplicationPreview[]> {
  try {
    const applicationPreviews = await db.manyOrNone<ApplicationPreview>(
      `SELECT r.id AS role_id, r.company_id, r.title, r.ad_url, r.notes, c.name AS company
         FROM role r, company c
         WHERE r.company_id = c.id`,
    );

    return applicationPreviews;
  } catch (error) {
    throw new Error(`Database query failed: ${error}`);
  }
}

export const applicationPreviewModel = {
  getApplicationPreviews,
};
