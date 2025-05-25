import { createFormHook } from "@tanstack/react-form";
import { CheckBox } from "./components/CheckBox";
import { ComboBox } from "./components/ComboBox";
import { ErrorBanner } from "./components/ErrorBanner";
import { IntervalField } from "./components/IntervalField";
import { NotificationBanner } from "./components/NotificationBanner";
import { NumberField } from "./components/NumberField";
import { NumRangeField } from "./components/NumRangeField";
import { Select } from "./components/Select";
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
		NumberField,
		Select,
		NumRangeField,
		IntervalField,
	},
	formComponents: {
		SubmitButton,
		ErrorBanner,
		NotficationBanner: NotificationBanner,
	},
});
