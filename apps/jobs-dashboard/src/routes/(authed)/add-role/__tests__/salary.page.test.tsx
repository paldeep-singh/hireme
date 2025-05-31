import { faker } from "@faker-js/faker";
import { SalaryInitializer } from "@repo/api-types/generated/api/hire_me/Salary";
import {
	generateApiCompany,
	generateApiRole,
	generateApiSalary,
} from "@repo/api-types/testUtils/generators";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import { useAddRoleContext } from "../../../../forms/contexts/AddRoleContext";
import { renderRoute } from "../../../../testUtils";

const scope = nock(import.meta.env.VITE_API_URL);

vi.mock("../../../../forms/contexts/AddRoleContext");

const mockUseAddRoleContext = vi.mocked(useAddRoleContext);

afterEach(() => {
	vi.clearAllMocks();
	nock.cleanAll();
});

describe("/add-role/salary", () => {
	const company = generateApiCompany();
	const role = generateApiRole(company.id);

	beforeEach(() => {
		mockUseAddRoleContext.mockReturnValue({
			roleId: role.id,
			companyId: role.company_id,
			setCompanyId: vi.fn(),
			setRoleId: vi.fn(),
		});
	});

	describe("Initial render", () => {
		beforeEach(() => {
			scope.persist().get("/api/admin/session/validate").reply(200);
		});

		it("displays the salary range field", async () => {
			renderRoute({
				initialUrl: "/add-role/salary",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Min Salary")).toHaveRole("spinbutton");
			});

			expect(screen.getByLabelText("Max Salary")).toHaveRole("spinbutton");
		});

		it("displays the currency input", async () => {
			renderRoute({
				initialUrl: "/add-role/salary",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Currency")).toHaveRole("textbox");
			});
		});

		it("displays the super field", async () => {
			renderRoute({
				initialUrl: "/add-role/salary",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Includes super?")).toHaveRole("checkbox");
			});
		});

		it("displays the period field", async () => {
			renderRoute({
				initialUrl: "/add-role/salary",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Period")).toHaveRole("combobox");
			});
		});
	});

	describe("form submission", () => {
		const mockSalary = generateApiSalary(role.id, {
			salary_includes_super: true,
		});

		describe("when the add salary request is successful", () => {
			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.post("/api/salary", (body) => {
						const typedBody = body as SalaryInitializer;

						return (
							typedBody.role_id === role.id &&
							typedBody.salary_currency === mockSalary.salary_currency &&
							typedBody.salary_includes_super ===
								mockSalary.salary_includes_super &&
							typedBody.salary_period === mockSalary.salary_period &&
							typedBody.salary_range.min === mockSalary.salary_range.min &&
							typedBody.salary_range.max === mockSalary.salary_range.max
						);
					})
					.reply(200, mockSalary);
			});

			it("navigates to the requirements form on successful submission", async () => {
				const { navigate } = renderRoute({
					initialUrl: "/add-role/salary",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Min Salary")).toBeVisible();
				});

				await user.type(
					screen.getByLabelText("Min Salary"),
					mockSalary.salary_range.min!.toString(),
				);

				await user.type(
					screen.getByLabelText("Max Salary"),
					mockSalary.salary_range.max!.toString(),
				);

				const currencyInput = screen.getByLabelText("Currency");

				await user.type(currencyInput, mockSalary.salary_currency);

				await user.click(screen.getByLabelText("Includes super?"));

				await user.selectOptions(
					screen.getByLabelText("Period"),
					mockSalary.salary_period,
				);

				await user.click(screen.getByText("Next >"));

				await waitFor(() => {
					expect(nock.isDone()).toBe(true);
				});

				expect(navigate).toHaveBeenCalledWith({
					to: "/add-role/requirements",
				});
			});
		});

		describe("when the user skips the form", () => {
			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.post("/api/salary", (body) => {
						const typedBody = body as SalaryInitializer;

						return (
							typedBody.role_id === role.id &&
							typedBody.salary_currency === mockSalary.salary_currency &&
							typedBody.salary_includes_super ===
								mockSalary.salary_includes_super &&
							typedBody.salary_period === mockSalary.salary_period &&
							typedBody.salary_range.min === mockSalary.salary_range.min &&
							typedBody.salary_range.max === mockSalary.salary_range.max
						);
					})
					.reply(200, mockSalary);
			});

			it("navigates to the requirements form", async () => {
				const { navigate } = renderRoute({
					initialUrl: "/add-role/salary",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Min Salary")).toBeVisible();
				});

				await user.click(screen.getByText("Skip"));

				expect(navigate).toHaveBeenCalledWith({
					to: "/add-role/requirements",
				});
			});

			it("does not call the api endpoint", async () => {
				renderRoute({
					initialUrl: "/add-role/salary",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Min Salary")).toBeVisible();
				});

				await user.click(screen.getByText("Skip"));

				expect(nock.isDone()).toBe(false);
			});
		});

		describe("when there is an error adding the salary", () => {
			const error = faker.hacker.phrase();

			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.post("/api/salary")
					.reply(500, {
						error,
					});
			});

			it("displays the error", async () => {
				renderRoute({
					initialUrl: "/add-role/salary",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Min Salary")).toBeVisible();
				});

				await user.type(
					screen.getByLabelText("Min Salary"),
					mockSalary.salary_range.min!.toString(),
				);

				await user.type(
					screen.getByLabelText("Max Salary"),
					mockSalary.salary_range.max!.toString(),
				);

				const currencyInput = screen.getByLabelText("Currency");

				await user.type(currencyInput, mockSalary.salary_currency);

				await user.click(screen.getByLabelText("Includes super?"));

				await user.selectOptions(
					screen.getByLabelText("Period"),
					mockSalary.salary_period,
				);

				await user.click(screen.getByText("Next >"));

				await waitFor(() => {
					expect(screen.getByRole("alert")).toHaveTextContent(
						`Error: ${error}`,
					);
				});

				expect(nock.isDone()).toBe(true);
			});
		});
	});
});
