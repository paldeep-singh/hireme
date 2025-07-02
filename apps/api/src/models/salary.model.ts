import { db } from "../db/database";
import {
	NewSalary,
	SalaryId,
	SalaryUpdate,
} from "../db/generated/hire_me/Salary";

async function addSalary(salary: NewSalary) {
	return await db
		.withSchema("hire_me")
		.insertInto("salary")
		.values(salary)
		.returningAll()
		.executeTakeFirstOrThrow();
}

async function updateSalary(salary: SalaryUpdate, id: SalaryId) {
	return await db
		.withSchema("hire_me")
		.updateTable("salary")
		.set(salary)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export const salaryModel = {
	addSalary,
	updateSalary,
};
