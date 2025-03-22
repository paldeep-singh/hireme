import { faker } from "@faker-js/faker";
import { AdminErrorCodes, adminModel } from "../../models/admin.js";
import {
  generateAdminData,
  generateAdminSession,
  getMockReq,
  getMockRes,
} from "../../testUtils/index.js";
import { AdminId } from "shared/generated/db/hire_me/Admin.js";
import { handleLogin, handleValidateSession } from "../admin.js";
import { controllerErrorMessages } from "../errors.js";
import { authorisationrErrors } from "../../middleware/authorisation.js";

vi.mock("../../models/admin");

const mockLogin = vi.mocked(adminModel.login);
const mockValidateSession = vi.mocked(adminModel.validateSession);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("handleLogin", () => {
  describe("when the user exists", () => {
    describe("when the correct credentials are provided", async () => {
      const { email, password } = await generateAdminData();
      const adminId = faker.number.int({ max: 100 }) as AdminId;

      const { id } = await generateAdminSession(adminId);

      const req = getMockReq({
        body: {
          email,
          password,
        },
      });

      const { res, next } = getMockRes();

      beforeEach(() => {
        mockLogin.mockResolvedValue(id);
      });

      it("responds with a 201 status code", async () => {
        await handleLogin(req, res, next);

        expect(res.status).toHaveBeenCalledExactlyOnceWith(201);
      });

      it("responds with the session_token and admin id", async () => {
        await handleLogin(req, res, next);

        expect(res.json).toHaveBeenCalledExactlyOnceWith({
          id,
        });
      });
    });

    describe("when the wrong password is provided", async () => {
      const { email } = await generateAdminData();

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

    beforeEach(() => {
      mockLogin.mockRejectedValue(new Error(faker.hacker.phrase()));
    });

    it("responds with a 500 status code", async () => {
      await handleLogin(req, res, next);

      expect(res.status).toHaveBeenCalledExactlyOnceWith(500);
    });

    it("responds with an unknown error", async () => {
      await handleLogin(req, res, next);

      expect(res.json).toHaveBeenCalledExactlyOnceWith({
        error: controllerErrorMessages.UNKNOWN_ERROR,
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
            session: faker.string.alphanumeric(),
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
      });

      it("returns a 401 status code", async () => {
        const req = getMockReq({
          cookies: {
            session: faker.string.alphanumeric(),
          },
        });
        const { res, next } = getMockRes();

        await handleValidateSession(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
      });

      it("returns a UNAUTHORISED_INVALID error message", async () => {
        const req = getMockReq({
          cookies: {
            session: faker.string.alphanumeric(),
          },
        });

        const { res, next } = getMockRes();

        await handleValidateSession(req, res, next);

        expect(res.json).toHaveBeenCalledExactlyOnceWith({
          error: authorisationrErrors.UNAUTHORISED_INVALID,
        });
      });
    });

    describe("when the session is expired", () => {
      beforeEach(() => {
        mockValidateSession.mockResolvedValue({
          valid: false,
          code: AdminErrorCodes.EXPIRED_SESSION,
        });
      });

      it("returns a 401 status code", async () => {
        const req = getMockReq({
          cookies: {
            session: faker.string.alphanumeric(),
          },
        });
        const { res, next } = getMockRes();

        await handleValidateSession(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
      });

      it("returns a UNAUTHORISED_EXPIRED error message", async () => {
        const req = getMockReq({
          cookies: {
            session: faker.string.alphanumeric(),
          },
        });

        const { res, next } = getMockRes();

        await handleValidateSession(req, res, next);

        expect(res.json).toHaveBeenCalledExactlyOnceWith({
          error: authorisationrErrors.UNAUTHORISED_EXPIRED,
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

  describe("when an error is encountered while validating the session", () => {
    const errorMessage = faker.lorem.sentence();

    beforeEach(() => {
      mockValidateSession.mockRejectedValue(new Error(errorMessage));
    });

    it("returns status code 500", async () => {
      const req = getMockReq({
        cookies: {
          session: faker.string.alphanumeric(),
        },
      });

      const { res, next } = getMockRes();

      await handleValidateSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("returns the error message", async () => {
      const req = getMockReq({
        cookies: {
          session: faker.string.alphanumeric(),
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
