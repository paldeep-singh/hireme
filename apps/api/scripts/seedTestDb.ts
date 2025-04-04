import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import db from "../src/models/db";
import {
	seedApplication,
	seedCompanies,
	seedRequirement,
	seedRole,
	seedRoleLocation,
} from "../src/testUtils/dbHelpers";

dotenv.config({ path: "./test.env" });

async function seedTestData() {
	const companyIds = (await seedCompanies(5)).map(({ id }) => id);

	const roles = await Promise.all(
		companyIds.map(async (companyId) => {
			const role = await seedRole(companyId);

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

	await Promise.all(
		roles.map(async (roleId) => {
			await seedRoleLocation(roleId);
			await seedApplication(roleId);
		}),
	);

	// Seed Admin user data

	if (!process.env.EMAIL) {
		throw new Error("Email env must be provided");
	}

	if (!process.env.PASSWORD) {
		throw new Error("Password env must be provided");
	}
	const hashedPassword = await bcrypt.hash(process.env.PASSWORD, 10);

	await db.none(`INSERT INTO admin (email, password_hash) VALUES ($1, $2)`, [
		process.env.EMAIL,
		hashedPassword,
	]);

	console.log("data seeded");

	process.exit(0);
}

await seedTestData();
