import { faker } from "@faker-js/faker";
import { generateApiCompany } from "@repo/api-types/testUtils/generators";
import { screen, waitFor, within } from "@testing-library/react";
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

describe("/add-role/company", () => {
	const mockSetCompanyId = vi.fn();

	const mockCompanies = Array.from({ length: 3 }).map(() =>
		generateApiCompany(),
	);

	beforeEach(() => {
		mockUseAddRoleContext.mockReturnValue({
			companyId: null,
			roleId: null,
			setCompanyId: mockSetCompanyId,
			setRoleId: vi.fn(),
		});
	});

	describe("Initial render", () => {
		beforeEach(() => {
			scope
				.persist()
				.get("/api/admin/session/validate")
				.reply(200)
				.get("/api/companies")
				.reply(200, mockCompanies);
		});

		it("displays the company name combobox", async () => {
			renderRoute({
				initialUrl: "/add-role/company",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Company name")).toHaveRole("combobox");
			});
		});

		it("displays existing companies as options in the company name combobox", async () => {
			renderRoute({
				initialUrl: "/add-role/company",
			});

			const user = userEvent.setup();

			await waitFor(() => {
				expect(screen.getByLabelText("Company name")).toBeVisible();
			});

			// To reveal optionslist in dom tree
			await user.click(screen.getByLabelText("Company name"));

			const list = screen.getByTestId("combo-box-list");

			const options = within(list).getAllByRole("option", { hidden: true });

			expect(options).toHaveLength(mockCompanies.length);
			mockCompanies.forEach((company) => {
				expect(
					options.some((opt) => opt.getAttribute("value") === company.name),
				).toBe(true);
			});
		});

		it("displays the company website field", async () => {
			renderRoute({
				initialUrl: "/add-role/company",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Company website")).toHaveRole("textbox");
			});
		});

		it("displays the notes field", async () => {
			renderRoute({
				initialUrl: "/add-role/company",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Notes")).toHaveRole("textbox");
			});
		});
	});

	describe("when selecting an existing company", () => {
		beforeEach(() => {
			scope
				.persist()
				.get("/api/admin/session/validate")
				.reply(200)
				.get("/api/companies")
				.reply(200, mockCompanies);
		});

		it("does not show additional fields", async () => {
			renderRoute({
				initialUrl: "/add-role/company",
			});

			const user = userEvent.setup();

			await waitFor(() => {
				expect(screen.getByLabelText("Company name")).toBeVisible();
			});

			await user.type(
				screen.getByLabelText("Company name"),
				mockCompanies[0].name,
			);

			expect(
				screen.queryByLabelText("Company website"),
			).not.toBeInTheDocument();
			expect(screen.queryByLabelText("Notes")).not.toBeInTheDocument();
		});

		it("navigates to the role form when submitted", async () => {
			const { navigate } = renderRoute({
				initialUrl: "/add-role/company",
			});

			const user = userEvent.setup();

			await waitFor(() => {
				expect(screen.getByLabelText("Company name")).toBeVisible();
			});

			await user.type(
				screen.getByLabelText("Company name"),
				mockCompanies[0].name,
			);

			await user.click(screen.getByText("Next >"));

			expect(navigate).toHaveBeenCalledWith({
				to: "/add-role/role",
			});
		});
	});

	describe("when entering a new company", () => {
		const newCompany = generateApiCompany();

		describe("when the nput name does not match any existing companies", () => {
			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.get("/api/companies")
					.reply(200, mockCompanies);
			});

			it("shows additional fields", async () => {
				renderRoute({
					initialUrl: "/add-role/company",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Company name")).toBeVisible();
				});

				await user.type(screen.getByLabelText("Company name"), newCompany.name);

				expect(screen.getByLabelText("Company website")).toBeVisible();
				expect(screen.getByLabelText("Notes")).toBeVisible();
			});
		});

		describe("when the add company request is successful", () => {
			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.get("/api/companies")
					.reply(200, mockCompanies)
					.post("/api/company", {
						name: newCompany.name,
						website: newCompany.website,
						notes: newCompany.notes,
					})
					.reply(200, newCompany);
			});

			it("sets the companyId and navigates to the role form", async () => {
				const { navigate } = renderRoute({
					initialUrl: "/add-role/company",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Company name")).toBeVisible();
				});

				await user.type(screen.getByLabelText("Company name"), newCompany.name);
				await user.type(
					screen.getByLabelText("Company website"),
					newCompany.website,
				);

				await user.type(screen.getByLabelText("Notes"), newCompany.notes);

				await user.click(screen.getByText("Next >"));

				await waitFor(() => {
					expect(nock.isDone()).toBe(true);
				});

				expect(mockSetCompanyId).toHaveBeenCalledWith(newCompany.id);

				expect(navigate).toHaveBeenCalledWith({
					to: "/add-role/role",
				});
			});
		});

		describe("when there is an error adding the company", () => {
			const error = faker.hacker.phrase();

			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.get("/api/companies")
					.reply(200, mockCompanies)
					.post("/api/company", {
						name: newCompany.name,
						website: newCompany.website,
						notes: newCompany.notes,
					})
					.reply(500, {
						error,
					});
			});

			it("displays the error", async () => {
				renderRoute({
					initialUrl: "/add-role/company",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Company name")).toBeVisible();
				});

				await user.type(screen.getByLabelText("Company name"), newCompany.name);
				await user.type(
					screen.getByLabelText("Company website"),
					newCompany.website,
				);

				await user.type(screen.getByLabelText("Notes"), newCompany.notes);

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
