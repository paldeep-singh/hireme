import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import { CompanyId } from "shared/generated/db/hire_me/Company";
import { RoleId } from "shared/generated/db/hire_me/Role";
import {
	generateCompanyData,
	generateRoleData,
} from "../../../../shared/testHelpers/generators";
import { RoleCard } from "../RoleCard";

describe("RoleCard", () => {
	const { name: company } = generateCompanyData();

	const role = generateRoleData(1 as CompanyId);
	const roleId = faker.number.int({ max: 100 }) as RoleId;

	function renderRoleCard() {
		render(<RoleCard {...role} id={roleId} company={company} />);
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
