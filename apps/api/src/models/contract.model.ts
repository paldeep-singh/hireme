import { db } from "../db/database";
import { NewContract } from "../db/generated/hire_me/Contract";

async function addContract(contract: NewContract) {
	return await db
		.withSchema("hire_me")
		.insertInto("contract")
		.values(contract)
		.returningAll()
		.executeTakeFirstOrThrow();
}

export const contractModel = {
	addContract,
};
