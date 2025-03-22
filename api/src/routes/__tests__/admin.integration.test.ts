import Admin from "shared/generated/db/hire_me/Admin.js";
import db from "../../models/db.js";
import {
  clearAdminTable,
  clearSessionTable,
  seedAdmin,
  seedAdminSession,
} from "../../testUtils/dbHelpers.js";
import request from "supertest";
import api from "../../api.js";
import Session, { SessionId } from "shared/generated/db/hire_me/Session.js";
import { validationErrorCodes } from "../../middleware/validation.js";

afterAll(async () => {
  await db.$pool.end(); // Close the pool after each test file
});

afterEach(async () => {
  await clearAdminTable();
  await clearSessionTable();
});

describe("POST /api/admin/login", () => {
  describe("when valid body is provided and user exists", () => {
    let admin: Admin & { password: string };

    beforeEach(async () => {
      admin = await seedAdmin();
    });

    it("returns status code 201", async () => {
      const response = await request(api).post("/api/admin/login").send({
        email: admin.email,
        password: admin.password,
      });

      expect(response.status).toEqual(201);
    });

    it("returns the session id", async () => {
      const response = await request(api).post("/api/admin/login").send({
        email: admin.email,
        password: admin.password,
      });

      const { id: fetchedId } = await db.one<{ id: SessionId }>(
        `
            SELECT id
            FROM session
            WHERE admin_id = $1
            `,
        [admin.id],
      );

      expect(response.body.id).toEqual(fetchedId);
    });
  });

  describe("when an invalid body is provided", async () => {
    it("returns status code 400", async () => {
      const response = await request(api).post("/api/admin/login").send({});
      expect(response.status).toEqual(400);
    });

    it("returns an INVALID_DATA error message", async () => {
      const response = await request(api).post("/api/admin/login").send({});
      expect(response.body.error).toEqual(validationErrorCodes.INVALID_DATA);
    });
  });
});

describe("GET /admin/session/validate", () => {
  describe("when a session cookie is provided", () => {
    describe("when the session is valid", () => {
      let session: Session;

      beforeEach(async () => {
        const admin = await seedAdmin();

        session = await seedAdminSession(admin.id);
      });

      it("returns status code 200", async () => {
        const response = await request(api)
          .get("/api/admin/session/validate")
          .set("Cookie", [`session=${session.id}`]);

        expect(response.status).toEqual(200);
      });
    });
  });

  describe("when no session cookie is provided", () => {
    it("returns status code 400", async () => {
      const response = await request(api).get("/api/admin/session/validate");

      expect(response.status).toEqual(400);
    });
  });
});
