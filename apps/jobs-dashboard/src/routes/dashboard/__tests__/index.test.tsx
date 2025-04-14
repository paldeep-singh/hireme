import { redirect } from "@tanstack/react-router";
import { waitFor } from "@testing-library/react";
import { renderRoute } from "../../../testUtils";

vi.mock(import("@tanstack/react-router"), async (importOriginal) => {
	const actual = await importOriginal();

	return {
		...actual,
		redirect: vi.fn(),
	};
});

describe("/dashboard", () => {
	it("redirects to the roles dashboard", async () => {
		renderRoute({
			initialUrl: "/dashboard",
		});

		await waitFor(() => {
			expect(redirect).toHaveBeenCalledWith({
				to: "/dashboard/roles",
			});
		});
	});
});
