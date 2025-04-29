import { faker } from "@faker-js/faker";
import { generateApiCompany } from "@repo/api-types/testUtils/generators";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAddRoleContext } from "../../../../forms/contexts/AddRoleContext";
import { renderRoute } from "../../../../testUtils";
import { apiFetch } from "../../../../utils/apiFetch";

// import { useAddRoleContext } from "../../contexts/AddRoleContext";

vi.mock("../../../../utils/apiFetch");
vi.mock("../../../../forms/contexts/AddRoleContext");

// Then import after mocking

const mockApiFetch = vi.mocked(apiFetch);
const mockUseAddRoleContext = vi.mocked(useAddRoleContext);

afterEach(() => {
	vi.clearAllMocks();
});

describe("/dashboard/add-role/company", () => {
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
			mockApiFetch.mockResolvedValue(mockCompanies);
		});

		it("displays the company name combobox", async () => {
			renderRoute({
				initialUrl: "/dashboard/add-role/company",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Company name")).toHaveRole("combobox");
			});
		});

		it("displays existing companies as options in the company name combobox", async () => {
			renderRoute({
				initialUrl: "/dashboard/add-role/company",
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
				initialUrl: "/dashboard/add-role/company",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Company website")).toHaveRole("textbox");
			});
		});

		it("displays the notes field", async () => {
			renderRoute({
				initialUrl: "/dashboard/add-role/company",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Notes")).toHaveRole("textbox");
			});
		});
	});

	describe("when selecting an existing company", () => {
		beforeEach(() => {
			mockApiFetch.mockResolvedValue(mockCompanies);
		});

		it("does not show additional fields", async () => {
			renderRoute({
				initialUrl: "/dashboard/add-role/company",
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
				initialUrl: "/dashboard/add-role/company",
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
				to: "/dashboard/add-role/role",
			});
		});
	});

	describe("when entering a new company", () => {
		const newCompany = generateApiCompany();

		beforeEach(() => {
			mockApiFetch.mockImplementation(({ path }) => {
				if (path.includes("/api/companies")) {
					return Promise.resolve(mockCompanies);
				}

				return Promise.resolve(newCompany);
			});
		});

		it("shows additional fields", async () => {
			renderRoute({
				initialUrl: "/dashboard/add-role/company",
			});

			const user = userEvent.setup();

			await waitFor(() => {
				expect(screen.getByLabelText("Company name")).toBeVisible();
			});

			const newCompanyName = faker.company.name();
			await user.type(screen.getByLabelText("Company name"), newCompanyName);

			expect(screen.getByLabelText("Company website")).toBeVisible();
			expect(screen.getByLabelText("Notes")).toBeVisible();
		});

		it("sets the companyId navigates to the role form", async () => {
			const { navigate } = renderRoute({
				initialUrl: "/dashboard/add-role/company",
			});

			const user = userEvent.setup();

			await waitFor(() => {
				expect(screen.getByLabelText("Company name")).toBeVisible();
			});

			await user.type(screen.getByLabelText("Company name"), newCompany.name);

			await user.type(screen.getByLabelText("Notes"), newCompany.notes);
			await user.click(screen.getByText("Next >"));
			expect(mockSetCompanyId).toHaveBeenCalledWith(newCompany.id);

			expect(navigate).toHaveBeenCalledWith({
				to: "/dashboard/add-role/role",
			});
		});
	});
});
