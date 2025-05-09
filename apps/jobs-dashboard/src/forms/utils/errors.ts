export function getFormOrFieldError(error: string | object[] | undefined) {
	if (!error) {
		return;
	}

	if (typeof error === "string") {
		return error;
	}

	if (error.length === 0) {
		return;
	}

	if ("message" in error[0] && typeof error[0].message === "string") {
		return error[0].message;
	}
}
