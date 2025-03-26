import { RolePreview } from "shared/types/rolePreview";

export function RoleCard({ company, title, notes, ad_url }: RolePreview) {
	return (
		<div className="flex flex-col gap-2 border-2 border-gray-200 p-4 box-content rounded-md">
			<div className="flex flex-col gap-1 max-w-sm">
				<h2 className="text-lg font-bold">{title}</h2>
				<h3 className="text-sm text-gray-500">{company}</h3>
				<p className="text-sm text-gray-700 text-wrap">{notes}</p>
			</div>
			{ad_url && <a href={ad_url}>View Ad</a>}
		</div>
	);
}
