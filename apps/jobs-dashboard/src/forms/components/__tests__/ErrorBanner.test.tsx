import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import { ErrorBanner } from "../ErrorBanner";

describe("ErrorBanner", () => {
	it("renders the error when provided", () => {
		const error = faker.lorem.sentence();

		render(<ErrorBanner error={error} />);

		expect(screen.getByText(`Error: ${error}`)).toBeVisible();
	});

	it("does no render when no error is provided", () => {
		render(<ErrorBanner />);

		expect(screen.queryByRole("alert")).toBeNull();
	});
});
