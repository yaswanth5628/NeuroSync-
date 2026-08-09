import { Shield, Lock, Eye, Brain } from "lucide-react";

const BADGES = [
  { icon: Shield, label: "Secure Authentication" },
  { icon: Lock, label: "Encrypted Records" },
  { icon: Eye, label: "Privacy First" },
  { icon: Brain, label: "Medical-grade AI" },
];

export default function TrustBadges({ variant = "card" }) {
  if (variant === "hero") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 backdrop-blur-sm"
          >
            <Icon className="w-4 h-4 text-white/70 shrink-0" />
            <span className="text-xs font-medium text-white/80">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {BADGES.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="w-3 h-3" />
          <span className="text-[11px] font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}