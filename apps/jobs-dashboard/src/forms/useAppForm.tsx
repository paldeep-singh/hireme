import { createFormHook } from "@tanstack/react-form";
import { ComboBox } from "./components/ComboBox";
import { ErrorBanner } from "./components/ErrorBanner";
import { NotificationBanner } from "./components/NotificationBanner";
import { SubmitButton } from "./components/SubmitButton";
import { TextField } from "./components/TextField";
import { fieldContext, formContext } from "./contexts";

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		ComboBox,
	},
	formComponents: {
		SubmitButton,
		ErrorBanner,
		NotficationBanner: NotificationBanner,
	},
});
