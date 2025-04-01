import { faker } from "@faker-js/faker";
import { SessionId } from "@repo/shared/generated/db/hire_me/Session.js";
import {
	generateAdmin,
	generateAdminSession,
} from "@repo/shared/testHelpers/generators.js";
import { authorisationrErrors } from "../../middleware/authorisation.js";
import { AdminErrorCodes, adminModel } from "../../models/admin.js";
import { getMockReq, getMockRes } from "../../testUtils/index.js";
import { handleLogin, handleValidateSession } from "../admin.js";
import { controllerErrorMessages } from "../errors.js";

vi.mock("../../models/admin");

const mockLogin = vi.mocked(adminModel.login);
const mockValidateSession = vi.mocked(adminModel.validateSession);
const mockClearSession = vi.mocked(adminModel.clearSession);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("handleLogin", () => {
	describe("when the user exists", () => {
		describe("when the correct credentials are provided", async () => {
			const { email, id: adminId, password } = await generateAdmin();

			const { id, expiry } = generateAdminSession(adminId);

			beforeEach(() => {
				mockLogin.mockResolvedValue({ id, expiry });
			});

			it("responds with a 204 status code", async () => {
				const req = getMockReq({
					body: {
						email,
						password,
					},
				});

				const { res, next } = getMockRes();

				await handleLogin(req, res, next);

				expect(res.status).toHaveBeenCalledExactlyOnceWith(204);
			});

			it("sets the session cookie", async () => {
				const req = getMockReq({
					body: {
						email,
						password,
					},
				});

				const { res, next } = getMockRes();

				await handleLogin(req, res, next);

				expect(res.cookie).toHaveBeenCalledExactlyOnceWith(
					"session",
					JSON.stringify({ id }),
					{
						domain: "localhost",
						path: "/api",
						expires: expiry,
					},
				);
			});
		});

		describe("when the wrong password is provided", async () => {
			const { email } = await generateAdmin();

			const req = getMockReq({
				body: {
					email,
					password: faker.internet.password(),
				},
			});

			const { res, next } = getMockRes();

			beforeEach(() => {
				mockLogin.mockRejectedValue(new Error(AdminErrorCodes.INVALID_USER));
			});

			it("responds with a 401 status code", async () => {
				await handleLogin(req, res, next);

				expect(res.status).toHaveBeenCalledExactlyOnceWith(401);
			});

			it("responds with an invalid credentials error mesage", async () => {
				await handleLogin(req, res, next);

				expect(res.json).toHaveBeenCalledExactlyOnceWith({
					error: controllerErrorMessages.INVALID_CREDENTIALS,
				});
			});
		});
	});

	describe("when the user does not exist", async () => {
		const req = getMockReq({
			body: {
				email: faker.internet.email,
				password: faker.internet.password(),
			},
		});

		const { res, next } = getMockRes();

		beforeEach(() => {
			mockLogin.mockRejectedValue(new Error(AdminErrorCodes.INVALID_USER));
		});

		it("responds with a 401 status code", async () => {
			await handleLogin(req, res, next);

			expect(res.status).toHaveBeenCalledExactlyOnceWith(401);
		});

		it("responds with an invalid credentials error", async () => {
			await handleLogin(req, res, next);

			expect(res.json).toHaveBeenCalledExactlyOnceWith({
				error: controllerErrorMessages.INVALID_CREDENTIALS,
			});
		});
	});

	describe("when an unknown error occurs", () => {
		const req = getMockReq({
			body: {
				email: faker.internet.email,
				password: faker.internet.password(),
			},
		});

		const { res, next } = getMockRes();

		const error = faker.hacker.phrase();

		beforeEach(() => {
			mockLogin.mockRejectedValue(new Error(error));
		});

		it("responds with a 500 status code", async () => {
			await handleLogin(req, res, next);

			expect(res.status).toHaveBeenCalledExactlyOnceWith(500);
		});

		it("responds with an unknown error", async () => {
			await handleLogin(req, res, next);

			expect(res.json).toHaveBeenCalledExactlyOnceWith({
				error: `${controllerErrorMessages.UNKNOWN_ERROR}: ${error}`,
			});
		});
	});
});

describe("handleValidateSession", () => {
	describe("when a session is provided", () => {
		describe("when the session is valid", () => {
			beforeEach(() => {
				mockValidateSession.mockResolvedValue({ valid: true });
			});

			it("returns a 200 status code", async () => {
				const req = getMockReq({
					cookies: {
						session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
					},
				});

				const { res, next } = getMockRes();

				await handleValidateSession(req, res, next);

				expect(res.status).toHaveBeenCalledWith(200);
			});
		});

		describe("when the session is invalid", () => {
			beforeEach(() => {
				mockValidateSession.mockResolvedValue({
					valid: false,
					code: AdminErrorCodes.INVALID_SESSION,
				});

				mockClearSession.mockResolvedValue();
			});

			it("returns a 401 status code", async () => {
				const req = getMockReq({
					cookies: {
						session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
					},
				});
				const { res, next } = getMockRes();

				await handleValidateSession(req, res, next);

				expect(res.status).toHaveBeenCalledWith(401);
			});

			it("returns a UNAUTHORISED_INVALID error message", async () => {
				const req = getMockReq({
					cookies: {
						session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
					},
				});

				const { res, next } = getMockRes();

				await handleValidateSession(req, res, next);

				expect(res.json).toHaveBeenCalledExactlyOnceWith({
					error: authorisationrErrors.UNAUTHORISED_INVALID,
				});
			});

			it("clears the session", async () => {
				const sessionId = faker.string.alphanumeric(20) as SessionId;
				const req = getMockReq({
					cookies: {
						session: JSON.stringify({ id: sessionId }),
					},
				});

				const { res, next } = getMockRes();

				await handleValidateSession(req, res, next);

				expect(mockClearSession).toHaveBeenCalledWith(sessionId);
			});
		});

		describe("when the session is expired", () => {
			beforeEach(() => {
				mockValidateSession.mockResolvedValue({
					valid: false,
					code: AdminErrorCodes.EXPIRED_SESSION,
				});

				mockClearSession.mockResolvedValue();
			});

			it("returns a 401 status code", async () => {
				const req = getMockReq({
					cookies: {
						session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
					},
				});
				const { res, next } = getMockRes();

				await handleValidateSession(req, res, next);

				expect(res.status).toHaveBeenCalledWith(401);
			});

			it("returns a UNAUTHORISED_EXPIRED error message", async () => {
				const req = getMockReq({
					cookies: {
						session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
					},
				});

				const { res, next } = getMockRes();

				await handleValidateSession(req, res, next);

				expect(res.json).toHaveBeenCalledExactlyOnceWith({
					error: authorisationrErrors.UNAUTHORISED_EXPIRED,
				});
			});

			it("clears the session", async () => {
				const sessionId = faker.string.alphanumeric(20) as SessionId;
				const req = getMockReq({
					cookies: {
						session: JSON.stringify({ id: sessionId }),
					},
				});

				const { res, next } = getMockRes();

				await handleValidateSession(req, res, next);

				expect(mockClearSession).toHaveBeenCalledWith(sessionId);
			});
		});
	});

	describe("when no session is provided", () => {
		it("returns a 400 status code", async () => {
			const req = getMockReq({
				cookies: undefined,
			});

			const { res, next } = getMockRes();

			await handleValidateSession(req, res, next);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("returns a  BAD_REQUEST ERROR", async () => {
			const req = getMockReq({
				cookies: undefined,
			});

			const { res, next } = getMockRes();

			await handleValidateSession(req, res, next);

			expect(res.json).toHaveBeenCalledExactlyOnceWith({
				error: authorisationrErrors.BAD_REQUEST,
			});
		});
	});

	describe("when an error is encountered while validating the session", () => {
		const errorMessage = faker.lorem.sentence();

		beforeEach(() => {
			mockValidateSession.mockRejectedValue(new Error(errorMessage));
		});

		it("returns status code 500", async () => {
			const req = getMockReq({
				cookies: {
					session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
				},
			});

			const { res, next } = getMockRes();

			await handleValidateSession(req, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
		});

		it("returns the error message", async () => {
			const req = getMockReq({
				cookies: {
					session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
				},
			});

			const { res, next } = getMockRes();

			await handleValidateSession(req, res, next);

			expect(res.json).toHaveBeenCalledWith({
				error: errorMessage,
			});
		});
	});
});
