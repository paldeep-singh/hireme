import { createFormHook } from "@tanstack/react-form";
import { ErrorBanner } from "./components/ErrorBanner";
import { SubmitButton } from "./components/SubmitButton";
import { TextField } from "./components/TextField";
import { fieldContext, formContext } from "./contexts";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  // We'll learn more about these options later
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
    ErrorBanner,
  },
});
