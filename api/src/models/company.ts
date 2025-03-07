import Company from "../../generatedTypes/hire_me/Company";
import db from "./db";

export enum companyErrorCodes {
  COMPANY_EXISTS = "Company already exists",
}

async function createCompany(name: string) {
  try {
    const company = await db.oneOrNone<Company>(
      "SELECT id, name FROM company WHERE name = $1",
      [name],
    );

    if (company) {
      throw new Error(companyErrorCodes.COMPANY_EXISTS);
    }

    const result = await db.one<Company>(
      "INSERT INTO company (name) VALUES ($1) RETURNING id, name",
      [name],
    );

    return result;
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
}

async function getAllCompanies() {
  try {
    const companies = await db.any<Company>(
      "SELECT id, name FROM company ORDER BY name",
    );
    return companies;
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
}

async function getCompanyByName(name: string) {
  try {
    const company = await db.one(
      "SELECT id, name FROM company WHERE name = $1",
      [name],
    );
    return company;
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
}

async function deleteCompany(id: number) {
  try {
    await db.none("DELETE FROM company WHERE id = $1", [id]);
  } catch (error) {
    console.error(error);
    throw new Error(`Database query failed: ${error}`);
  }
}

export const companyModel = {
  createCompany,
  getAllCompanies,
  getCompanyByName,
  deleteCompany,
};
