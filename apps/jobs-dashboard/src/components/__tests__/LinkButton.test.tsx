import { faker } from "@faker-js/faker";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../testUtils";
import { LinkButton } from "../LinkButton";

describe("Link Button", () => {
	const label = faker.lorem.word();
	const to = "/dashboard";

	it("renders the label", () => {
		renderWithProviders(<LinkButton to={to} label={label} />);

		expect(screen.getByRole("link")).toHaveTextContent(label);
	});

	it('navigates to "to" on click', async () => {
		const { router } = renderWithProviders(
			<LinkButton to={to} label={label} />,
		);

		const user = userEvent.setup();

		await waitFor(async () => {
			await user.click(screen.getByRole("link"));

			expect(router.history.location.pathname).toEqual(to);
		});
	});
});
