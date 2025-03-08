import db from "./src/models/db";

export default async function globalTeardown() {
  await db.$pool.end();
}
