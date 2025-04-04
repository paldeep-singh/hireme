import {
	generateApplicationData,
	generateCompany,
	generateRole,
	generateRoleLocationData,
} from "@repo/shared/testHelpers/generators";
import { render, screen } from "@testing-library/react";
import { RoleCard } from "../RoleCard";

describe("RoleCard", () => {
	const { name: company, id: companyId } = generateCompany();

	const role = generateRole(companyId);
	const { location } = generateRoleLocationData(role.id);
	const { submitted } = generateApplicationData(role.id);

	const rolePreview = {
		...role,
		company,
		location,
		submitted,
	};

	function renderRoleCard() {
		render(<RoleCard {...rolePreview} />);
	}

	it("displays the role title", () => {
		renderRoleCard();

		expect(screen.getByText(role.title)).toBeVisible();
	});

	it("displays the company", () => {
		renderRoleCard();

		expect(screen.getByText(company)).toBeVisible();
	});

	it("displays the notes", () => {
		renderRoleCard();

		expect(screen.getByText(role.notes)).toBeVisible();
	});

	it("displays a link to the ad", () => {
		renderRoleCard();

		const link = screen.getByRole("link");

		expect(link).toHaveTextContent("View Ad");
		expect(link).toHaveAttribute("href", role.ad_url);
	});
});
