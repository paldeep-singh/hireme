import { faker } from "@faker-js/faker";
import {
	generateApiApplicationData,
	generateApiCompany,
	generateApiRole,
	generateApiRoleLocationData,
} from "@repo/api-types/testUtils/generators";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../testUtils";
import { RoleCard } from "../RoleCard";

describe("RoleCard", () => {
	const { name: company, id: companyId } = generateApiCompany();

	const role = generateApiRole(companyId);
	const { location } = generateApiRoleLocationData(role.id);
	const { date_submitted } = generateApiApplicationData(role.id);

	const rolePreview: RolePreview = {
		...role,
		company,
		location,
		date_submitted,
	};

	it("displays the role title", () => {
		renderWithProviders(<RoleCard {...rolePreview} />);

		expect(screen.getByText(role.title)).toBeVisible();
	});

	it("displays the company", () => {
		renderWithProviders(<RoleCard {...rolePreview} />);

		expect(screen.getByText(company)).toBeVisible();
	});

	it("displays the notes", () => {
		renderWithProviders(<RoleCard {...rolePreview} />);

		expect(screen.getByText(role.notes)).toBeVisible();
	});

	it("displays a link to the ad", () => {
		renderWithProviders(<RoleCard {...rolePreview} />);

		const link = screen.queryAllByRole("link")[0];

		expect(link).toHaveTextContent("Ad");
		expect(link).toHaveAttribute("href", role.ad_url);
	});

	it("displays a View details button", () => {
		renderWithProviders(<RoleCard {...rolePreview} />);

		const link = screen.queryAllByRole("link")[1];

		expect(link).toHaveTextContent("View details");
	});

	it("displays the date the role was added to the dashboard", () => {
		renderWithProviders(<RoleCard {...rolePreview} />);

		expect(
			screen.getByText(`Added: ${new Date(role.date_added).toDateString()}`),
		).toBeVisible();
	});

	it('navigates to the role details page when "View details" is clicked', async () => {
		const { router } = renderWithProviders(<RoleCard {...rolePreview} />);

		const user = userEvent.setup();

		await waitFor(async () => {
			user.click(screen.queryAllByRole("link")[1]);

			expect(router.history.location.pathname).toEqual(
				`/dashboard/role/${rolePreview.id}`,
			);
		});
	});

	describe("when the role has been submitted", () => {
		it("displays submitted", () => {
			const submitted_date = faker.date.recent();
			renderWithProviders(
				<RoleCard
					{...rolePreview}
					date_submitted={submitted_date.toISOString()}
				/>,
			);

			expect(
				screen.getByText(`Submitted: ${submitted_date.toDateString()}`),
			).toBeVisible();
		});
	});

	describe("when the role has not been submitted", () => {
		it("displays Not Submitted", () => {
			renderWithProviders(<RoleCard {...rolePreview} date_submitted={null} />);

			expect(screen.getByText("Not Submitted")).toBeVisible();
		});
	});
});
