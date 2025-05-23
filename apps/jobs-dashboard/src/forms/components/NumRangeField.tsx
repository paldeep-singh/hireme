import { NumRange } from "@repo/api-types/types/api/Ranges";
import { useFieldContext } from "../formHookContexts";

export interface NumRangeFieldProps {
	label: string;
	unit?: string;
	error?: string;
	max?: number;
	min?: number;
}

export function NumRangeField({
	unit,
	label,
	error,
	min: minProp,
	max: maxProp,
}: NumRangeFieldProps) {
	const field = useFieldContext<NumRange>();

	const handleMinChange = (minString: string) => {
		field.handleChange((current) => {
			if (minString === "") {
				return {
					...current,
					min: null,
				};
			}

			const min = Number(minString);

			if (isNaN(min)) {
				return {
					...current,
					min: null,
				};
			}

			return {
				...current,
				min,
			};
		});
	};

	const handleMaxChange = (maxString: string) => {
		field.handleChange((current) => {
			if (maxString === "") {
				return {
					...current,
					max: null,
				};
			}

			const max = Number(maxString);

			if (isNaN(max)) {
				return {
					...current,
					max: null,
				};
			}

			return {
				...current,
				max,
			};
		});
	};

	return (
		<div className="numrange-input__container">
			<label className="text-align-start flex-row">
				{label}:
				<input
					type="number"
					aria-label={`Min ${label}`}
					name={`Min ${field.name}`}
					value={field.state.value.min ?? ""}
					onChange={(e) => handleMinChange(e.target.value)}
					min={minProp}
					max={maxProp}
					{...(error && {
						"aria-invalid": "true",
						"aria-errormessage": `${label}-inputValidationError`,
					})}
				/>
				<p>to</p>
				<input
					aria-label={`Max ${label}`}
					type="number"
					name={`Max ${field.name}`}
					value={field.state.value.max ?? ""}
					onChange={(e) => handleMaxChange(e.target.value)}
					min={minProp}
					max={maxProp}
					{...(error && {
						"aria-invalid": "true",
						"aria-errormessage": `${label}-inputValidationError`,
					})}
				/>
				<span>{unit}</span>
			</label>

			{error && <em id={`${label}-inputValidationError`}>{error}</em>}
		</div>
	);
}
