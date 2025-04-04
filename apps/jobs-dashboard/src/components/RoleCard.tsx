import { RolePreviewJson } from "@repo/shared/types/rolePreview";

export function RoleCard({
	company,
	title,
	notes,
	ad_url,
	date_added,
	location,
	submitted,
}: RolePreviewJson) {
	return (
		<div className="role-card">
			<h2 className="role-card__title">{title}</h2>

			<p className="role-card__company">{company}</p>
			<div className="role-card__role-info">
				<p>{location}</p>

				{ad_url && <a href={ad_url}>View Ad</a>}
			</div>
			<div className="role-card__app-info">
				<p>Added: {date_added}</p>
				<p>{submitted ? "Submitted" : "Pending"}</p>
			</div>

			<p className="role-card__notes">{notes}</p>
		</div>
	);
}
