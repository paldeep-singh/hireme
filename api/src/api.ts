import express, { Router } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { companyRouter } from "./routes/company.js";
import { roleRouter } from "./routes/role.js";
import { requirementRouter } from "./routes/requirement.js";
import { adminRouter } from "./routes/admin.js";

dotenv.config();

const router = Router();

router.use(companyRouter);
router.use(roleRouter);
router.use(requirementRouter);
router.use(adminRouter);

const api = express();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use("/api", router);

export default api;
