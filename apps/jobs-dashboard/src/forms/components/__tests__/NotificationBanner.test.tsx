import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import { NotificationBanner } from "../NotificationBanner";

describe("NotificationBanner", () => {
	it("renders the notification when provided", () => {
		const notification = faker.lorem.sentence();

		render(<NotificationBanner notification={notification} />);

		expect(screen.getByRole("alert")).toHaveTextContent(notification);
	});

	it("does not render when no notification is provided", () => {
		render(<NotificationBanner />);

		expect(screen.queryByRole("alert")).toBeNull();
	});
});
