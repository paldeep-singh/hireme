import db from "./src/models/db";

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});
