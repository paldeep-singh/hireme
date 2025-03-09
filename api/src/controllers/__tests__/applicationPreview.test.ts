import { getMockReq, getMockRes } from "@jest-mock/express";
import { applicationPreviewModel } from "../../models/applicationPreview";
import { generateApplicationPreview } from "../../testUtils";
import { handleGetApplicationPreviews } from "../applicationPreview";

jest.mock("../../models/applicationPreview");

const mockGetApplicationPreviews = jest.mocked(
  applicationPreviewModel.getApplicationPreviews,
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("handleGetApplicationPreviews", () => {
  describe("when application previews are successfully fetched", () => {
    const appPreviews = Array.from({ length: 3 }).map(() =>
      generateApplicationPreview(),
    );

    beforeEach(() => {
      mockGetApplicationPreviews.mockResolvedValue(appPreviews);
    });

    it("returns a 200 status code", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();
      await handleGetApplicationPreviews(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("returns the companies", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();
      await handleGetApplicationPreviews(req, res, next);

      expect(res.json).toHaveBeenCalledWith(appPreviews);
    });
  });

  describe("when there is an error fetching the previews", () => {
    const errorMessage = "Database query failed";
    const error = new Error(errorMessage);

    beforeEach(() => {
      mockGetApplicationPreviews.mockRejectedValue(error);
    });

    it("returns a 500 status code", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();
      await handleGetApplicationPreviews(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("returns the error message", async () => {
      const req = getMockReq();
      const { res, next } = getMockRes();
      await handleGetApplicationPreviews(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });
  });
});
