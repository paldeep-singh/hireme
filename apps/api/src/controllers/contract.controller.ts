import Contract, {
	ContractInitializer,
} from "@repo/api-types/generated/api/hire_me/Contract";
import { StatusCodes } from "http-status-codes";
import { contractService } from "../services/contract.service";
import { RequestHandler } from "./sharedTypes";

export const handleAddContract: RequestHandler<
	Contract,
	ContractInitializer
> = async (req, res) => {
	const contract = await contractService.addContract(req.body);

	res.status(StatusCodes.CREATED).json(contract);
};
