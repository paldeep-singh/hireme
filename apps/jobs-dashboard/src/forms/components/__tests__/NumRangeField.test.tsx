import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppForm } from "../../useAppForm";
import { NumRangeFieldProps } from "../NumRangeField";

function renderNumRangeField(props: NumRangeFieldProps, fieldName: string) {
	const FormWithNumRangeField = () => {
		const form = useAppForm({
			defaultValues: {
				[fieldName]: { min: null, max: null },
			},
		});

		return (
			<form.AppForm>
				<form.AppField name={fieldName}>
					{(field) => <field.NumRangeField {...props} />}
				</form.AppField>
			</form.AppForm>
		);
	};

	render(<FormWithNumRangeField />);
}

describe("NumRangeField", () => {
	const label = faker.commerce.product();
	const fieldName = faker.database.column();

	it("renders the label and inputs", () => {
		renderNumRangeField({ label }, fieldName);

		const inputs = screen.getAllByRole("spinbutton");
		expect(inputs).toHaveLength(2);
		expect(screen.getByText("to")).toBeVisible();
		expect(screen.getByText(`${label}:`)).toBeVisible();
	});

	it("accepts numeric input for both min and max", async () => {
		const user = userEvent.setup();
		renderNumRangeField({ label }, fieldName);

		const minInput = screen.getByLabelText(`Min ${label}`);
		const maxInput = screen.getByLabelText(`Max ${label}`);

		await user.type(minInput, "123");

		await user.clear(maxInput);
		await user.type(maxInput, "456");

		expect(minInput).toHaveValue(123);
		expect(maxInput).toHaveValue(456);
	});

	it("shows error message if provided", () => {
		const error = faker.lorem.sentence();
		renderNumRangeField({ label, error: error }, fieldName);

		const inputs = screen.getAllByRole("spinbutton");
		expect(screen.getByText(error)).toHaveAttribute(
			"id",
			`${label}-inputValidationError`,
		);

		inputs.forEach((input) => {
			expect(input).toHaveAttribute("aria-invalid", "true");
			expect(input).toHaveAttribute(
				"aria-errormessage",
				`${label}-inputValidationError`,
			);
		});
	});

	it("respects min and max props", () => {
		renderNumRangeField({ label, min: 5, max: 10 }, fieldName);

		const [minInput, maxInput] = screen.getAllByRole("spinbutton");

		expect(minInput).toHaveAttribute("min", "5");
		expect(minInput).toHaveAttribute("max", "10");
		expect(maxInput).toHaveAttribute("min", "5");
		expect(maxInput).toHaveAttribute("max", "10");
	});

	it("displays unit if provided", () => {
		const unit = "kg";
		renderNumRangeField({ label, unit }, fieldName);

		expect(screen.getByText(unit)).toBeVisible();
	});

	it("handles empty input for min value", async () => {
		const user = userEvent.setup();
		renderNumRangeField({ label }, fieldName);

		const [minInput, maxInput] = screen.getAllByRole("spinbutton");

		await user.type(minInput, "100");
		await user.clear(minInput);

		expect(minInput).toHaveValue(null);
		expect(maxInput).toHaveValue(null);
	});

	it("handles empty input for max value", async () => {
		const user = userEvent.setup();
		renderNumRangeField({ label }, fieldName);

		const [minInput, maxInput] = screen.getAllByRole("spinbutton");

		await user.type(maxInput, "100");
		await user.clear(maxInput);

		expect(minInput).toHaveValue(null);
		expect(maxInput).toHaveValue(null);
	});
});
