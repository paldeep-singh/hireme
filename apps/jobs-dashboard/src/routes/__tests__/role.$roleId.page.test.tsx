import {
	generateApiApplication,
	generateApiCompany,
	generateApiContract,
	generateApiRequirement,
	generateApiRole,
	generateApiRoleLocation,
} from "@repo/api-types/testUtils/generators";
import { screen, waitFor } from "@testing-library/react";
import { renderRoute } from "../../testUtils";
import { apiFetch } from "../../utils/apiFetch";

vi.mock("../../utils/apiFetch");

const mockApiFetch = vi.mocked(apiFetch);

vi.mock(import("@tanstack/react-router"), async (importOriginal) => {
	const actual = await importOriginal();

	return {
		...actual,
		redirect: vi.fn(),
	};
});

describe("/dashboard/role/$roleId", () => {
	const company = generateApiCompany();
	const role = generateApiRole(company.id);
	const location = generateApiRoleLocation(role.id);
	const application = generateApiApplication(role.id);
	const requirements = Array.from({ length: 5 }).map(() =>
		generateApiRequirement(role.id),
	);
	const contract = generateApiContract(role.id);

	const roleDetails = {
		...role,
		company,
		location,
		requirements,
		application,
		contract,
	};

	beforeEach(() => {
		mockApiFetch.mockResolvedValue(roleDetails);
	});

	it("displays the role title", async () => {
		renderRoute({
			initialUrl: `/dashboard/role/${role.id}`,
		});

		await waitFor(() => {
			expect(screen.getByText(role.title)).toBeVisible();
		});
	});

	it("displays the date added", async () => {
		renderRoute({
			initialUrl: `/dashboard/role/${role.id}`,
		});

		await waitFor(() => {
			expect(
				screen.getByText(
					(_, element) =>
						element?.textContent ===
						`Added: ${new Date(role.date_added).toLocaleDateString()}`,
				),
			).toBeVisible();
		});
	});

	it("displays the ad URL when present", async () => {
		renderRoute({
			initialUrl: `/dashboard/role/${role.id}`,
		});

		await waitFor(() => {
			expect(screen.getByText(role.ad_url)).toBeVisible();
		});

		expect(screen.getByText(role.ad_url)).toHaveAttribute("href", role.ad_url);
		expect(screen.getByText(role.ad_url)).toHaveAttribute("target", "_blank");
		expect(screen.getByText(role.ad_url)).toHaveAttribute(
			"rel",
			"noopener noreferrer",
		);
	});

	it("displays the role notes", async () => {
		renderRoute({
			initialUrl: `/dashboard/role/${role.id}`,
		});

		await waitFor(() => {
			expect(screen.getByText(role.notes)).toBeVisible();
		});
	});

	describe("Company section", () => {
		it("displays the company name", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				expect(screen.getByText(company.name)).toBeVisible();
			});
		});

		it("displays the company website when present", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				expect(screen.getByText(roleDetails.company.website)).toBeVisible();
			});

			expect(screen.getByText(roleDetails.company.website)).toBeVisible();
			expect(screen.getByText(roleDetails.company.website)).toHaveAttribute(
				"href",
				roleDetails.company.website,
			);
			expect(screen.getByText(roleDetails.company.website)).toHaveAttribute(
				"target",
				"_blank",
			);
			expect(screen.getByText(roleDetails.company.website)).toHaveAttribute(
				"rel",
				"noopener noreferrer",
			);
		});

		it("displays the company notes", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				expect(screen.getByText(roleDetails.company.notes)).toBeVisible();
			});
		});
	});

	describe("Location section", () => {
		it("displays the location", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				expect(screen.getByText(location.location)).toBeVisible();
			});
		});

		it("displays remote status", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				expect(
					screen.getByText(
						(_, element) =>
							element?.textContent ===
							`Remote: ${location.remote ? "Yes" : "No"}`,
					),
				).toBeVisible();
			});
		});

		it("displays on-site status", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				expect(
					screen.getByText(
						(_, element) =>
							element?.textContent ===
							`On Site: ${location.on_site ? "Yes" : "No"}`,
					),
				).toBeVisible();
			});
		});

		it("displays hybrid status", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				expect(
					screen.getByText(
						(_, element) =>
							element?.textContent ===
							`Hybrid: ${location.hybrid ? "Yes" : "No"}`,
					),
				).toBeVisible();
			});
		});

		it("displays office days when present", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				expect(
					screen.getByText(
						(_, element) =>
							element?.textContent ===
							`Office Days: ${location.office_days.min} - ${location.office_days.max}`,
					),
				).toBeVisible();
			});
		});
	});

	describe("Requirements section", () => {
		it("displays all requirements", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				roleDetails.requirements.forEach((req) => {
					expect(screen.getByText(req.description)).toBeVisible();
				});
			});
		});
	});

	describe("Application section", () => {
		it("displays the submission date when present", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				expect(
					screen.getByText(
						(_, element) =>
							element?.textContent ===
							`Date Submitted: ${new Date(application.date_submitted).toLocaleDateString()}`,
					),
				).toBeVisible();
			});
		});

		it("displays the cover letter", async () => {
			renderRoute({
				initialUrl: `/dashboard/role/${role.id}`,
			});

			await waitFor(() => {
				expect(screen.getByText(application.cover_letter)).toBeVisible();
			});
		});
	});
});
