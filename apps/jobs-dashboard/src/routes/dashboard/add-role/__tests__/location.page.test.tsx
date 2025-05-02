import { faker } from "@faker-js/faker";
import {
	generateApiCompany,
	generateApiRole,
	generateApiRoleLocation,
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

describe("/dashboard/add-role/location", () => {
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

		it("displays the location field", async () => {
			renderRoute({
				initialUrl: "/dashboard/add-role/location",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Location")).toHaveRole("textbox");
			});
		});

		it("displays the work type checkboxes", async () => {
			renderRoute({
				initialUrl: "/dashboard/add-role/location",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Remote")).toHaveRole("checkbox");
			});

			expect(screen.getByLabelText("Hybrid")).toHaveRole("checkbox");
			expect(screen.getByLabelText("On-site")).toHaveRole("checkbox");
		});

		it("displays all checkboxes unchecked by default", async () => {
			renderRoute({
				initialUrl: "/dashboard/add-role/location",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Remote")).not.toBeChecked();
			});

			expect(screen.getByLabelText("Hybrid")).not.toBeChecked();
			expect(screen.getByLabelText("On-site")).not.toBeChecked();
		});
	});

	describe("Form submission", () => {
		const mockLocation = generateApiRoleLocation(role.id);

		describe("when the add location request is successful", () => {
			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.post("/api/role-location", {
						role_id: role.id,
						location: mockLocation.location,
						remote: mockLocation.remote,
						hybrid: mockLocation.hybrid,
						on_site: mockLocation.on_site,
					})
					.reply(200, mockLocation);
			});

			it("navigates to the contract form on successful submission", async () => {
				const { navigate } = renderRoute({
					initialUrl: "/dashboard/add-role/location",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Location")).toBeVisible();
				});

				await user.type(
					screen.getByLabelText("Location"),
					mockLocation.location,
				);

				if (mockLocation.remote) {
					await user.click(screen.getByLabelText("Remote"));
				}
				if (mockLocation.hybrid) {
					await user.click(screen.getByLabelText("Hybrid"));
				}
				if (mockLocation.on_site) {
					await user.click(screen.getByLabelText("On-site"));
				}

				await user.click(screen.getByText("Next >"));

				await waitFor(() => {
					expect(nock.isDone()).toBe(true);
				});

				expect(navigate).toHaveBeenCalledWith({
					to: "/dashboard/add-role/contract",
				});
			});
		});

		describe("when there is an error adding the location", () => {
			const error = faker.hacker.phrase();

			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.post("/api/role-location", {
						role_id: role.id,
						location: mockLocation.location,
						remote: mockLocation.remote,
						hybrid: mockLocation.hybrid,
						on_site: mockLocation.on_site,
					})
					.reply(500, {
						error,
					});
			});

			it("displays the error", async () => {
				renderRoute({
					initialUrl: "/dashboard/add-role/location",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Location")).toBeVisible();
				});

				await user.type(
					screen.getByLabelText("Location"),
					mockLocation.location,
				);

				if (mockLocation.remote) {
					await user.click(screen.getByLabelText("Remote"));
				}
				if (mockLocation.hybrid) {
					await user.click(screen.getByLabelText("Hybrid"));
				}
				if (mockLocation.on_site) {
					await user.click(screen.getByLabelText("On-site"));
				}

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
