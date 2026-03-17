type ProgressHeaderProps = {
  currentStep: "scope" | "eligibility" | "checklist";
};

const STEPS: { id: ProgressHeaderProps["currentStep"]; label: string }[] = [
  { id: "scope", label: "Scope wizard" },
  { id: "eligibility", label: "SAQ eligibility" },
  { id: "checklist", label: "Compliance checklist" },
];

export function ProgressHeader({ currentStep }: ProgressHeaderProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progressPercent = ((currentIndex + 1) / STEPS.length) * 100;

  return (
    <div className="mb-8 space-y-3">
      <div
        className="h-2 rounded-full bg-slate-200 overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-emerald-600 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete = index < currentIndex;
          return (
            <div key={step.id} className="flex flex-col items-start">
              <span
                className={[
                  "inline-flex items-center gap-1 rounded-full px-3 py-1",
                  isActive
                    ? "bg-emerald-50 text-emerald-800"
                    : isComplete
                    ? "bg-slate-100 text-slate-700"
                    : "bg-slate-50 text-slate-500",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    isActive
                      ? "bg-emerald-600"
                      : isComplete
                      ? "bg-emerald-300"
                      : "bg-slate-300",
                  ].join(" ")}
                />
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

