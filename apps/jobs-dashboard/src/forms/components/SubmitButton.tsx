interface SubmitButtonProps {
	label: string;
	loading: boolean;
}

export function SubmitButton({ label, loading }: SubmitButtonProps) {
	return (
		<button type="submit" className="button">
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
