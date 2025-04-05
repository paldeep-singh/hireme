import { redirect } from "@tanstack/react-router";
import { waitFor } from "@testing-library/react";
import { renderRoute } from "../../testUtils";
import { validateSession } from "../../utils/validateSession";

vi.mock("../../utils/apiFetch");
vi.mock("../../utils/validateSession");

const mockValidateSession = vi.mocked(validateSession);

vi.mock(import("@tanstack/react-router"), async (importOriginal) => {
	const actual = await importOriginal();

	return {
		...actual,
		redirect: vi.fn(),
	};
});

afterEach(() => {
	vi.resetAllMocks();
});

describe("/", () => {
	describe("when user session is valid", () => {
		it("redirects user to the roles dashboard", async () => {
			mockValidateSession.mockResolvedValue({
				valid: true,
			});

			renderRoute({
				initialUrl: "/",
			});

			await waitFor(() => {
				expect(redirect).toHaveBeenCalledWith({
					from: "/",
					to: "/dashboard/roles",
				});
			});
		});
	});

	describe("when user session is invalid", () => {
		it("redirects the user to the login screen", async () => {
			mockValidateSession.mockResolvedValue({
				valid: false,
				error: "test",
			});

			renderRoute({
				initialUrl: "/",
			});

			await waitFor(() => {
				expect(redirect).toHaveBeenCalledWith({
					from: "/",
					to: "/login",
				});
			});
		});
	});
});
