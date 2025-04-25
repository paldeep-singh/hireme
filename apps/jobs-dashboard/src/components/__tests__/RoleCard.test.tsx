import { faker } from "@faker-js/faker";
import {
	generateApiApplicationData,
	generateApiCompany,
	generateApiRole,
	generateApiRoleLocationData,
} from "@repo/api-types/testUtils/generators";
import { RolePreview } from "@repo/api-types/types/api/RolePreview";
import { render, screen } from "@testing-library/react";
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
		render(<RoleCard {...rolePreview} />);

		expect(screen.getByText(role.title)).toBeVisible();
	});

	it("displays the company", () => {
		render(<RoleCard {...rolePreview} />);

		expect(screen.getByText(company)).toBeVisible();
	});

	it("displays the notes", () => {
		render(<RoleCard {...rolePreview} />);

		expect(screen.getByText(role.notes)).toBeVisible();
	});

	it("displays a link to the ad", () => {
		render(<RoleCard {...rolePreview} />);

		const link = screen.getByRole("link");

		expect(link).toHaveTextContent("Ad");
		expect(link).toHaveAttribute("href", role.ad_url);
	});

	it("displays the date the role was added to the dashboard", () => {
		render(<RoleCard {...rolePreview} />);

		expect(
			screen.getByText(`Added: ${new Date(role.date_added).toDateString()}`),
		).toBeVisible();
	});

	describe("when the role has been submitted", () => {
		it("displays submitted", () => {
			const submitted_date = faker.date.recent();
			render(
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
			render(<RoleCard {...rolePreview} date_submitted={null} />);

			expect(screen.getByText("Not Submitted")).toBeVisible();
		});
	});
});
