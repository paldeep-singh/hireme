import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./contexts";
import { TextField } from "./TextField";
import { SubmitButton } from "./SubmitButton";
import { ErrorBanner } from "./ErrorBanner";

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
