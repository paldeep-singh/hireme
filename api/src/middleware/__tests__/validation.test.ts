import { faker } from "@faker-js/faker";
import { getMockReq, getMockRes } from "vitest-mock-express";
import { z } from "zod";
import { validateRequestBody } from "../validation.js";

describe("validateRequestBody", () => {
  const testSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  describe("when the request body is valid", () => {
    it("calls next", () => {
      const req = getMockReq({
        body: {
          id: faker.number.int({ max: 100 }),
          name: faker.person.fullName(),
        },
      });

      const { res, next } = getMockRes();

      const validator = validateRequestBody(testSchema);

      validator(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("when the request body is invalid", () => {
    it("returns a 400 status code", () => {
      const req = getMockReq({
        body: {
          id: faker.person.firstName(),
          name: faker.number.int({ max: 100 }),
        },
      });

      const { res, next } = getMockRes();

      const validator = validateRequestBody(testSchema);

      validator(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns an INVALID_DATA error message", () => {
      const req = getMockReq({
        body: {
          id: faker.person.firstName(),
          name: faker.number.int({ max: 100 }),
        },
      });

      const { res, next } = getMockRes();

      const validator = validateRequestBody(testSchema);

      validator(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid data",
        details: [
          { message: "id is Expected number, received string" },
          { message: "name is Expected string, received number" },
        ],
      });
    });
  });
});
