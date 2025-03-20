interface SubmitButtonProps {
  label: string;
}

export function SubmitButton({ label }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="rounded border-2 border-blue-500 p-2 active:bg-blue-200"
    >
      {label}
    </button>
  );
}
