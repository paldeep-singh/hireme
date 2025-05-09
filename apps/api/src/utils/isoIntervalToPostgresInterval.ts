export function isoIntervalToPostgresInterval(isoInterval: string): string {
	const regex =
		/^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
	const match = regex.exec(isoInterval);

	if (!match) {
		throw new Error("Invalid ISO 8601 interval format");
	}

	const [, years, months, days, hours, minutes, secondsRaw] = match;

	if (!years && !months && !days && !hours && !minutes && !secondsRaw) {
		throw new Error("Invalid ISO 8601 interval format");
	}

	const parts: string[] = [];

	if (years) parts.push(`${years} year${years === "1" ? "" : "s"}`);
	if (months) parts.push(`${months} mon${months === "1" ? "" : "s"}`);
	if (days) parts.push(`${days} day${days === "1" ? "" : "s"}`);

	if (hours || minutes || secondsRaw) {
		const hh = String(hours ? hours : "0").padStart(2, "0");
		const mm = String(minutes ? minutes : "0").padStart(2, "0");

		let seconds = "00";
		let fractional = "";

		if (secondsRaw) {
			const [whole, fraction] = secondsRaw.split(".");
			seconds = String(whole).padStart(2, "0");
			if (fraction) {
				// Ensure 3 digits for milliseconds
				fractional = "." + fraction.padEnd(3, "0").slice(0, 3);
			}
		}

		parts.push(`${hh}:${mm}:${seconds}${fractional}`);
	}

	return parts.join(" ");
}
