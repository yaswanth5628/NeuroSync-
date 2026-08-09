import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Settings, Moon, Sun, Monitor, Shield, Mail, KeyRound, Smartphone,
  Lock, CheckCircle2, Clock, ChevronRight, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import SectionCard from "./SectionCard";
import { getDeviceInfo } from "@/lib/deviceInfo";

const THEMES = [
  { key: "dark", label: "Dark", icon: Moon },
  { key: "light", label: "Light", icon: Sun },
  { key: "system", label: "System", icon: Monitor },
];

const CONNECTED = [
  { name: "Google", icon: "G", color: "bg-red-500/15 text-red-400 border-red-500/20", status: "Connected", action: "Manage" },
  { name: "Apple ID", icon: "", color: "bg-secondary border-border/50 text-foreground", status: "Not connected", action: "Connect" },
];

function Row({ icon: Icon, label, value, badge, badgeColor, to, onClick }) {
  const inner = (
    <div className={`flex items-center gap-3 py-3 border-b border-border/25 last:border-0 ${onClick || to ? "cursor-pointer hover:bg-secondary/20 -mx-1 px-1 rounded-lg transition-colors group" : ""}`}>
      <div className="w-7 h-7 rounded-lg bg-secondary/40 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{value}</p>
      </div>
      {badge && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeColor || "bg-success/15 text-success"}`}>
          {badge}
        </span>
      )}
      {(onClick || to) && <ChevronRight className="w-4 h-4 text-muted-foreground/25 group-hover:text-primary/50 shrink-0" />}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : <div onClick={onClick}>{inner}</div>;
}

export default function SettingsCard({ user, theme, onThemeChange, onAction, onConnectedAccount, phoneLinked }) {
  const { browser, os } = getDeviceInfo();
  const userId = user?.id ? `${user.id.slice(0, 8)}...${user.id.slice(-4)}` : "—";
  const memberSince = user?.created_date ? format(new Date(user.created_date), "MMM d, yyyy") : "—";

  return (
    <SectionCard title="Settings" icon={Settings} delay={0.2}>
      {/* Theme */}
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">Appearance</p>
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {THEMES.map((t) => (
          <button
            key={t.key}
            onClick={() => { onThemeChange(t.key); toast.success(`${t.label} theme applied.`); }}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
              theme === t.key ? "border-primary bg-primary/8" : "border-border/40 hover:border-border/70 bg-secondary/20"
            }`}
          >
            <t.icon className={`w-4 h-4 ${theme === t.key ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-xs font-bold ${theme === t.key ? "text-primary" : "text-muted-foreground"}`}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Security */}
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Security & Account</p>
      <Row icon={Mail} label="Email" value={user?.email?.toLowerCase() || "Not available"} badge="Verified" />
      <Row icon={KeyRound} label="User ID" value={userId} />
      <Row icon={CheckCircle2} label="Account Status" value="Active & in good standing" badge="Active" />
      <Row icon={Lock} label="Change Password" value="Update your password" onClick={() => onAction("password")} />
      <Row icon={Smartphone} label="Login Devices" value={`${browser} · ${os} · 1 active`} onClick={() => onAction("devices")} />
      <Row icon={Shield} label="Two-Factor Authentication" value="Add an extra layer of security" badge="Off" badgeColor="bg-warning/15 text-warning" onClick={() => onAction("2fa")} />
      <Row icon={ShieldCheck} label="Privacy & Security" value="Manage your data & privacy" to="/PrivacyDashboard" />
      <Row icon={Clock} label="Member Since" value={memberSince} />

      {/* Connected Accounts */}
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 mt-3">Connected Accounts</p>
      {CONNECTED.map((acc) => (
        <div key={acc.name} className="flex items-center justify-between py-3 border-b border-border/25 last:border-0">
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${acc.color}`}>{acc.icon}</div>
            <div>
              <p className="text-sm font-medium">{acc.name}</p>
              <p className="text-[11px] text-muted-foreground">{acc.status}</p>
            </div>
          </div>
          <button onClick={() => onConnectedAccount(acc.name)} className="text-[11px] text-primary hover:text-primary/80 font-semibold transition-colors">
            {acc.action}
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-success/15 text-success border border-success/20 flex items-center justify-center text-sm">📱</div>
          <div>
            <p className="text-sm font-medium">Phone Number</p>
            <p className="text-[11px] text-muted-foreground">{phoneLinked ? "Verified" : "Not linked"}</p>
          </div>
        </div>
        <button onClick={() => onConnectedAccount("Phone Number")} className="text-[11px] text-primary hover:text-primary/80 font-semibold transition-colors">
          {phoneLinked ? "Manage" : "Link"}
        </button>
      </div>
    </SectionCard>
  );
}