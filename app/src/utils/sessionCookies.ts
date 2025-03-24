import Cookie from "cookie-universal";
import DBSession from "shared/generated/db/hire_me/session";

const cookie = Cookie();

export type Session = Pick<DBSession, "id">;

const isSession = (maybeSession: unknown): maybeSession is Session => {
  return (
    typeof maybeSession === "object" &&
    maybeSession !== null &&
    "id" in maybeSession
  );
};

export const storeSessionCookie = (session: unknown): void => {
  if (isSession(session)) {
    cookie.set("session", session.id);
    return;
  }

  throw new Error("Invalid session");
};

export const getSessionCookie = (): Session | null => {
  const session = cookie.get("session", { parseJSON: true }) as unknown;

  if (isSession(session)) {
    return session;
  }

  return null;
};
