import { Link, LinkProps } from "@tanstack/react-router";
import { Button, ButtonProps } from "./Button";

interface LinkButtonProps
	extends Pick<ButtonProps, "label" | "variant">,
		LinkProps {}

export function LinkButton({
	label,
	variant = "secondary",
	...linkProps
}: LinkButtonProps) {
	return (
		<Link className="link-button__link" {...linkProps}>
			<Button variant={variant} label={label} type="button" />
		</Link>
	);
}
