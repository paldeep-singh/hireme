import { userCredentials } from "@repo/shared/types/userCredentials.js";
import { Router } from "express";
import { handleLogin, handleValidateSession } from "../controllers/admin.js";
import { validateRequestBody } from "../middleware/validation.js";

export const adminRouter = Router();

adminRouter.post(
	"/admin/login",
	validateRequestBody(userCredentials),
	handleLogin,
);

adminRouter.get("/admin/session/validate", handleValidateSession);
