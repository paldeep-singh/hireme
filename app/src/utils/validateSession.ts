import { getSessionCookie } from "./sessionCookies";
import { ValidateSession } from "shared/generated/routes/admin";

interface ValidSession {
  valid: true;
}

interface InvalidSession {
  valid: false;
  error: string;
}

const { method, path } = ValidateSession;
export async function validateSession(): Promise<
  ValidSession | InvalidSession
> {
  const session = getSessionCookie();

  if (!session) {
    return {
      valid: false,
      error: "No session found, please login again.",
    };
  }

  const response = await fetch(path, { method });

  if (response.ok) {
    return { valid: true };
  }

  const { error } = await response.json();

  return {
    valid: false,
    error,
  };
}
