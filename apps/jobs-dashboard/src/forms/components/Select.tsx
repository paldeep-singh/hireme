import { useFieldContext } from "../formHookContexts";

interface SelectProps<T extends string> {
	options: (T | "N/A")[];
	label: string;
	nullable?: boolean;
}

export function Select<T extends string>({
	label,
	options,
	nullable = false,
}: SelectProps<T>) {
	const field = useFieldContext<T | null>();

	const handleChange = (newValue: T | "N/A") => {
		if (newValue === "N/A") {
			field.handleChange(null);

			return;
		}

		field.handleChange(newValue);
	};

	return (
		<label className="select">
			{label}
			<select
				name={field.name}
				value={field.state.value ?? "N/A"}
				onChange={(e) => handleChange(e.target.value as T)}
			>
				{options.map((option) => (
					<option key={option}>{option}</option>
				))}
				{nullable && <option>N/A</option>}
			</select>
		</label>
	);
}
