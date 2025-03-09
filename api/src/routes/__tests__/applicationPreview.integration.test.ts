import { ApplicationPreview } from "../../models/applicationPreview";
import db from "../../models/db";
import {
  clearCompanyTable,
  clearRoleTable,
  seedApplications,
} from "../../testUtils/dbHelpers";
import request from "supertest";
import api from "../../api";

afterAll(async () => {
  await db.$pool.end();
});

describe("GET /api/applicationPreviews", () => {
  let appPreviews: ApplicationPreview[];

  beforeEach(async () => {
    appPreviews = await seedApplications(3);
  });

  afterEach(async () => {
    await clearRoleTable();
    await clearCompanyTable();
  });

  it("returns statusCode 200", async () => {
    const response = await request(api).get("/api/applicationPreviews");

    expect(response.status).toBe(200);
  });

  it("returns an array of application previews", async () => {
    const response = await request(api).get("/api/applicationPreviews");

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(appPreviews.length);
    expect(response.body).toIncludeSameMembers(appPreviews);
  });
});
