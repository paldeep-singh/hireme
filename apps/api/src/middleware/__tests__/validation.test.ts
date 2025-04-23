import { faker } from "@faker-js/faker";
import { z } from "zod";
import {
	expectThrowsAppError,
	getMockReq,
	getMockRes,
} from "../../testUtils/index";
import { validateRequestBody } from "../validation";

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
