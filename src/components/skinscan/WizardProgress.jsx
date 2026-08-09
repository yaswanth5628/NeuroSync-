import { Check } from "lucide-react";

const STEPS = ["Capture", "Quality", "Questions", "Review"];

export default function WizardProgress({ current }) {
  return (
    <div className="flex items-start justify-between gap-1">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
            <div className="w-full flex items-center">
              {i > 0 && (
                <div className={`flex-1 h-0.5 rounded-full ${i <= current ? "bg-primary" : "bg-secondary"}`} />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "bg-primary/15 text-primary border-2 border-primary"
                    : "bg-secondary text-muted-foreground border border-border"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${done ? "bg-primary" : "bg-secondary"}`} />
              )}
            </div>
            <span className={`text-[10px] font-semibold ${active || done ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}