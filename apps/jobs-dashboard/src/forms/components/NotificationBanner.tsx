interface NotificationBannerProps {
	notification?: string;
}

export function NotficationBanner({ notification }: NotificationBannerProps) {
	return notification ? (
		<div
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
			className="notification-banner"
		>
			<p>{notification}</p>
		</div>
	) : null;
}
