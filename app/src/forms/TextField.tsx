import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { useFieldContext } from "./contexts";

interface TextInputProps {
  label: string;
  // name: string;
  type: Extract<HTMLInputTypeAttribute, "text" | "password" | "email">;
  // onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  // value: string;
  error?: string;
}

export function TextField({ type, error, label }: TextInputProps) {
  const field = useFieldContext<string>();
  return (
    <>
      <label className="flex flex-col text-start gap-1 m-4">
        {label}
        <input
          className="border-2 border-gray-500"
          type={type}
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
        />
        {error && <em className="text-red-600">{error}</em>}
      </label>
    </>
  );
}
