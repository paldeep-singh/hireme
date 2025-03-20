interface ErrorBannerProps {
  error?: string;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  return error ? (
    <div className="rounded-md border-4 border-red-700 bg-red-200 px-4">
      <p>Error: {error}</p>
    </div>
  ) : null;
}
