import { useFieldContext } from "../formHookContexts";

interface SelectProps {
	label: string;
}

export function Select({ label }: SelectProps) {
	const field = useFieldContext<boolean | null>();

	const handleChange = (newValue: string) => {
		if (newValue === "N/A") {
			field.handleChange(null);

			return;
		}

		field.handleChange(Boolean(newValue));
	};

	return (
		<label className="select">
			{label}:
			<select
				name={field.name}
				value={field.state.value ? `${field.state.value}` : "N/A"}
				onChange={(e) => handleChange(e.target.value)}
			>
				<option>true</option>
				<option>false</option>
				<option>N/A</option>
			</select>
		</label>
	);
}
