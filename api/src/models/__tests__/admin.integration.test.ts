import { faker } from "@faker-js/faker";
import { seedAdmin, seedSession } from "../../testUtils/dbHelpers.js";
import { AdminErrorCodes, adminModel, AdminSession } from "../admin.js";
import db from "../db.js";
import {
  expectError,
  generateAdminData,
  generateAdminSession,
} from "../../testUtils/index.js";
import Admin, {
  admin,
  adminId,
  AdminId,
} from "shared/generated/db/hire_me/Admin.js";

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

afterEach(async () => {});

describe("getAdminDetails", () => {
  describe("when the admin exists", () => {
    it("returns the admin details", async () => {
      const { password: _, ...adminDetails } = await seedAdmin();

      const fetchedAdminDetails = await adminModel.getAdminDetails(
        adminDetails.email,
      );

      expect(fetchedAdminDetails).toEqual(adminDetails);
    });
  });

  describe("when the admin does not exist", () => {
    it("throws an INVALID_USER error", async () => {
      try {
        await adminModel.getAdminDetails(faker.internet.email());
      } catch (error) {
        expectError(error, AdminErrorCodes.INVALID_USER);
      }
    });
  });

  describe("when multiple admins with the same email exist", () => {
    it("throws an INVALID_USER error", async () => {
      const { email } = await generateAdminData();
      await seedAdmin(email);
      await seedAdmin(email);

      try {
        await adminModel.getAdminDetails(email);
      } catch (error) {
        expectError(error, AdminErrorCodes.MULTIPLE_USERS);
      }
    });
  });
});

describe("getAdminSession", () => {
  describe("when the admin exists", () => {
    it("returns the session details", async () => {
      const admin = await seedAdmin();

      const { session_token: _, ...sessionData } = await seedSession(admin.id);

      const fetchedSession = await adminModel.getAdminSession(sessionData.id);

      expect(fetchedSession).toEqual(sessionData);
    });
  });

  describe("when the admin does not exist", () => {
    it("throws an INVALID_USER error", async () => {
      try {
        await adminModel.getAdminSession(
          faker.number.int({ max: 100 }) as AdminId,
        );
      } catch (error) {
        expectError(error, AdminErrorCodes.INVALID_USER);
      }
    });
  });
});

describe("clearAdminSession", () => {
  describe("when the admin exists", () => {
    it("sets session_token_hash and session_expiry to NULL", async () => {
      const admin = await seedAdmin();
      await seedSession(admin.id);

      await adminModel.clearAdminSession(admin.id);

      const sessionData = await db.one<
        Pick<AdminSession, "session_expiry" | "session_token_hash">
      >(
        `SELECT session_token_hash, session_expiry 
         FROM admin
         WHERE id = $1`,
        [admin.id],
      );

      expect(sessionData.session_expiry).toBeNull();
      expect(sessionData.session_token_hash).toBeNull();
    });
  });

  describe("when the admin does not exist", () => {
    it("throws a INVALID_USER error", async () => {
      try {
        await adminModel.clearAdminSession(
          faker.number.int({ max: 100 }) as AdminId,
        );
      } catch (error) {
        expectError(error, AdminErrorCodes.INVALID_USER);
      }
    });
  });
});

describe("updateAdminSession", () => {
  describe("when the admin exists", () => {
    let id: AdminId;
    beforeEach(async () => {
      id = (await seedAdmin()).id;
    });

    it("updates the session", async () => {
      const { session_token_hash, session_expiry } =
        await generateAdminSession();

      await adminModel.updateAdminSession({
        id,
        session_token_hash,
        session_expiry,
      });

      const fetchedSession = await db.one<
        Pick<AdminSession, "session_expiry" | "session_token_hash">
      >(
        `SELECT session_token_hash, session_expiry 
         FROM admin
         WHERE id = $1`,
        [id],
      );

      expect(fetchedSession.session_expiry?.valueOf()).toEqual(
        session_expiry?.valueOf(),
      );
      expect(fetchedSession.session_token_hash).toEqual(session_token_hash);
    });

    it("returns the updated session", async () => {
      const { session_token_hash, session_expiry } =
        await generateAdminSession();

      const updatedSession = await adminModel.updateAdminSession({
        id,
        session_token_hash,
        session_expiry,
      });

      expect(updatedSession.session_expiry?.valueOf()).toEqual(
        session_expiry?.valueOf(),
      );
      expect(updatedSession.session_token_hash).toEqual(session_token_hash);
    });
  });

  describe("when the admin does not exist", () => {
    it("throws a INVALID_USER error", async () => {
      try {
        const id = faker.number.int({ max: 100 }) as AdminId;

        const { session_token_hash, session_expiry } =
          await generateAdminSession();

        await adminModel.updateAdminSession({
          id,
          session_expiry,
          session_token_hash,
        });
      } catch (error) {
        expectError(error, AdminErrorCodes.INVALID_USER);
      }
    });
  });
});
