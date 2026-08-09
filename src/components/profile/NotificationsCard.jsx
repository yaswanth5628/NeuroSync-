import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import SectionCard from "./SectionCard";

const NOTIF_ITEMS = [
  { key: "health", label: "Health Alerts", desc: "Heart rate, wellness reminders" },
  { key: "scans", label: "Scan Results", desc: "New scan analysis ready" },
  { key: "security", label: "Security Alerts", desc: "Login & account changes" },
];

export default function NotificationsCard({ prefs, setPrefs }) {
  return (
    <SectionCard title="Notifications" icon={Bell} delay={0.25}>
      <div className="space-y-0">
        {NOTIF_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-border/25 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-secondary/40 flex items-center justify-center shrink-0">
                <Bell className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
            <Switch
              checked={prefs[item.key] || false}
              onCheckedChange={(v) => {
                setPrefs((p) => ({ ...p, [item.key]: v }));
                toast.success(`${item.label} ${v ? "enabled" : "disabled"}.`);
              }}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}