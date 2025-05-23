import { db } from "../db/database";
import { NewSalary } from "../db/generated/hire_me/Salary";

async function addSalary(salary: NewSalary) {
	return await db
		.withSchema("hire_me")
		.insertInto("salary")
		.values(salary)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export const salaryModel = {
	addSalary,
};
