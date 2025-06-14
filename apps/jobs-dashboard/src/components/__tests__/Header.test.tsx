import * as tanstackRouter from "@tanstack/react-router";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../testUtils";
import { apiFetch } from "../../utils/apiFetch";
import { Header } from "../Header";

vi.mock("../../utils/apiFetch");

const mockNavigate = vi.fn();

vi.spyOn(tanstackRouter, "useNavigate").mockImplementation(() => mockNavigate);

vi.mock(import("@tanstack/react-router"), async (importOriginal) => {
	const actual = await importOriginal();

	return {
		...actual,
		useNavigate: () => vi.fn(),
	};
});

const mockedApiFetch = vi.mocked(apiFetch);

describe("Header", () => {
	it("renders the website title", () => {
		renderWithProviders(<Header />);

		expect(screen.getByRole("banner")).toHaveTextContent("Jobs Dashboard");
	});

	it("renders the logout button", () => {
		renderWithProviders(<Header />);

		expect(screen.getByRole("button")).toHaveTextContent("Logout");
	});

	it("Redirects to the dashboard when the website title is clicked", async () => {
		const { router } = renderWithProviders(<Header />);

		const user = userEvent.setup();

		await user.click(screen.getByRole("link"));

		expect(router.history.location.pathname).toEqual("/roles");
	});

	describe("when logout button is clicked", () => {
		it("makes logout request", async () => {
			renderWithProviders(<Header />);

			const user = userEvent.setup();

			await user.click(screen.getByRole("button"));

			expect(mockedApiFetch).toHaveBeenCalledWith({
				path: "/api/admin/logout",
				method: "delete",
				body: null,
				params: null,
			});
		});

		it("redirects to the login screen with logout success message", async () => {
			renderWithProviders(<Header />);

			const user = userEvent.setup();

			await user.click(screen.getByRole("button"));

			expect(mockNavigate).toHaveBeenCalledWith({
				to: "/login",
				search: {
					notification: "You have been successfully logged out.",
				},
			});
		});
	});
});
