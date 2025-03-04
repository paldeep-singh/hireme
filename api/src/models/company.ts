import db from "./db";

export const createCompany = async (name: string) => {
  try {
    const result = await db.one(
      "INSERT INTO company (name) VALUES ($1) RETURNING *",
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
    const companies = await db.any("SELECT * FROM company ORDER BY name");
    return companies;
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
};

export const getCompanyByName = async (name: string) => {
  try {
    const company = await db.one("SELECT * FROM company WHERE name = $1", [
      name,
    ]);
    return company;
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
};

export const deleteCompany = async (id: number) => {
  try {
    await db.none("DELETE FROM company WHERE id = $1", [id]);
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
};
