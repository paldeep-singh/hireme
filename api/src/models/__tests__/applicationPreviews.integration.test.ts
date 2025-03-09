import { seedCompanies, seedRole } from "../../testUtils/dbHelpers";
import { applicationPreviewModel } from "../applicationPreview";
import db from "../db";

afterAll(async () => {
  await db.$pool.end();
});

describe("getApplicationPreviews", () => {
  it("returns a list of application previews", async () => {
    const companies = await seedCompanies(3);
    const roles = await Promise.all(
      companies.map(({ id }) => seedRole({ companyId: id, hasAdUrl: true })),
    );

    const appPreviews = roles.map(({ id, ...rest }, index) => ({
      role_id: id,
      ...rest,
      company: companies[index].name,
    }));

    const fetchedPreviews =
      await applicationPreviewModel.getApplicationPreviews();

    expect(fetchedPreviews).toBeArrayOfSize(appPreviews.length);
    expect(fetchedPreviews).toIncludeSameMembers(appPreviews);
  });
});
