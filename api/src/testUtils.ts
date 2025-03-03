import db from "./models/db";

export const expectError = (
  maybeError: unknown,
  expectedErrorMessage: string
): void => {
  if (maybeError instanceof Error) {
    return expect(maybeError.message).toContain(expectedErrorMessage);
  } else {
    throw new Error(`Expected error, got ${maybeError}`);
  }
};

export const clearAllTables = async () => {
  try {
    // Step 1: Retrieve all table names from the 'public' schema
    const tables = await db.any(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'hire_me' -- Adjust if needed for another schema
        `);

    // Step 2: Generate the TRUNCATE command for each table
    const truncateQueries = tables.map(
      (table) => `TRUNCATE TABLE "${table.tablename}" CASCADE`
    );

    // Step 3: Execute all TRUNCATE commands in a single transaction
    await db.tx(async (t) => {
      for (const query of truncateQueries) {
        await t.none(query); // Execute each truncate command
      }
    });
  } catch (error) {
    console.error("Error truncating tables:", error);
  }
};
