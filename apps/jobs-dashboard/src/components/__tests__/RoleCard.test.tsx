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
		date_added: role.date_added.toISOString(),
	};

	function renderRoleCard(submitted?: "submitted" | "not submitted") {
		const submittedProp = submitted
			? {
					submitted: submitted === "submitted",
				}
			: {
					submitted: rolePreview.submitted,
				};

		render(<RoleCard {...rolePreview} {...submittedProp} />);
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

		expect(link).toHaveTextContent("Ad");
		expect(link).toHaveAttribute("href", role.ad_url);
	});

	it("displays the date the role was added to the dashboard", () => {
		renderRoleCard();

		expect(
			screen.getByText(`Added: ${new Date(role.date_added).toDateString()}`),
		).toBeVisible();
	});

	describe("when the role has been submitted", () => {
		it("displays submitted", () => {
			renderRoleCard("submitted");

			expect(screen.getByText("Submitted")).toBeVisible();
		});
	});

	describe("when the role has not been submitted", () => {
		it("displays Not Submitted", () => {
			renderRoleCard("not submitted");

			expect(screen.getByText("Not Submitted")).toBeVisible();
		});
	});
});
