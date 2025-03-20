interface SubmitButtonProps {
  label: string;
  loading: boolean;
}

export function SubmitButton({ label, loading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="flex w-fit flex-row items-center rounded border-2 border-blue-500 p-2 active:bg-blue-200"
    >
      {label}
      {loading && (
        <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      )}
    </button>
  );
}
