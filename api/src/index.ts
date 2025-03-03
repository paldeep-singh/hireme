import express, { Request, Response } from "express";
import dotenv from "dotenv";
import db from "./models/db";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (_: Request, res: Response) => {
  try {
    const users = await db.any("SELECT * FROM companies");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/company", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    await db.none(
      "INSERT INTO hire_me.companies (id, name) VALUES (gen_random_uuid(), $1)",
      [name]
    );
    res.status(201).json({ message: "Company created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
