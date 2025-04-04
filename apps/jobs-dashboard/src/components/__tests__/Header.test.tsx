import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

describe("Header", () => {
	it("renders the website title", () => {
		render(<Header />);

		expect(screen.getByRole("banner")).toHaveTextContent("Jobs Dashboard");
	});

	it("renders the logout button", () => {
		render(<Header />);

		expect(screen.getByRole("button")).toHaveTextContent("Logout");
	});
});
