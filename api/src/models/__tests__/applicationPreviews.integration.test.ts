import { seedApplications } from "../../testUtils/dbHelpers";
import { applicationPreviewModel } from "../applicationPreview";
import db from "../db";

afterAll(async () => {
  await db.$pool.end();
});

describe("getApplicationPreviews", () => {
  it("returns a list of application previews", async () => {
    const appPreviews = await seedApplications(3);

    const fetchedPreviews =
      await applicationPreviewModel.getApplicationPreviews();

    expect(fetchedPreviews).toBeArrayOfSize(appPreviews.length);
    expect(fetchedPreviews).toIncludeSameMembers(appPreviews);
  });
});
