import { faker } from "@faker-js/faker";
import { redirect } from "@tanstack/react-router";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRoute } from "../../../testUtils";
import { apiFetch } from "../../../utils/apiFetch";
import { validateSession } from "../../../utils/validateSession";

vi.mock("../../../utils/sessionCookies");
vi.mock("../../../utils/apiFetch");
vi.mock("../../../utils/validateSession");

const mockApiFetch = vi.mocked(apiFetch);
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

describe("/admin/login", () => {
	describe("when the user is not logged in", () => {
		beforeEach(() => {
			mockValidateSession.mockResolvedValue({
				valid: false,
				error: "test",
			});
		});

		it("renders the header", async () => {
			renderRoute({
				initialUrl: "/admin/login",
			});

			await waitFor(() => {
				expect(screen.getByText("Admin Login")).toBeVisible();
			});
		});

		it("renders the email input field", async () => {
			renderRoute({
				initialUrl: "/admin/login",
			});

			await waitFor(() => {
				const [emailInput] = screen.getAllByRole("textbox");
				expect(emailInput).toHaveAttribute("type", "email");
			});
		});

		it("renders the password input field", async () => {
			renderRoute({
				initialUrl: "/admin/login",
			});

			await waitFor(() => {
				const [, passwordInput] = screen.getAllByRole("textbox");
				expect(passwordInput).toHaveAttribute("type", "password");
			});
		});

		it("renders the submit button", async () => {
			renderRoute({
				initialUrl: "/admin/login",
			});

			await waitFor(() => {
				const button = screen.getByRole("button");
				expect(button).toHaveTextContent("Submit");
			});
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

				await waitFor(() => {
					expect(screen.getByText("Admin Login")).toBeVisible();
				});

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

					beforeEach(() => {
						mockApiFetch.mockResolvedValue(undefined);
					});

					it("navigates to the admin dashboard", async () => {
						const { navigate } = renderRoute({
							initialUrl: "/admin/login",
						});

						const user = userEvent.setup();

						await waitFor(() => {
							expect(screen.getByText("Admin Login")).toBeVisible();
						});

						const [emailInput, passwordInput] = screen.getAllByRole("textbox");

						await user.type(emailInput, email);

						await user.type(passwordInput, password);

						await user.click(screen.getByRole("button"));

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

				beforeEach(() => {
					mockApiFetch.mockRejectedValue(new Error(error));
				});

				it("displays the error message", async () => {
					renderRoute({
						initialUrl: "/admin/login",
					});

					const user = userEvent.setup();

					await waitFor(() => {
						expect(screen.getByText("Admin Login")).toBeVisible();
					});

					const [emailInput, passwordInput] = screen.getAllByRole("textbox");

					await user.type(emailInput, email);

					await user.type(passwordInput, password);

					await user.click(screen.getByRole("button"));

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

				await waitFor(() => {
					expect(screen.getByText("Admin Login")).toBeVisible();
				});

				const [emailInput] = screen.getAllByRole("textbox");

				await user.type(emailInput, invalidEmail);

				expect(emailInput).toHaveAttribute("aria-invalid", "true");
				expect(emailInput).toHaveAccessibleErrorMessage(
					"Invalid email address.",
				);
			});
		});

		describe("when the user was redirected from a different page", () => {
			const email = faker.internet.email();
			const password = faker.internet.password();

			const otherPageRoute = "/other/page";

			const errorMessage = faker.hacker.phrase();

			beforeEach(() => {
				mockApiFetch.mockResolvedValue(undefined);
			});

			it("displays the error", async () => {
				renderRoute({
					initialUrl: "/admin/login/",
					initialSearch: {
						redirect: otherPageRoute,
						error: errorMessage,
					},
				});

				await waitFor(() => {
					expect(screen.getByText("Admin Login")).toBeVisible();
				});

				expect(screen.getByRole("alert")).toBeVisible();
				expect(screen.getByRole("alert")).toHaveTextContent(
					`Error: ${errorMessage}`,
				);
			});

			it("navigates to the previous page", async () => {
				const { navigate } = renderRoute({
					initialUrl: "/admin/login/",
					initialSearch: {
						redirect: otherPageRoute,
						error: errorMessage,
					},
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByText("Admin Login")).toBeVisible();
				});

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

	describe("when the user is already logged in", () => {
		beforeEach(() => {
			mockValidateSession.mockResolvedValue({ valid: true });
		});

		it("redirects to the admin dashboard", async () => {
			renderRoute({
				initialUrl: "/admin/login",
			});

			await waitFor(() => {
				expect(redirect).toHaveBeenCalledWith({
					from: "/admin/login",
					to: "/admin/dashboard",
				});
			});
		});
	});
});
