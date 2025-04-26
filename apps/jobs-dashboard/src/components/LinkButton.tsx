import { Link, LinkProps } from "@tanstack/react-router";
import { Button, ButtonProps } from "./Button";

interface LinkButtonProps extends Pick<ButtonProps, "label">, LinkProps {}

export function LinkButton({ label, ...linkProps }: LinkButtonProps) {
	return (
		<Link className="link-button__link" {...linkProps}>
			<Button variant="secondary" label={label} type="button" />
		</Link>
	);
}
