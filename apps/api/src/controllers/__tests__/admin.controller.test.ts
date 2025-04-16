import { faker } from "@faker-js/faker";
import { authorisationrErrors } from "../../middleware/authorisation";
import { adminErrorMessages, adminService } from "../../services/admin.service";
import {
	generateAdmin,
	generateAdminSession,
} from "../../testUtils/generators";
import { getMockReq, getMockRes } from "../../testUtils/index";
import {
	handleLogin,
	handleLogout,
	handleValidateSession,
} from "../admin.controller";

vi.mock("../../services/admin.service");

const mockLogin = vi.mocked(adminService.login);
const mockValidateSession = vi.mocked(adminService.validateSession);
const mockClearSession = vi.mocked(adminService.clearSession);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("handleLogin", () => {
	describe("when the user exists", () => {
		describe("when the correct credentials are provided", async () => {
			const { email, id: adminId, password } = await generateAdmin();

			const { id, expiry } = generateAdminSession(adminId);

			beforeEach(() => {
				mockLogin.mockResolvedValue({ id, expiry: expiry.toISOString() });
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
					message: adminErrorMessages.INVALID_SESSION,
				});
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

			it("returns a INVALID_SESSION error message", async () => {
				const req = getMockReq({
					cookies: {
						session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
					},
				});

				const { res, next } = getMockRes();

				await handleValidateSession(req, res, next);

				expect(res.json).toHaveBeenCalledExactlyOnceWith({
					error: adminErrorMessages.INVALID_SESSION,
				});
			});
		});

		describe("when the session is expired", () => {
			beforeEach(() => {
				mockValidateSession.mockResolvedValue({
					valid: false,
					message: adminErrorMessages.EXPIRED_SESSION,
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

			it("returns a EXPIRED_SESSION error message", async () => {
				const req = getMockReq({
					cookies: {
						session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
					},
				});

				const { res, next } = getMockRes();

				await handleValidateSession(req, res, next);

				expect(res.json).toHaveBeenCalledExactlyOnceWith({
					error: adminErrorMessages.EXPIRED_SESSION,
				});
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
});

describe("handleLogout", () => {
	describe("when the request has a session cookie", () => {
		const sessionId = faker.string.uuid();
		const cookies = { session: JSON.stringify({ id: sessionId }) };

		it("deletes the session from the database", async () => {
			const req = getMockReq({ cookies });

			const { res, next } = getMockRes();

			await handleLogout(req, res, next);

			expect(mockClearSession).toHaveBeenCalledExactlyOnceWith(sessionId);
		});

		it("responds with status code 204", async () => {
			const req = getMockReq({ cookies });

			const { res, next } = getMockRes();

			await handleLogout(req, res, next);

			expect(res.status).toHaveBeenCalledExactlyOnceWith(204);
			expect(res.send).toHaveBeenCalledOnce();
		});

		it("clears the session cookie", async () => {
			const req = getMockReq({ cookies });

			const { res, next } = getMockRes();

			await handleLogout(req, res, next);

			expect(res.clearCookie).toHaveBeenCalledExactlyOnceWith("session");
		});
	});

	describe("when no session cookie is provided", () => {
		const cookies = { notSession: "notSession" };

		it("responds with status code 400", async () => {
			const req = getMockReq({ cookies });

			const { res, next } = getMockRes();

			await handleLogout(req, res, next);

			expect(res.status).toHaveBeenCalledExactlyOnceWith(400);
		});

		it("responds with a BAD_REQUEST error", async () => {
			const req = getMockReq({ cookies });

			const { res, next } = getMockRes();

			await handleLogout(req, res, next);

			expect(res.json).toHaveBeenCalledExactlyOnceWith({
				error: authorisationrErrors.BAD_REQUEST,
			});
		});
	});
});
