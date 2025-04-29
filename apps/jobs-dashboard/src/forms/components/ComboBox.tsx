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
					list="combo-box-list"
					type="search"
					role="combobox"
					name={field.name}
					value={field.state.value}
					onChange={(e) => field.handleChange(e.target.value)}
					autoComplete="off"
				/>
				<datalist
					id="combo-box-list"
					role="listbox"
					data-testid="combo-box-list"
				>
					{values.map((value, index) => (
						<option key={`${value}-${index}`} value={value} />
					))}
				</datalist>
			</label>
		</>
	);
}
