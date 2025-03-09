import { Router } from "express";
import { handleGetApplicationPreviews } from "../controllers/applicationPreview";

export const applicationPreviewRouter = Router();

applicationPreviewRouter.get(
  "/applicationPreviews",
  handleGetApplicationPreviews,
);
