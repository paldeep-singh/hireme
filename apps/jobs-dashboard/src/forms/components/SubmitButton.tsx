import { Button, ButtonProps } from "../../components/Button";

type SubmitButtonProps = Required<Pick<ButtonProps, "label" | "loading">>;

export function SubmitButton({ label, loading }: SubmitButtonProps) {
	return <Button label={label} loading={loading} type="submit" />;
}
