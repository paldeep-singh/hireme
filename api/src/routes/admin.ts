import { Router } from "express";
import { validateRequestBody } from "../middleware/validation.js";
import { userCredentials } from "shared/types/userCredentials.js";
import { handleLogin, handleValidateSession } from "../controllers/admin.js";

export const adminRouter = Router();

adminRouter.post(
  "/admin/login",
  validateRequestBody(userCredentials),
  handleLogin,
);

adminRouter.get("/admin/session/validate", handleValidateSession);
