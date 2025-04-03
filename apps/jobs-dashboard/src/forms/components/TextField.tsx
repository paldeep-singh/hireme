import { HTMLInputTypeAttribute } from "react";
import { useFieldContext } from "../contexts";

export interface TextInputProps {
	label: string;
	// name: string;
	type: Extract<HTMLInputTypeAttribute, "text" | "password" | "email">;
	// onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	// value: string;
	error?: string;
}

export function TextField({ type, error, label }: TextInputProps) {
	const field = useFieldContext<string>();
	return (
		<>
			<label className="text-align-start">
				{label}
				<input
					type={type}
					name={field.name}
					value={field.state.value}
					onChange={(e) => field.handleChange(e.target.value)}
					{...(type === "password" && { role: "textbox" })}
					{...(error && {
						"aria-invalid": "true",
						"aria-errormessage": "inputValidationError",
					})}
				/>
				{error && <em id="inputValidationError">{error}</em>}
			</label>
		</>
	);
}
