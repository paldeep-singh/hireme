import { faker } from "@faker-js/faker";
import { getMockReq } from "../../testUtils";
import { parseSessionCookie } from "../parseSessionCookie";

describe("parseSessionCookie", () => {
	describe("when the request does not contain cookies", () => {
		it("returns undefined", () => {
			const req = getMockReq({
				cookies: undefined,
			});

			const sessionId = parseSessionCookie(req);

			expect(sessionId).toBeUndefined();
		});
	});

	describe("when the request contains cookies", () => {
		describe("when there is no session cookie", () => {
			const cookies = { notSession: faker.hacker.phrase() };

			it("returns undefined", () => {
				const req = getMockReq({
					cookies,
				});

				const sessionId = parseSessionCookie(req);

				expect(sessionId).toBeUndefined();
			});
		});

		describe("when there is a session cookie", () => {
			describe("when the session cookie is invalid json", () => {
				const cookies = { session: faker.hacker.phrase() };

				it("returns undefined", () => {
					const req = getMockReq({
						cookies,
					});

					const sessionId = parseSessionCookie(req);

					expect(sessionId).toBeUndefined();
				});
			});

			describe("when the session cookie not an object", () => {
				const cookies = { session: "[]" };

				it("returns undefined", () => {
					const req = getMockReq({
						cookies,
					});

					const sessionId = parseSessionCookie(req);

					expect(sessionId).toBeUndefined();
				});
			});

			describe("when the session cookie is an object", () => {
				describe("when the session cookie does not have an id", () => {
					const cookies = {
						session: JSON.stringify({ notId: faker.string.uuid() }),
					};

					it("returns undefined", () => {
						const req = getMockReq({
							cookies,
						});

						const sessionId = parseSessionCookie(req);

						expect(sessionId).toBeUndefined();
					});
				});

				describe("when the session cookie has an id", () => {
					const id = faker.string.uuid();

					const cookies = { session: JSON.stringify({ id }) };

					it("returns the session id", () => {
						const req = getMockReq({
							cookies,
						});

						const sessionId = parseSessionCookie(req);

						expect(sessionId).toEqual(id);
					});
				});
			});
		});
	});
});
