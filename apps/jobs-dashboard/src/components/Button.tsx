import { ButtonHTMLAttributes } from "react";

export interface ButtonProps {
	label: string;
	loading?: boolean;
	type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
	onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
	variant?: "primary" | "secondary";
}

export function Button({
	label,
	loading,
	type,
	onClick,
	variant = "primary",
}: ButtonProps) {
	return (
		<button
			type={type}
			className="button"
			onClick={onClick}
			{...(variant === "secondary" && {
				"data-variant": "secondary",
			})}
		>
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
