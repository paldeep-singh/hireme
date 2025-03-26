import { faker } from "@faker-js/faker";
import { UseNavigateResult } from "@tanstack/react-router";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedFunction } from "vitest";
import { renderRoute } from "../../../testUtils";
import { apiFetch } from "../../../utils/apiFetch";

vi.mock("../../../utils/sessionCookies");
vi.mock("../../../utils/apiFetch");

const mockApiFetch = vi.mocked(apiFetch);

afterEach(() => {
	vi.resetAllMocks();
});

describe("/admin/login", () => {
	it("renders the header", () => {
		renderRoute({
			initialUrl: "/admin/login",
		});

		expect(screen.getByText("Admin Login")).toBeVisible();
	});

	it("renders the email input field", () => {
		renderRoute({
			initialUrl: "/admin/login",
		});

		const [emailInput] = screen.getAllByRole("textbox");

		expect(emailInput).toBeVisible();
		expect(emailInput).toHaveAttribute("type", "email");
	});

	it("renders the password input field", () => {
		renderRoute({
			initialUrl: "/admin/login",
		});

		const [, passwordInput] = screen.getAllByRole("textbox");

		expect(passwordInput).toBeVisible();
		expect(passwordInput).toHaveAttribute("type", "password");
	});

	it("renders the submit button", () => {
		renderRoute({
			initialUrl: "/admin/login",
		});

		const button = screen.getByRole("button");

		expect(button).toBeVisible();
		expect(button).toHaveTextContent("Submit");
	});

	describe("when the form is submitted", () => {
		it("submits the request with the provided input", async () => {
			mockApiFetch.mockResolvedValue(undefined);

			renderRoute({
				initialUrl: "/admin/login",
			});

			const email = faker.internet.email();
			const password = faker.internet.password();

			const user = userEvent.setup();

			const [emailInput, passwordInput] = screen.getAllByRole("textbox");

			await user.type(emailInput, email);

			await user.type(passwordInput, password);

			await user.click(screen.getByRole("button"));

			expect(mockApiFetch).toHaveBeenCalledWith({
				path: "/api/admin/login",
				method: "post",
				body: { email, password },
			});
		});

		describe("when a success response is received", () => {
			describe("when the page was visited directly", () => {
				const email = faker.internet.email();
				const password = faker.internet.password();

				let navigate: MockedFunction<UseNavigateResult<string>>;
				beforeEach(async () => {
					const page = renderRoute({
						initialUrl: "/admin/login",
					});

					navigate = page.navigate;

					mockApiFetch.mockResolvedValue(undefined);

					const user = userEvent.setup();

					const [emailInput, passwordInput] = screen.getAllByRole("textbox");

					await user.type(emailInput, email);

					await user.type(passwordInput, password);

					await user.click(screen.getByRole("button"));
				});

				it("navigates to the admin dashboard", () => {
					expect(navigate).toHaveBeenCalledWith({
						from: "/admin/login",
						to: "/admin/dashboard",
					});
				});
			});
		});

		describe("when a error response is received", () => {
			const email = faker.internet.email();
			const password = faker.internet.password();
			const error = faker.lorem.sentence();

			beforeEach(async () => {
				renderRoute({
					initialUrl: "/admin/login",
				});

				mockApiFetch.mockRejectedValue(new Error(error));

				const user = userEvent.setup();

				const [emailInput, passwordInput] = screen.getAllByRole("textbox");

				await user.type(emailInput, email);

				await user.type(passwordInput, password);

				await user.click(screen.getByRole("button"));
			});

			it("displays the error message", () => {
				const errorMessage = screen.getByRole("alert");

				expect(errorMessage).toHaveTextContent(error);
			});
		});
	});

	describe("when an invalid email is entered", () => {
		it("renders invalid email error text", async () => {
			renderRoute({
				initialUrl: "/admin/login",
			});

			const invalidEmail = faker.hacker.noun();
			const user = userEvent.setup();

			const [emailInput] = screen.getAllByRole("textbox");

			await user.type(emailInput, invalidEmail);

			expect(emailInput).toHaveAttribute("aria-invalid", "true");
			expect(emailInput).toHaveAccessibleErrorMessage("Invalid email address.");
		});
	});

	describe("when the user was redirected from a different page", () => {
		const email = faker.internet.email();
		const password = faker.internet.password();

		let navigate: MockedFunction<UseNavigateResult<string>>;

		const otherPageRoute = "/other/page";

		const errorMessage = faker.hacker.phrase();

		beforeEach(() => {
			mockApiFetch.mockResolvedValue(undefined);
		});

		it("displays the error", () => {
			renderRoute({
				initialUrl: "/admin/login/",
				initialSearch: {
					redirect: otherPageRoute,
					error: errorMessage,
				},
			});

			expect(screen.getByRole("alert")).toBeVisible();
			expect(screen.getByRole("alert")).toHaveTextContent(
				`Error: ${errorMessage}`,
			);
		});

		it("navigates to the previous page", async () => {
			const page = renderRoute({
				initialUrl: "/admin/login/",
				initialSearch: {
					redirect: otherPageRoute,
					error: errorMessage,
				},
			});

			navigate = page.navigate;

			const user = userEvent.setup();

			const [emailInput, passwordInput] = screen.getAllByRole("textbox");

			await user.type(emailInput, email);

			await user.type(passwordInput, password);

			await user.click(screen.getByRole("button"));

			expect(navigate).toHaveBeenCalledWith({
				from: "/admin/login",
				to: otherPageRoute,
			});
		});
	});
});
