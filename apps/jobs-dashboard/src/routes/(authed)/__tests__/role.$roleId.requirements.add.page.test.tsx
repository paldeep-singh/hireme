import { faker } from "@faker-js/faker";
import {
	generateApiCompany,
	generateApiRequirement,
	generateApiRole,
} from "@repo/api-types/testUtils/generators";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import { renderRoute } from "../../../testUtils";

const scope = nock(import.meta.env.VITE_API_URL);

afterEach(() => {
	vi.clearAllMocks();
	nock.cleanAll();
});

describe("/role/$roleId/requirements/add", () => {
	const company = generateApiCompany();
	const role = generateApiRole(company.id);

	describe("Initial render", () => {
		beforeEach(() => {
			scope.persist().get("/api/admin/session/validate").reply(200);
		});

		it("displays the Add Requirement button", async () => {
			renderRoute({
				initialUrl: `/role/${role.id}/requirements/add`,
			});

			await waitFor(() => {
				expect(
					screen.getByRole("button", { name: "Add Requirement +" }),
				).toBeVisible();
			});
		});

		it("displays the submit button", async () => {
			renderRoute({
				initialUrl: `/role/${role.id}/requirements/add`,
			});

			await waitFor(() => {
				expect(screen.getByRole("button", { name: "Submit" })).toBeVisible();
			});
		});
	});

	describe("Adding and removing requirements", () => {
		const mockRequirements = Array.from({ length: 3 }).map(() =>
			generateApiRequirement(role.id),
		);

		beforeEach(() => {
			scope.persist().get("/api/admin/session/validate").reply(200);
		});

		it("adds input fields when the Add Requirement button is pressed", async () => {
			renderRoute({
				initialUrl: `/role/${role.id}/requirements/add`,
			});

			await waitFor(() => {
				expect(
					screen.getByRole("button", { name: "Add Requirement +" }),
				).toBeVisible();
			});

			const user = userEvent.setup();

			const addRoleButton = screen.getByRole("button", {
				name: "Add Requirement +",
			});

			await user.click(addRoleButton);

			expect(
				screen.getByRole("textbox", { name: "Requirement 1" }),
			).toBeVisible();

			expect(screen.getAllByRole("checkbox")).toHaveLength(1);
			expect(screen.getAllByRole("button", { name: "X" })).toHaveLength(1);

			await user.click(addRoleButton);

			expect(
				screen.getByRole("textbox", { name: "Requirement 2" }),
			).toBeVisible();

			expect(screen.getAllByRole("checkbox")).toHaveLength(2);
			expect(screen.getAllByRole("button", { name: "X" })).toHaveLength(2);
		});

		it("removes input fields if the x button next to them is pressed", async () => {
			renderRoute({
				initialUrl: `/role/${role.id}/requirements/add`,
			});

			await waitFor(() => {
				expect(
					screen.getByRole("button", { name: "Add Requirement +" }),
				).toBeVisible();
			});

			const user = userEvent.setup();

			const addRequirementButton = screen.getByRole("button", {
				name: "Add Requirement +",
			});

			for (const [index, req] of mockRequirements.entries()) {
				await user.click(addRequirementButton);

				await waitFor(() => {
					expect(
						screen.getByRole("textbox", {
							name: `Requirement ${index + 1}`,
						}),
					).toBeVisible();
				});

				await user.type(
					screen.getByRole("textbox", {
						name: `Requirement ${index + 1}`,
					}),
					req.description,
				);

				if (req.bonus) {
					await user.click(screen.getAllByRole("checkbox")[index]);
				}
			}

			// Remove the middle (2nd) requirement
			await user.click(screen.getAllByRole("button", { name: "X" })[1]);

			// Ensure first requirement still exists with inputted text
			expect(
				screen.getByRole("textbox", { name: "Requirement 1" }),
			).toHaveTextContent(mockRequirements[0].description);

			// Ensure 3rd requirement is now 2nd requirement
			expect(
				screen.getByRole("textbox", { name: "Requirement 2" }),
			).toHaveTextContent(mockRequirements[2].description);

			// Expect the correct number of checkboxes and delete buttons to be visible
			expect(screen.getAllByRole("checkbox")).toHaveLength(2);
			expect(screen.getAllByRole("button", { name: "X" })).toHaveLength(2);
		});
	});

	describe("Form submission", () => {
		const mockRequirements = Array.from({ length: 5 }).map(() =>
			generateApiRequirement(role.id),
		);

		const mockRequirementsInput = mockRequirements.map(
			({ id: _, role_id: __, ...rest }) => rest,
		);

		describe("when the requirements are successfully added", () => {
			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.post(`/api/role/${role.id}/requirements`, mockRequirementsInput)
					.reply(200, mockRequirements);
			});

			it("navigates to the role page on successful submission", async () => {
				const { navigate } = renderRoute({
					initialUrl: `/role/${role.id}/requirements/add`,
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(
						screen.getByRole("button", { name: "Add Requirement +" }),
					).toBeVisible();
				});

				const addRequirementButton = screen.getByRole("button", {
					name: "Add Requirement +",
				});

				for (const [index, req] of mockRequirementsInput.entries()) {
					await user.click(addRequirementButton);

					await waitFor(() => {
						expect(
							screen.getByRole("textbox", {
								name: `Requirement ${index + 1}`,
							}),
						).toBeVisible();
					});

					await user.type(
						screen.getByRole("textbox", {
							name: `Requirement ${index + 1}`,
						}),
						req.description,
					);

					if (req.bonus) {
						await user.click(screen.getAllByRole("checkbox")[index]);
					}
				}

				await user.click(screen.getByRole("button", { name: "Submit" }));

				await waitFor(() => {
					expect(nock.isDone()).toBe(true);
				});

				expect(navigate).toHaveBeenCalledWith({
					to: `/role/${role.id}`,
				});
			});
		});

		describe("when the user tries to submit without adding any requirements", () => {
			beforeEach(() => {
				scope.persist().get("/api/admin/session/validate").reply(200);
			});

			it("displays an error", async () => {
				renderRoute({
					initialUrl: `/role/${role.id}/requirements/add`,
				});

				await waitFor(() => {
					expect(screen.getByRole("button", { name: "Submit" })).toBeVisible();
				});

				const user = userEvent.setup();

				await user.click(screen.getByRole("button", { name: "Submit" }));

				expect(screen.getByRole("alert")).toHaveTextContent(
					"Error: Must have at least 1 requirement.",
				);
			});
		});

		describe("when there is an error adding the requirements", () => {
			const error = faker.hacker.phrase();

			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.post(`/api/role/${role.id}/requirements`, [
						{
							description: mockRequirementsInput[0].description,
							bonus: false,
						},
					])
					.reply(500, { error });
			});

			it("displays the error", async () => {
				renderRoute({
					initialUrl: `/role/${role.id}/requirements/add`,
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(
						screen.getByRole("button", { name: "Add Requirement +" }),
					).toBeVisible();
				});

				await user.click(
					screen.getByRole("button", { name: "Add Requirement +" }),
				);

				await waitFor(() => {
					expect(
						screen.getByRole("textbox", {
							name: `Requirement 1`,
						}),
					).toBeVisible();
				});

				await user.type(
					screen.getByRole("textbox", {
						name: `Requirement 1`,
					}),
					mockRequirementsInput[0].description,
				);

				await user.click(screen.getByRole("button", { name: "Submit" }));

				await waitFor(() => {
					expect(screen.getByRole("alert")).toHaveTextContent(
						`Error: ${error}`,
					);
				});
			});
		});
	});
});
