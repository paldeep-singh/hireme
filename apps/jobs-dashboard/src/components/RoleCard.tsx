import { RolePreview } from "@repo/shared/types/rolePreview";

export function RoleCard({ company, title, notes, ad_url }: RolePreview) {
	return (
		<div className="card">
			<h2>{title}</h2>
			<h3>{company}</h3>
			<p>{notes}</p>
			{ad_url && <a href={ad_url}>View Ad</a>}
		</div>
	);
}
