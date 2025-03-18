import { faker } from "@faker-js/faker";
import { seedAdmin, seedSession } from "../../testUtils/dbHelpers.js";
import { AdminErrorCodes, adminModel } from "../admin.js";
import db from "../db.js";
import { expectError, generateAdminData } from "../../testUtils/index.js";
import { AdminId } from "shared/generated/db/hire_me/Admin.js";

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
