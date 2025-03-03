import db from "./db";

export const getAllCompanies = async () => {
  try {
    const users = await db.any("SELECT * FROM companies");
    return users;
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
};
