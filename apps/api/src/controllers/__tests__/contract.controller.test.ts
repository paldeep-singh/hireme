import { generateApiContractData } from "@repo/api-types/testUtils/generators";
import { ContractId } from "../../db/generated/hire_me/Contract";
import { contractService } from "../../services/contract.service";
import { getMockReq, getMockRes } from "../../testUtils";
import {
	generateCompany,
	generateId,
	generateRole,
} from "../../testUtils/generators";
import { handleAddContract } from "../contract.controller";

vi.mock("../../services/contract.service");

const mockAddContract = vi.mocked(contractService.addContract);

describe("handleAddContract", () => {
	describe("when the contract is successfully added", () => {
		const company = generateCompany();

		const role = generateRole(company.id);

		const contractData = generateApiContractData(role.id);

		const contractId = generateId<ContractId>();

		const req = getMockReq({
			body: contractData,
		});
		const { res, next } = getMockRes();

		beforeEach(() => {
			mockAddContract.mockResolvedValue({
				id: contractId,
				...contractData,
			});
		});

		it("returns 201 status code", async () => {
			await handleAddContract(req, res, next);

			expect(res.status).toHaveBeenCalledWith(201);
		});

		it("returns the contract", async () => {
			await handleAddContract(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				id: contractId,
				...contractData,
			});
		});
	});
});
