interface NotificationBannerProps {
	notification?: string;
}

export function NotificationBanner({ notification }: NotificationBannerProps) {
	return notification ? (
		<div role="alert" aria-live="assertive" aria-atomic="true">
			<p>{notification}</p>
		</div>
	) : null;
}
