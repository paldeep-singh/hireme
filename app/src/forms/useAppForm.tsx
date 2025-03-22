import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./contexts";
import { TextField } from "./components/TextField";
import { SubmitButton } from "./components/SubmitButton";
import { ErrorBanner } from "./components/ErrorBanner";

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
