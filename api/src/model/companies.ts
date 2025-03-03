import db from "./db";

export const createCompany = async (name: string) => {
  try {
    const result = await db.one(
      "INSERT INTO companies (id, name) VALUES (gen_random_uuid(), $1) RETURNING *",
      [name]
    );

    return result;
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
};

export const getAllCompanies = async () => {
  try {
    const users = await db.any("SELECT * FROM companies ORDER BY name");
    return users;
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

export const deleteCompany = async (id: string) => {
  try {
    await db.none("DELETE FROM companies WHERE id = $1", [id]);
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
};
