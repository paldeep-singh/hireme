import { ButtonHTMLAttributes } from "react";

interface ButtonProps {
	label: string;
	loading?: boolean;
	type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
	onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

export function Button({ label, loading, type, onClick }: ButtonProps) {
	return (
		<button type={type} className="button" onClick={onClick}>
			{label}
			{loading && (
				<div
					aria-label="loading"
					role="status"
					aria-live="polite"
					className="loading-spinner"
				></div>
			)}
		</button>
	);
}
