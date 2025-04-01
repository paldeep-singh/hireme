import { userCredentials } from "@repo/shared/types/userCredentials";
import { Router } from "express";
import { handleLogin, handleValidateSession } from "../controllers/admin";
import { validateRequestBody } from "../middleware/validation";

export const adminRouter = Router();

adminRouter.post(
	"/admin/login",
	validateRequestBody(userCredentials),
	handleLogin,
);

adminRouter.get("/admin/session/validate", handleValidateSession);
