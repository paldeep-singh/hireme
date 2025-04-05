import { faker } from "@faker-js/faker";
import {
	generateApplicationData,
	generateCompany,
	generateRole,
	generateRoleLocationData,
} from "@repo/shared/testHelpers/generators";
import { RolePreviewJson } from "@repo/shared/types/rolePreview";
import { render, screen } from "@testing-library/react";
import { RoleCard } from "../RoleCard";

describe("RoleCard", () => {
	const { name: company, id: companyId } = generateCompany();

	const role = generateRole(companyId);
	const { location } = generateRoleLocationData(role.id);
	const { date_submitted } = generateApplicationData(role.id);

	const rolePreview: RolePreviewJson = {
		...role,
		company,
		location,
		date_added: role.date_added.toISOString(),
		date_submitted: date_submitted?.toISOString() ?? null,
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
