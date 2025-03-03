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

export const createCompany = async (name: string) => {
  try {
    const result = await db.none(
      "INSERT INTO companies (id, name) VALUES (gen_random_uuid(), $1)",
      [name]
    );

    return result;
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
};

export const getCompanyByName = async (name: string) => {
  try {
    const company = await db.one("SELECT * FROM companies WHERE name = $1", [
      name,
    ]);
    return company;
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
};
