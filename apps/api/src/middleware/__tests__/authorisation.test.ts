import { faker } from "@faker-js/faker";
import { adminErrorMessages, adminService } from "../../services/admin.service";
import {
	expectThrowsAppError,
	getMockReq,
	getMockRes,
} from "../../testUtils/index";
import { authorisationErrorMessages, authoriseRequest } from "../authorisation";

vi.mock("../../services/admin.service");

const mockValidateSession = vi.mocked(adminService.validateSession);

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
						message: adminErrorMessages.EXPIRED_SESSION,
					});
				});

				it("throws an app error", async () => {
					const req = getMockReq({
						cookies: {
							session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
						},
					});

					const { res, next } = getMockRes();

					expectThrowsAppError(
						async () => authoriseRequest(req, res, next),
						401,
						adminErrorMessages.EXPIRED_SESSION,
						true,
					);
				});
			});

			describe("when the session is invalid", () => {
				beforeEach(() => {
					mockValidateSession.mockResolvedValue({
						valid: false,
						message: adminErrorMessages.INVALID_SESSION,
					});
				});

				it("throws an app error", async () => {
					const req = getMockReq({
						cookies: {
							session: JSON.stringify({ id: faker.string.alphanumeric(20) }),
						},
					});

					const { res, next } = getMockRes();

					expectThrowsAppError(
						async () => authoriseRequest(req, res, next),
						401,
						adminErrorMessages.INVALID_SESSION,
						true,
					);
				});
			});
		});

		describe("when provided session is of the wrong type", () => {
			it("returns throws an app error", async () => {
				const req = getMockReq({
					cookies: { session: 1 },
				});

				const { res, next } = getMockRes();

				expectThrowsAppError(
					() => authoriseRequest(req, res, next),
					400,
					authorisationErrorMessages.BAD_REQUEST,
					true,
				);
			});
		});
	});

	describe("when no session is provided", () => {
		describe("when cookie is undefined", () => {
			it("throws an app error", async () => {
				const req = getMockReq({
					cookies: undefined,
				});

				const { res, next } = getMockRes();

				expectThrowsAppError(
					() => authoriseRequest(req, res, next),
					400,
					authorisationErrorMessages.BAD_REQUEST,
					true,
				);
			});
		});

		describe("when cookie is an empty object", () => {
			it("throws an app error", async () => {
				const req = getMockReq({
					cookies: {},
				});

				const { res, next } = getMockRes();

				expectThrowsAppError(
					() => authoriseRequest(req, res, next),
					400,
					authorisationErrorMessages.BAD_REQUEST,
					true,
				);
			});
		});
	});
});
