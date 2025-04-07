import { SessionId } from "@repo/shared/generated/db/hire_me/Session";
import { Request } from "express";

export function parseSessionCookie(req: Request): SessionId | undefined {
	if (!req.cookies) {
		return undefined;
	}

	let session;
	try {
		session = JSON.parse(req.cookies.session);
	} catch {
		return undefined;
	}

	if (!(typeof session === "object") || !("id" in session)) {
		return undefined;
	}

	return session.id;
}
