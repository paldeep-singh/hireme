// apps/jobs-dashboard/src/forms/components/__tests__/NumberField.test.tsx
import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppForm } from "../../useAppForm";
import { NumberFieldProps } from "../NumberField";

function renderNumberField(props: NumberFieldProps, fieldName: string) {
	const FormWithNumberField = () => {
		const form = useAppForm({
			defaultValues: {
				[fieldName]: undefined,
			},
		});

		return (
			<form.AppForm>
				<form.AppField name={fieldName}>
					{(field) => <field.NumberField {...props} />}
				</form.AppField>
			</form.AppForm>
		);
	};

	render(<FormWithNumberField />);
}

describe("NumberField", () => {
	const label = faker.commerce.product();
	const fieldName = faker.database.column();

	it("renders the label", () => {
		renderNumberField({ label }, fieldName);
		expect(screen.getByRole("spinbutton")).toBeVisible();
		expect(screen.getByLabelText(label)).toBeVisible();
	});

	it("accepts numeric input", async () => {
		const user = userEvent.setup();
		renderNumberField({ label }, fieldName);

		const input = screen.getByLabelText(label);
		await user.type(input, "123");
		expect(input).toHaveValue(123);
	});

	it("shows error message if provided", () => {
		const error = faker.lorem.sentence();
		renderNumberField({ label, error }, fieldName);

		const input = screen.getByRole("spinbutton");

		expect(screen.getByText(error)).toBeVisible();

		expect(input).toHaveAttribute("aria-invalid", "true");
		expect(input).toHaveAttribute("aria-errormessage", "inputValidationError");
	});

	it("respects min and max props", () => {
		renderNumberField({ label, min: 5, max: 10 }, fieldName);

		const input = screen.getByLabelText(label);
		expect(input).toHaveAttribute("min", "5");
		expect(input).toHaveAttribute("max", "10");
	});
});
