import app from "./index";
import request from "supertest";

describe("POST /company", () => {
  it("should create a new company", async () => {
    const response = await request(app)
      .post("/company")
      .send({ name: "Company 1" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Company created" });
  });
});
