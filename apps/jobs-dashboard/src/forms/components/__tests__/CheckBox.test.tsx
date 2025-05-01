// apps/jobs-dashboard/src/forms/components/__tests__/CheckBox.test.tsx
import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppForm } from "../../useAppForm";
import { CheckBoxProps } from "../CheckBox";

function renderCheckBox({ label, error }: CheckBoxProps, fieldName: string) {
	const FormWithCheckBox = () => {
		const form = useAppForm({
			defaultValues: {
				[fieldName]: false,
			},
		});

		return (
			<form.AppForm>
				<form.AppField name={fieldName}>
					{(field) => <field.CheckBox label={label} error={error} />}
				</form.AppField>
			</form.AppForm>
		);
	};

	render(<FormWithCheckBox />);
}

describe("CheckBox", () => {
	const label = faker.hacker.noun();
	const fieldName = faker.hacker.noun();

	it("renders the label", () => {
		renderCheckBox({ label }, fieldName);

		expect(screen.getByLabelText(label)).toBeVisible();
	});

	it("starts unchecked by default", () => {
		renderCheckBox({ label }, fieldName);

		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).not.toBeChecked();
	});

	it("toggles when clicked", async () => {
		const user = userEvent.setup();
		renderCheckBox({ label }, fieldName);

		const checkbox = screen.getByRole("checkbox");

		await user.click(checkbox);
		expect(checkbox).toBeChecked();

		await user.click(checkbox);
		expect(checkbox).not.toBeChecked();
	});

	it("displays the error if provided", () => {
		const error = faker.hacker.phrase();

		renderCheckBox({ label, error }, fieldName);

		expect(screen.getByText(error)).toBeVisible();
	});

	it("has correct aria attributes when there is an error", () => {
		const error = faker.hacker.phrase();

		renderCheckBox({ label, error }, fieldName);

		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toHaveAttribute("aria-invalid", "true");
		expect(checkbox).toHaveAttribute(
			"aria-errormessage",
			"inputValidationError",
		);
	});

	it("does not have aria error attributes when there is no error", () => {
		renderCheckBox({ label }, fieldName);

		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).not.toHaveAttribute("aria-invalid");
		expect(checkbox).not.toHaveAttribute("aria-errormessage");
	});
});
