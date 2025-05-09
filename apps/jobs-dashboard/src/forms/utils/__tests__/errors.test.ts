import { faker } from "@faker-js/faker";
import { getFormOrFieldError } from "../errors";

describe("getFormOrFieldError", () => {
	it("should return undefined when error is undefined", () => {
		expect(getFormOrFieldError(undefined)).toBeUndefined();
	});

	it("should return the string when error is a string", () => {
		const errorMessage = faker.lorem.sentence();
		expect(getFormOrFieldError(errorMessage)).toBe(errorMessage);
	});

	it("should return undefined when error is an empty array", () => {
		expect(getFormOrFieldError([])).toBeUndefined();
	});

	it("should return the message when error is an array with an object containing a message property", () => {
		const errorMessage = faker.lorem.sentence();
		const errorArray = [{ message: errorMessage }];
		expect(getFormOrFieldError(errorArray)).toBe(errorMessage);
	});

	it("should return undefined when error is an array with an object without a message property", () => {
		const errorArray = [{ [faker.lorem.word()]: faker.lorem.word() }];
		expect(getFormOrFieldError(errorArray)).toBeUndefined();
	});

	it("should return undefined when error is an array with an object with non-string message", () => {
		const errorArray = [{ message: faker.number.int() }];
		expect(getFormOrFieldError(errorArray)).toBeUndefined();
	});
});
