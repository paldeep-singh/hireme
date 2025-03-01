import express, { Request, Response } from "express";
import dotenv from "dotenv";
import db from "./db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (_: Request, res: Response) => {
  try {
    const users = await db.any("SELECT COUNT(*) FROM hire_me.roles");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
