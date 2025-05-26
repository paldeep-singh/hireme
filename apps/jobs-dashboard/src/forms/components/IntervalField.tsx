import { useState } from "react";
import { Duration, serialize } from "tinyduration";
import { useFieldContext } from "../formHookContexts";

export interface IntervalFieldProps {
	label: string;
	error?: string;
}

type Period = Extract<keyof Duration, "years" | "months">;

export function IntervalField({ label, error }: IntervalFieldProps) {
	const field = useFieldContext<string | null>();

	const [value, setValue] = useState<number>(0);
	const [period, setPeriod] = useState<Period>("months");

	const handleValueChange = (newValueString: string) => {
		const newValue = Number(newValueString);

		if (isNaN(newValue) || newValue === 0) {
			setValue(0);
			field.handleChange(null);
			return;
		}

		setValue(newValue);
		field.handleChange(serialize({ [period]: newValue }));
	};

	const handlePeriodChange = (newPeriod: Period) => {
		setPeriod(newPeriod);

		if (value > 0) {
			field.handleChange(
				serialize({
					[newPeriod]: value,
				}),
			);
		}
	};

	return (
		<div>
			<fieldset className="flex-row">
				<legend>{label}</legend>
				<input
					type="number"
					min={0}
					name={`${field.name}-value`}
					value={value}
					onChange={(e) => handleValueChange(e.target.value)}
				/>
				<select
					name={`${field.name}-period`}
					onChange={(e) => handlePeriodChange(e.target.value as Period)}
					value={period}
				>
					<option value="months">month(s)</option>
					<option value="years">year(s)</option>
				</select>
			</fieldset>
			{error && <em>{error}</em>}
		</div>
	);
}
