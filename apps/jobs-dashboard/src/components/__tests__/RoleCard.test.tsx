import {
	generateCompany,
	generateRole,
} from "@repo/shared/testHelpers/generators";
import { render, screen } from "@testing-library/react";
import { RoleCard } from "../RoleCard";

describe("RoleCard", () => {
	const { name: company, id: companyId } = generateCompany();

	const role = generateRole(companyId);

	function renderRoleCard() {
		render(<RoleCard {...role} company={company} />);
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
