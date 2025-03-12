import express, { Router } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { companyRouter } from "./routes/company";
import { roleRouter } from "./routes/role";
import { requirementRouter } from "./routes/requirement";

dotenv.config();

const router = Router();

router.use(companyRouter);
router.use(roleRouter);
router.use(requirementRouter);

const api = express();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use("/api", router);

export default api;
