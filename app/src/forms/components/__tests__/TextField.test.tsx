import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppForm } from "../../useAppForm";
import { TextInputProps } from "../TextField";

function renderTextInput(
	{ label, type, error }: TextInputProps,
	fieldName: string,
) {
	const FormWithTextField = () => {
		const form = useAppForm({
			defaultValues: {
				[fieldName]: "",
			},
		});

		return (
			<form.AppForm>
				<form.AppField name={fieldName}>
					{(field) => (
						<field.TextField label={label} type={type} error={error} />
					)}
				</form.AppField>
			</form.AppForm>
		);
	};

	render(<FormWithTextField />);
}

describe("TextField", () => {
	const label = faker.hacker.noun();
	const type = "text";
	const fieldName = faker.hacker.noun();

	it("renders the label", () => {
		renderTextInput({ label, type }, fieldName);

		expect(screen.getByText(label)).toBeVisible();
	});

	it("sets the type", () => {
		renderTextInput({ label, type }, fieldName);

		expect(screen.getByRole("textbox")).toHaveAttribute("type", type);
	});

	it("displays the error if provided", () => {
		const error = faker.hacker.phrase();

		renderTextInput({ label, type, error }, fieldName);

		expect(screen.getByText(error)).toBeVisible();
	});

	it("accepts text input from the user", async () => {
		const user = userEvent.setup();
		renderTextInput({ label, type }, fieldName);

		const input = screen.getByRole("textbox");

		const userInput = faker.hacker.adjective();

		await user.type(input, userInput);

		expect(input).toHaveAttribute("value", userInput);
	});
});
