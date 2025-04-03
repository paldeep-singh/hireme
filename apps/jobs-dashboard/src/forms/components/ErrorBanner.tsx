interface ErrorBannerProps {
	error?: string;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
	return error ? (
		<div
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
			className="error-banner"
		>
			<p>Error: {error}</p>
		</div>
	) : null;
}
