interface ErrorBannerProps {
  error?: string;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  return error ? (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="rounded-md border-4 border-red-700 bg-red-200 px-4"
    >
      <p>Error: {error}</p>
    </div>
  ) : null;
}
