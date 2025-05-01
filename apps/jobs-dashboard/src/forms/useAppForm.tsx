import { createFormHook } from "@tanstack/react-form";
import { CheckBox } from "./components/CheckBox";
import { ComboBox } from "./components/ComboBox";
import { ErrorBanner } from "./components/ErrorBanner";
import { NotificationBanner } from "./components/NotificationBanner";
import { SubmitButton } from "./components/SubmitButton";
import { TextField } from "./components/TextField";
import { fieldContext, formContext } from "./formHookContexts";

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField,
		ComboBox,
		CheckBox,
	},
	formComponents: {
		SubmitButton,
		ErrorBanner,
		NotficationBanner: NotificationBanner,
	},
});
