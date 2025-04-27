const steps = [
	"company",
	"role",
	"location",
	"contract",
	"requirements",
] as const;

type Step = (typeof steps)[number];

interface AddRoleProgressBarProps {
	currentStep: Step;
}

export function AddRoleProgressBar({ currentStep }: AddRoleProgressBarProps) {
	return (
		<div className="wrapper flow">
			<div className="progress__container">
				{steps.map((step) => (
					<h1
						key={step}
						className="progress__step"
						data-active={`${currentStep === step}`}
					>
						{step}
					</h1>
				))}
			</div>
		</div>
	);
}
