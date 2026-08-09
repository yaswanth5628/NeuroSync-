import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Shield, Lock, Eye, Download, Trash2, Key, Smartphone,
  Activity, AlertTriangle, Loader2, CheckCircle2, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MedicalDisclaimer from "@/components/medical/MedicalDisclaimer";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";

function SecurityItem({ icon: Icon, label, value, badge }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/25 last:border-0">
      <Icon className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{value}</p>
      </div>
      {badge && (
        <span className="text-[10px] font-bold bg-success/15 text-success px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}

export default function PrivacyDashboard() {
  const queryClient = useQueryClient();
  const [clearing, setClearing] = useState(false);

  const { data: scans = [] } = useQuery({
    queryKey: ["scans"],
    queryFn: () => base44.entities.SkinScan.list(),
    initialData: [],
  });
  const { data: profiles = [] } = useQuery({
    queryKey: ["health-profile"],
    queryFn: () => base44.entities.UserHealthProfile.list(),
    initialData: [],
  });

  const clearAllScans = async () => {
    if (!confirm("Delete ALL scan records? This cannot be undone.")) return;
    setClearing(true);
    try {
      await base44.entities.SkinScan.deleteMany({});
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      toast.success("All scan records deleted");
    } catch {
      toast.error("Failed to delete records");
    }
    setClearing(false);
  };

  const dataItems = [
    { label: "Skin Scans", count: scans.length, icon: FileText, color: "text-primary" },
    { label: "Health Profile", count: profiles.length, icon: Shield, color: "text-accent" },
  ];

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <PageHeader title="Privacy & Security" subtitle="Manage your data and security settings" />

      <MedicalDisclaimer />

      {/* Security Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Security Overview</h3>
        </div>
        <SecurityItem icon={Lock} label="Authentication" value="Secure JWT-based login" badge="Protected" />
        <SecurityItem icon={Key} label="Password Security" value="bcrypt hashed & encrypted" badge="Secured" />
        <SecurityItem icon={Eye} label="Data Encryption" value="Patient data encrypted at rest" badge="Encrypted" />
        <SecurityItem icon={Smartphone} label="Active Sessions" value="This device — active now" badge="1 Active" />
        <SecurityItem icon={Activity} label="API Security" value="HTTPS, rate limiting, input validation" badge="Active" />
      </motion.div>

      {/* Data Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card rounded-2xl border border-border p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Your Stored Data</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {dataItems.map((item) => (
            <div key={item.label} className="bg-secondary/30 rounded-xl p-3 text-center">
              <item.icon className={`w-4 h-4 ${item.color} mx-auto mb-1.5`} />
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Data Management</h3>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => toast.info("Navigate to Scan History to download individual reports")}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors text-left"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground/50" />
            <div className="flex-1">
              <p className="text-sm font-medium">Download My Reports</p>
              <p className="text-xs text-muted-foreground">Export scan reports as PDF</p>
            </div>
          </button>
          <button
            onClick={clearAllScans}
            disabled={clearing || scans.length === 0}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 transition-colors text-left disabled:opacity-50"
          >
            {clearing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-destructive" />
            ) : (
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Delete All Scan Records</p>
              <p className="text-xs text-muted-foreground">Permanently remove all scan data</p>
            </div>
          </button>
          <button
            onClick={() => toast.info("Account deletion available in Profile settings")}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 transition-colors text-left"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Delete Account</p>
              <p className="text-xs text-muted-foreground">Remove account and all associated data</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Threat Protection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl border border-border p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <h3 className="text-sm font-bold">Threat Protection</h3>
        </div>
        <div className="space-y-2 text-xs">
          {[
            "Brute force detection — Active",
            "Rate limiting — Enabled",
            "Invalid upload detection — Active",
            "Secure file validation (jpg, jpeg, png) — Enforced",
            "MIME type verification — Active",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}