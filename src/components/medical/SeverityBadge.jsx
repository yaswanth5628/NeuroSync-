const SEVERITY_CONFIG = {
  mild: { label: "Low", color: "bg-success/15 text-success border-success/20", dot: "bg-success" },
  moderate: { label: "Moderate", color: "bg-warning/15 text-warning border-warning/20", dot: "bg-warning" },
  urgent: { label: "Severe", color: "bg-destructive/15 text-destructive border-destructive/20", dot: "bg-destructive" },
};

export default function SeverityBadge({ severity, size = "default" }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.mild;
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      } font-bold rounded-full border ${config.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}