import { useFieldContext } from "../formHookContexts";

export interface CheckBoxProps {
	label: string;
	error?: string;
}

export function CheckBox({ label, error }: CheckBoxProps) {
	const field = useFieldContext<boolean | null>();

	return (
		<label>
			{label}
			<input
				type="checkbox"
				checked={field.state.value ?? false}
				onClick={() => field.handleChange(!field.state.value)}
				{...(error && {
					"aria-invalid": "true",
					"aria-errormessage": "inputValidationError",
				})}
			/>

			{error && <em id="inputValidationError">{error}</em>}
		</label>
	);
}
