import Contract, {
	ContractInitializer,
} from "@repo/api-types/generated/api/hire_me/Contract";
import { toNumrangeString } from "@repo/api-types/utils/toNumrangeString";
import parseInterval from "postgres-interval";
import { Range } from "postgres-range";
import { contractModel } from "../models/contract.model";
import { isoIntervalToPostgresInterval } from "../utils/isoIntervalToPostgresInterval";

async function addContract(
	contractDetails: ContractInitializer,
): Promise<Contract> {
	const newContract = await contractModel.addContract({
		...contractDetails,
		salary_range: contractDetails.salary_range
			? new Range(
					contractDetails.salary_range?.min,
					contractDetails.salary_range?.max,
					0,
				)
			: null,
		term: contractDetails.term
			? parseInterval(isoIntervalToPostgresInterval(contractDetails.term))
			: null,
	});

	return {
		...newContract,
		salary_range: toNumrangeString(newContract.salary_range),
		term: newContract.term ? newContract.term.toISOString() : null,
	};
}

export const contractService = {
	addContract,
};
