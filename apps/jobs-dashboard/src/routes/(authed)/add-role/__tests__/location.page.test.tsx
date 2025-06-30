import { faker } from "@faker-js/faker";
import {
	generateApiCompany,
	generateApiRole,
	generateApiRoleLocation,
} from "@repo/api-types/testUtils/generators";
import { RoleLocationInput } from "@repo/api-types/validators/RoleLocation";
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

describe("/add-role/location", () => {
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
				initialUrl: "/add-role/location",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Location")).toHaveRole("textbox");
			});
		});

		it("displays the work type checkboxes", async () => {
			renderRoute({
				initialUrl: "/add-role/location",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Remote")).toHaveRole("checkbox");
			});

			expect(screen.getByLabelText("Hybrid")).toHaveRole("checkbox");
			expect(screen.getByLabelText("On-site")).toHaveRole("checkbox");
		});

		it("displays all checkboxes unchecked by default", async () => {
			renderRoute({
				initialUrl: "/add-role/location",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Remote")).not.toBeChecked();
			});

			expect(screen.getByLabelText("Hybrid")).not.toBeChecked();
			expect(screen.getByLabelText("On-site")).not.toBeChecked();
		});

		it("renders the office days input fields", async () => {
			renderRoute({
				initialUrl: "/add-role/location",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Max Office days")).toHaveRole(
					"spinbutton",
				);
			});

			expect(screen.getByLabelText("Min Office days")).toHaveRole("spinbutton");
		});
	});

	describe("Form submission", () => {
		const mockLocation = generateApiRoleLocation(role.id, {
			hybrid: true,
			remote: true,
			on_site: true,
			office_days: {
				max: 3,
				min: 1,
			},
		});

		describe("when the add location request is successful", () => {
			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.post(`/api/role/${role.id}/location`, (body) => {
						const typedBody = body as RoleLocationInput;

						return (
							typedBody.location === mockLocation.location &&
							typedBody.remote === mockLocation.remote &&
							typedBody.hybrid === mockLocation.hybrid &&
							typedBody.on_site === mockLocation.on_site &&
							typedBody.office_days?.min === mockLocation.office_days?.min &&
							typedBody.office_days?.max === mockLocation.office_days?.max
						);
					})
					.reply(200, mockLocation);
			});

			it("navigates to the salary form on successful submission", async () => {
				const { navigate } = renderRoute({
					initialUrl: "/add-role/location",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Location")).toBeVisible();
				});

				await user.type(
					screen.getByLabelText("Location"),
					mockLocation.location,
				);

				await user.click(screen.getByLabelText("Remote"));

				await user.click(screen.getByLabelText("Hybrid"));

				await user.click(screen.getByLabelText("On-site"));

				await user.type(
					screen.getByLabelText("Min Office days"),
					mockLocation.office_days.min!.toString(),
				);

				await user.type(
					screen.getByLabelText("Max Office days"),
					mockLocation.office_days.max!.toString(),
				);

				await user.click(screen.getByLabelText("Max Office days"));

				await user.click(screen.getByText("Next >"));

				await waitFor(() => {
					expect(nock.isDone()).toBe(true);
				});

				expect(navigate).toHaveBeenCalledWith({
					to: "/add-role/salary",
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
					.post(`/api/role/${role.id}/location`)
					.reply(500, {
						error,
					});
			});

			it("displays the error", async () => {
				renderRoute({
					initialUrl: "/add-role/location",
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
