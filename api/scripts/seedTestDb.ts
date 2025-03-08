import * as dotenv from "dotenv";
import {
  seedCompanies,
  seedRequirement,
  seedRole,
} from "../src/testUtils/dbHelpers";
import { faker } from "@faker-js/faker";

dotenv.config({ path: "./test.env" });

async function seedTestData() {
  const companyIds = (await seedCompanies(5)).map(({ id }) => id);

  const roles = await Promise.all(
    companyIds.map(async (companyId) => {
      const role = await seedRole({
        companyId,
        hasAdUrl: true,
      });

      return role.id;
    }),
  );

  const requirementCounts = roles.map((roleId) => ({
    roleId,
    count: faker.number.int({ min: 5, max: 10 }),
  }));

  await Promise.all(
    requirementCounts.map(async ({ roleId, count }) =>
      Promise.all(
        Array.from({ length: count }).map(() => seedRequirement(roleId)),
      ),
    ),
  );

  console.log("data seeded");
}

seedTestData();
