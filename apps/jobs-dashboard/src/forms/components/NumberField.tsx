import { useFieldContext } from "../formHookContexts";

export interface NumberFieldProps {
	label: string;
	error?: string;
	max?: number;
	min?: number;
}

export function NumberField({ label, error, max, min }: NumberFieldProps) {
	const field = useFieldContext<number | undefined>();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);

		field.setValue(Number.isNaN(value) ? undefined : value);
	};

	return (
		<>
			<label className="text-align-start">
				{label}

				<input
					type="number"
					name={field.name}
					value={field.state.value}
					onChange={(e) => handleInputChange(e)}
					max={max}
					min={min}
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
