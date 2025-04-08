import { adminInitializer } from "@repo/shared/generated/api/hire_me/Admin";
import { Router } from "express";
import {
	handleLogin,
	handleLogout,
	handleValidateSession,
} from "../controllers/admin";
import { validateRequestBody } from "../middleware/validation";

export const adminRouter = Router();

adminRouter.post(
	"/admin/login",
	validateRequestBody(adminInitializer),
	handleLogin,
);

adminRouter.get("/admin/session/validate", handleValidateSession);

adminRouter.delete("/admin/logout", handleLogout);
