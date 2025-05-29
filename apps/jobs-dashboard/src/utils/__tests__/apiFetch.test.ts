import nock from "nock";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../apiFetch";

const API_URL = "http://api.example.com";

const scope = nock(API_URL);

describe("apiFetch", () => {
	beforeEach(() => {
		// Mock the environment variable
		vi.stubEnv("VITE_API_URL", API_URL);
		nock.cleanAll();
	});

	it("should successfully fetch JSON data", async () => {
		const mockResponse = { data: "test" };

		scope
			.post("/api/company")
			.reply(200, mockResponse, { "Content-Type": "application/json" });

		const result = await apiFetch({
			path: "/api/company",
			method: "post",
			body: { name: "Test Company" },
			params: null,
		});

		expect(scope.isDone()).toBe(true);
		expect(result).toEqual(mockResponse);
	});

	it("should handle requests without body", async () => {
		const mockResponse = { data: "test" };

		scope
			.get("/api/companies")
			.reply(200, mockResponse, { "Content-Type": "application/json" });

		const result = await apiFetch({
			path: "/api/companies",
			method: "get",
			body: null,
			params: null,
		});

		expect(scope.isDone()).toBe(true);
		expect(result).toEqual(mockResponse);
	});

	it("should handle error responses", async () => {
		const errorMessage = "Invalid request";

		scope
			.post("/api/company")
			.reply(
				400,
				{ error: errorMessage },
				{ "Content-Type": "application/json" },
			);

		await expect(
			apiFetch({
				path: "/api/company",
				method: "post",
				body: { name: "Test Company" },
				params: null,
			}),
		).rejects.toThrow(errorMessage);

		expect(scope.isDone()).toBe(true);
	});

	it("should handle non-JSON responses", async () => {
		scope
			.get("/api/companies")
			.reply(200, undefined, { "Content-Type": "text/plain" });

		await expect(
			apiFetch({
				path: "/api/companies",
				method: "get",
				body: null,
				params: null,
			}),
		).resolves.not.toThrow();

		expect(scope.isDone()).toBe(true);
	});

	it("should handle network errors", async () => {
		scope.get("/api/companies").replyWithError("Network error");

		await expect(
			apiFetch({
				path: "/api/companies",
				method: "get",
				body: null,
				params: null,
			}),
		).rejects.toThrow();

		expect(scope.isDone()).toBe(true);
	});
});
