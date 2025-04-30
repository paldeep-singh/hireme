import { faker } from "@faker-js/faker";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppForm } from "../../useAppForm";
import { ComboBoxProps } from "../ComboBox";

function renderComboBox(
	{ label, values, error }: ComboBoxProps,
	fieldName: string,
) {
	const FormWithComboBox = () => {
		const form = useAppForm({
			defaultValues: {
				[fieldName]: "",
			},
		});

		return (
			<form.AppForm>
				<form.AppField name={fieldName}>
					{(field) => (
						<field.ComboBox label={label} values={values} error={error} />
					)}
				</form.AppField>
			</form.AppForm>
		);
	};

	render(<FormWithComboBox />);
}

describe("ComboBox", () => {
	const label = faker.hacker.noun();
	const values = [
		faker.hacker.noun(),
		faker.hacker.noun(),
		faker.hacker.noun(),
	];
	const fieldName = faker.hacker.noun();

	it("renders the label", () => {
		renderComboBox({ label, values, error: undefined }, fieldName);

		expect(screen.getByLabelText(label)).toBeVisible();
	});

	it("renders the datalist with provided values", () => {
		renderComboBox({ label, values, error: undefined }, fieldName);

		const list = screen.getByTestId("combo-box-list");

		const options = within(list).getAllByRole("option", { hidden: true });

		values.forEach((value) => {
			expect(options.some((opt) => opt.getAttribute("value") === value)).toBe(
				true,
			);
		});
	});

	it("displays the error if provided", () => {
		const error = faker.hacker.phrase();

		renderComboBox({ label, values, error }, fieldName);

		expect(screen.getByRole("alert")).toHaveTextContent(error);
	});

	it("accepts input from the user", async () => {
		const user = userEvent.setup();
		renderComboBox({ label, values, error: undefined }, fieldName);

		const input = screen.getByRole("combobox");
		const userInput = faker.hacker.adjective();

		await user.type(input, userInput);

		expect(input).toHaveValue(userInput);
	});

	it("allows selecting a value from the datalist", async () => {
		const user = userEvent.setup();
		renderComboBox({ label, values, error: undefined }, fieldName);

		const input = screen.getByRole("combobox");
		await user.type(input, values[0]);

		// Simulate selecting from datalist
		await user.keyboard("{ArrowDown}");
		await user.keyboard("{Enter}");

		expect(input).toHaveValue(values[0]);
	});
});
