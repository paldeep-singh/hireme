import { RolePreview } from "@repo/api-types/types/api/RolePreview";

export function RoleCard({
	company,
	title,
	notes,
	ad_url,
	date_added,
	location,
	date_submitted,
}: RolePreview) {
	const dateAddedString = new Date(date_added).toDateString();

	return (
		<div className="role-card flow">
			<div className="role-card__details flow" data-spacing="small">
				<h2>{title}</h2>

				<p className="role-card__company">{company}</p>

				{location && <p className="role-card__location"> {location}</p>}
				<p>Added: {dateAddedString}</p>
				<p>
					{date_submitted
						? `Submitted: ${new Date(date_submitted).toDateString()}`
						: "Not Submitted"}
				</p>
				{ad_url && <a href={ad_url}>View Ad</a>}
			</div>
			<div className="role-card__notes">
				{notes && (
					<>
						<p>Notes:</p>
						<p>{notes}</p>
					</>
				)}
			</div>
		</div>
	);
}
