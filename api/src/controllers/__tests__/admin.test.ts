import { faker } from "@faker-js/faker";
import { AdminErrorCodes, adminModel } from "../../models/admin.js";
import {
  generateAdminData,
  generateAdminSession,
  getMockReq,
  getMockRes,
} from "../../testUtils/index.js";
import { AdminId } from "shared/generated/db/hire_me/Admin.js";
import { handleLogin } from "../admin.js";
import { controllerErrorMessages } from "../errors.js";

vi.mock("../../models/admin");

const mockLogin = vi.mocked(adminModel.login);

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

      it("responds with a 200 status code", async () => {
        await handleLogin(req, res, next);

        expect(res.status).toHaveBeenCalledExactlyOnceWith(200);
      });

      it("responds with the session_token and admin id", async () => {
        await handleLogin(req, res, next);

        expect(res.json).toHaveBeenCalledExactlyOnceWith({
          id,
        });
      });
    });

    describe("when the wrong password is provided", async () => {
      const { email, password_hash } = await generateAdminData();
      const id = faker.number.int({ max: 100 }) as AdminId;

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
