import request from "supertest";
import api from "../../api";
import { APP_ERROR_MESSAGE } from "../../routes/test-errors.route";

describe("when the handler throws an app error", () => {
	it("responds with the error status code", async () => {
		const response = await request(api).get("/api/error/app");

		expect(response.status).toBe(502);
	});

	it("responds with the error message", async () => {
		const response = await request(api).get("/api/error/app");
		expect(response.body).toEqual({ error: APP_ERROR_MESSAGE });
	});
});

describe("when the handler throws a regular Error", () => {
	it("responds with the error status code", async () => {
		const response = await request(api).get("/api/error/unexpected");

		expect(response.status).toBe(500);
	});

	it("responds with the error message: internal server error", async () => {
		const response = await request(api).get("/api/error/unexpected");
		expect(response.body).toEqual({ error: "Internal server error" });
	});
});
