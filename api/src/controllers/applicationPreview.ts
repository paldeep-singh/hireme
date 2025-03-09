import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  ApplicationPreview,
  applicationPreviewModel,
} from "../models/applicationPreview";
import { RequestHandler } from "./sharedTypes";

export const handleGetApplicationPreviews: RequestHandler<
  ApplicationPreview[]
> = async (_, res) => {
  try {
    const appPreviews = await applicationPreviewModel.getApplicationPreviews();

    res.status(StatusCodes.OK);
    res.json(appPreviews);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
      return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
