import { faker } from "@faker-js/faker";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppForm } from "../../useAppForm";
import { IntervalFieldProps } from "../IntervalField";

function renderIntervalField(props: IntervalFieldProps, fieldName: string) {
	const FormWithIntervalField = () => {
		const form = useAppForm({
			defaultValues: {
				[fieldName]: undefined,
			},
		});

		return (
			<form.AppForm>
				<form.AppField name={fieldName}>
					{(field) => <field.IntervalField {...props} />}
				</form.AppField>
			</form.AppForm>
		);
	};

	render(<FormWithIntervalField />);
}

describe("IntervalField", () => {
	const label = faker.commerce.product();
	const fieldName = faker.database.column();

	it("renders the label", () => {
		renderIntervalField({ label }, fieldName);

		expect(screen.getByLabelText(label)).toBeVisible();
	});

	it("renders the numeric input", () => {
		renderIntervalField({ label }, fieldName);

		expect(screen.getByRole("spinbutton")).toBeVisible();
	});

	it("renders the period select", () => {
		renderIntervalField({ label }, fieldName);

		const periodSelect = screen.getByRole("combobox");

		expect(periodSelect).toBeVisible();

		expect(
			within(periodSelect).getByRole("option", {
				name: "month(s)",
			}),
		).toHaveValue("months");

		expect(
			within(periodSelect).getByRole("option", {
				name: "year(s)",
			}),
		).toHaveValue("years");
	});

	describe("when values change", () => {
		const user = userEvent.setup();
		let formValue: string | null | undefined = undefined;

		const FormWithIntervalField = () => {
			const form = useAppForm({
				defaultValues: {
					[fieldName]: undefined,
				},
			});

			return (
				<form.AppForm>
					<form.AppField
						name={fieldName}
						listeners={{
							onChange: ({ value }) => {
								formValue = value;
							},
						}}
					>
						{(field) => <field.IntervalField label={label} />}
					</form.AppField>
				</form.AppForm>
			);
		};

		describe("when the numeric value changes", () => {
			it("updates form value when numeric value is > 0", async () => {
				render(<FormWithIntervalField />);

				const input = screen.getByRole("spinbutton");
				await user.type(input, "6");

				await waitFor(() => {
					expect(formValue).toBe("P6M");
				});
			});

			it("updates form value to null and numeric value to zero when field is cleared", async () => {
				render(<FormWithIntervalField />);

				const input = screen.getByRole("spinbutton");
				await user.clear(input);

				await waitFor(() => {
					expect(formValue).toBeNull();
				});
			});

			it("updates form value to null when numeric value is zero", async () => {
				render(<FormWithIntervalField />);

				const input = screen.getByRole("spinbutton");
				await user.clear(input);
				await user.type(input, "0");

				await waitFor(() => {
					expect(formValue).toBeNull();
				});
			});
		});

		describe("when the period changes", () => {
			it("updates form value if numeric value is > 0", async () => {
				render(<FormWithIntervalField />);

				const valueInput = screen.getByRole("spinbutton");
				await user.type(valueInput, "6");

				const periodSelect = screen.getByRole("combobox");

				await user.selectOptions(periodSelect, "years");

				await waitFor(() => {
					expect(formValue).toBe("P6Y");
				});
			});

			it("does not update the form value if numeric value is 0", async () => {
				render(<FormWithIntervalField />);

				const valueInput = screen.getByRole("spinbutton");
				await user.clear(valueInput);

				const periodSelect = screen.getByRole("combobox");

				await user.selectOptions(periodSelect, "years");

				await waitFor(() => {
					expect(formValue).toBeNull();
				});
			});
		});
	});
});
