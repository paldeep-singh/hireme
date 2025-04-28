import { useFieldContext } from "../formHookContexts";

export interface ComboBoxProps {
	label: string;
	values: string[];
}

export function ComboBox({ label, values }: ComboBoxProps) {
	const field = useFieldContext<string>();

	return (
		<>
			<label className="text-align-start">
				{label}
				<input
					list="company-names"
					type="search"
					name={field.name}
					value={field.state.value}
					onChange={(e) => field.handleChange(e.target.value)}
					autoComplete="off"
				/>
				<datalist id="company-names">
					{values.map((value) => (
						<option key={value} value={value} />
					))}
				</datalist>
			</label>
		</>
	);
}
