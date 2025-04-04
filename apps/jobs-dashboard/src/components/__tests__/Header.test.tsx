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

	describe("when logout button is clicked", () => {
		it("makes logout request", async () => {
			renderWithProviders(<Header />);

			const user = userEvent.setup();

			await user.click(screen.getByRole("button"));

			expect(mockedApiFetch).toHaveBeenCalledWith({
				path: "/api/admin/logout",
				method: "delete",
				body: null,
			});
		});

		it("redirects to the login screen", async () => {
			renderWithProviders(<Header />);

			const user = userEvent.setup();

			await user.click(screen.getByRole("button"));

			expect(mockNavigate).toHaveBeenCalledWith({
				to: "/login",
			});
		});
	});
});
