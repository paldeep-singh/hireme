import Contract, {
	ContractInitializer,
} from "@repo/api-types/generated/api/hire_me/Contract";
import { toNumrangeObject } from "@repo/api-types/utils/numrange";
import parseInterval from "postgres-interval";
import { contractModel } from "../models/contract.model";
import { isoIntervalToPostgresInterval } from "../utils/isoIntervalToPostgresInterval";
import { toPostgresNumRange } from "../utils/postgresRange";

async function addContract(
	contractDetails: ContractInitializer,
): Promise<Contract> {
	const newContract = await contractModel.addContract({
		...contractDetails,
		salary_range: toPostgresNumRange(
			contractDetails.salary_range,
			"salary_range",
		),
		term: contractDetails.term
			? parseInterval(isoIntervalToPostgresInterval(contractDetails.term))
			: null,
	});

	return {
		...newContract,
		salary_range: toNumrangeObject(newContract.salary_range),
		term: newContract.term ? newContract.term.toISOString() : null,
	};
}

export const contractService = {
	addContract,
};
