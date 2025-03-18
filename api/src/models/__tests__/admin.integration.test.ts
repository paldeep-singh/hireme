import { faker } from "@faker-js/faker";
import { seedAdmin } from "../../testUtils/dbHelpers.js";
import { AdminErrorCodes, adminModel } from "../admin.js";
import db from "../db.js";
import { expectError, generateAdminData } from "../../testUtils/index.js";

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

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
