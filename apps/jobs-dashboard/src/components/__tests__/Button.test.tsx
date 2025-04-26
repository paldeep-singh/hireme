import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
	const label = faker.lorem.word();

	it("renders the label", () => {
		render(<Button label={label} />);

		expect(screen.getByRole("button")).toHaveTextContent(label);
	});

	it("sets the provided type", () => {
		const type = "submit";

		render(<Button label={label} type={type} />);

		expect(screen.getByRole("button")).toHaveAttribute("type", type);
	});

	it("calls onClick when clicked", async () => {
		const onClick = vi.fn();

		render(<Button label={label} onClick={onClick} />);

		const user = userEvent.setup();

		await user.click(screen.getByRole("button"));

		expect(onClick).toHaveBeenCalledOnce();
	});

	describe("when loading is true", () => {
		it("renders the loading indicator", () => {
			render(<Button label={label} loading={true} />);

			expect(screen.getByLabelText("loading")).toBeVisible();
		});
	});

	describe("when loading is false", () => {
		it("does not render the loading indicator", () => {
			render(<Button label={label} loading={false} />);

			expect(screen.queryByLabelText("loading")).toBeNull();
		});
	});

	describe("when button is a secondary button", () => {
		it("applies the data-variant attribute", () => {
			render(<Button label={label} variant="secondary" />);

			expect(screen.getByRole("button")).toHaveAttribute(
				"data-variant",
				"secondary",
			);
		});
	});
});
