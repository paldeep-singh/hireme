import { faker } from "@faker-js/faker";
import { z } from "zod";
import {
	expectThrowsAppError,
	getMockReq,
	getMockRes,
} from "../../testUtils/index";
import { validateRequestBody, validateRequestParams } from "../validation";

describe("validateRequestBody", () => {
	const testSchema = z.object({
		id: z.number(),
		name: z.string(),
	});

	describe("when the request body is valid", () => {
		it("calls next", () => {
			const req = getMockReq({
				body: {
					id: faker.number.int({ max: 100 }),
					name: faker.person.fullName(),
				},
			});

			const { res, next } = getMockRes();

			const validator = validateRequestBody(testSchema);

			validator(req, res, next);

			expect(next).toHaveBeenCalled();
		});
	});

	describe("when the request body is invalid", () => {
		it("throw an AppError error message", () => {
			const req = getMockReq({
				body: {
					id: faker.person.firstName(),
					name: faker.number.int({ max: 100 }),
				},
			});

			const { res, next } = getMockRes();

			const validator = validateRequestBody(testSchema);

			expectThrowsAppError(
				() => validator(req, res, next),
				400,
				"id is Expected number, received string/nname is Expected string, received number",
				true,
			);
		});
	});
});

describe("validateRequestParams", () => {
	const testSchema = z.object({
		number: z.coerce.number(),
		string: z.string().min(1),
	});

	describe("when the require params are provided", () => {
		it("calls next", () => {
			const req = getMockReq({
				params: { number: "1", string: "A string" },
			});

			const { res, next } = getMockRes();

			const validator = validateRequestParams(testSchema);

			validator(req, res, next);

			expect(next).toHaveBeenCalled();
		});

		it("set parsedParams", () => {
			const req = getMockReq({
				params: { number: "1", string: "A string" },
			});

			const { res, next } = getMockRes();

			const validator = validateRequestParams(testSchema);

			validator(req, res, next);

			expect(req.parsedParams).toEqual({
				number: 1,
				string: "A string",
			});
		});
	});

	describe("when the request params are invalid", () => {
		it("throws an AppError", () => {
			const req = getMockReq({
				params: { number: "Not a number", string: "A string" },
			});

			const { res, next } = getMockRes();

			const validator = validateRequestParams(testSchema);

			expectThrowsAppError(
				() => validator(req, res, next),
				400,
				"number is Expected number, received nan",
				true,
			);
		});
	});
});
