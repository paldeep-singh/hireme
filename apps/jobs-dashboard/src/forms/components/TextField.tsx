import { HTMLInputTypeAttribute } from "react";
import { useFieldContext } from "../formHookContexts";

export interface TextInputProps {
	label: string;
	// name: string;
	type: Extract<HTMLInputTypeAttribute, "text" | "password" | "email"> | "area";
	// onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	// value: string;
	error?: string;
}

export function TextField({ type, error, label }: TextInputProps) {
	const field = useFieldContext<string | undefined>();

	// Function to convert empty string to null
	const handleInputChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		const value = e.target.value.trim() === "" ? undefined : e.target.value;
		field.setValue(value); // Set the form field value manually
	};

	return (
		<>
			<div className="text-input__container">
				<label className="text-input__label">
					{label}

					{type === "area" ? (
						<textarea
							name={field.name}
							value={field.state.value ?? ""}
							onChange={(e) => handleInputChange(e)}
							{...(error && {
								"aria-invalid": "true",
								"aria-errormessage": "inputValidationError",
							})}
						></textarea>
					) : (
						<input
							type={type}
							name={field.name}
							value={field.state.value ?? ""}
							onChange={(e) => handleInputChange(e)}
							{...(type === "password" && { role: "textbox" })}
							{...(error && {
								"aria-invalid": "true",
								"aria-errormessage": "inputValidationError",
							})}
						/>
					)}
				</label>

				{error && <em id="inputValidationError">{error}</em>}
			</div>
		</>
	);
}
