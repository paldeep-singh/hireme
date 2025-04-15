import { faker } from "@faker-js/faker";
import { AdminErrorCodes, adminModel } from "../../services/admin.service";
import { getMockReq, getMockRes } from "../../testUtils/index";
import { authorisationrErrors, authoriseRequest } from "../authorisation";

vi.mock("../../models/admin");

const mockValidateSession = vi.mocked(adminModel.validateSession);

describe("authoriseRequestequest", () => {
	describe("when a session is provided", () => {
		describe("when the session is valid", () => {
			beforeEach(() => {
				mockValidateSession.mockResolvedValue({ valid: true });
			});

			it("calls next", async () => {
				const req = getMockReq({
					cookies: {
						session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
					},
				});

				const { res, next } = getMockRes();

				await authoriseRequest(req, res, next);

				expect(next).toHaveBeenCalled();
			});
		});

		describe("when the session is not valid", () => {
			describe("when the session is expired", () => {
				beforeEach(() => {
					mockValidateSession.mockResolvedValue({
						valid: false,
						code: AdminErrorCodes.EXPIRED_SESSION,
					});
				});

				it("returns status code 401", async () => {
					const req = getMockReq({
						cookies: {
							session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
						},
					});

					const { res, next } = getMockRes();

					await authoriseRequest(req, res, next);

					expect(res.status).toHaveBeenCalledExactlyOnceWith(401);
				});

				it("returns an UNAUTHORISED_EXPIRED message", async () => {
					const req = getMockReq({
						cookies: {
							session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
						},
					});

					const { res, next } = getMockRes();

					await authoriseRequest(req, res, next);

					expect(res.json).toHaveBeenCalledExactlyOnceWith({
						error: authorisationrErrors.UNAUTHORISED_EXPIRED,
					});
				});
			});

			describe("when the session is invalid", () => {
				beforeEach(() => {
					mockValidateSession.mockResolvedValue({
						valid: false,
						code: AdminErrorCodes.INVALID_SESSION,
					});
				});

				it("returns status code 401", async () => {
					const req = getMockReq({
						cookies: {
							session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
						},
					});

					const { res, next } = getMockRes();

					await authoriseRequest(req, res, next);

					expect(res.status).toHaveBeenCalledExactlyOnceWith(401);
				});

				it("returns an UNAUTHORISED_INVALID message", async () => {
					const req = getMockReq({
						cookies: {
							session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
						},
					});

					const { res, next } = getMockRes();

					await authoriseRequest(req, res, next);

					expect(res.json).toHaveBeenCalledExactlyOnceWith({
						error: authorisationrErrors.UNAUTHORISED_INVALID,
					});
				});
			});
		});

		describe("when provided session is of the wrong type", () => {
			it("returns status code 400", async () => {
				const req = getMockReq({
					cookies: { session: 1 },
				});

				const { res, next } = getMockRes();

				await authoriseRequest(req, res, next);

				expect(res.status).toHaveBeenCalledExactlyOnceWith(400);
			});

			it("retursn a BAD_REQUEST message", async () => {
				const req = getMockReq({
					cookies: { session: 1 },
				});

				const { res, next } = getMockRes();

				await authoriseRequest(req, res, next);

				expect(res.json).toHaveBeenCalledExactlyOnceWith({
					error: authorisationrErrors.BAD_REQUEST,
				});
			});
		});
	});

	describe("when no session is provided", () => {
		describe("when cookie is undefined", () => {
			it("returns status code 400", async () => {
				const req = getMockReq({
					cookies: undefined,
				});

				const { res, next } = getMockRes();

				await authoriseRequest(req, res, next);

				expect(res.status).toHaveBeenCalledExactlyOnceWith(400);
			});

			it("retursn a BAD_REQUEST message", async () => {
				const req = getMockReq({
					cookies: undefined,
				});

				const { res, next } = getMockRes();

				await authoriseRequest(req, res, next);

				expect(res.json).toHaveBeenCalledExactlyOnceWith({
					error: authorisationrErrors.BAD_REQUEST,
				});
			});
		});

		describe("when cookie is an empty object", () => {
			it("returns status code 400", async () => {
				const req = getMockReq({
					cookies: {},
				});

				const { res, next } = getMockRes();

				await authoriseRequest(req, res, next);

				expect(res.status).toHaveBeenCalledExactlyOnceWith(400);
			});

			it("retursn a BAD_REQUEST message", async () => {
				const req = getMockReq({
					cookies: {},
				});

				const { res, next } = getMockRes();

				await authoriseRequest(req, res, next);

				expect(res.json).toHaveBeenCalledExactlyOnceWith({
					error: authorisationrErrors.BAD_REQUEST,
				});
			});
		});
	});
});
