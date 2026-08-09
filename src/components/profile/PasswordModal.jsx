import { useState, useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, CheckCircle2, Loader2 } from "lucide-react";

function calcStrength(pwd) {
  let score = 0;
  if (!pwd) return { score: 0, label: "", color: "" };
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score, label: "Weak", color: "bg-destructive", text: "text-destructive" };
  if (score <= 4) return { score, label: "Fair", color: "bg-warning", text: "text-warning" };
  if (score <= 5) return { score, label: "Good", color: "bg-primary", text: "text-primary" };
  return { score, label: "Strong", color: "bg-success", text: "text-success" };
}

export default function PasswordModal({ open, onClose }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const strength = useMemo(() => calcStrength(next), [next]);
  const mismatch = confirm.length > 0 && next !== confirm;
  const canSubmit = current.length >= 1 && next.length >= 8 && next === confirm && !submitting;

  const reset = () => {
    setCurrent(""); setNext(""); setConfirm("");
    setShow({ current: false, next: false, confirm: false });
    setSubmitting(false); setDone(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setDone(true);
    setTimeout(() => handleClose(), 2500);
  };

  const Field = ({ label, value, setter, showKey }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
        <Input
          type={show[showKey] ? "text" : "password"}
          value={value}
          onChange={(e) => setter(e.target.value)}
          className="pl-9 pr-9 rounded-xl h-9 bg-background/40"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => ({ ...s, [showKey]: !s[showKey] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show[showKey] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md rounded-2xl border-border">
        {done ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <DialogTitle className="text-base mb-1">Password Update Requested</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Your password change request has been noted. Full password management is coming soon.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-base">Change Password</DialogTitle>
              <DialogDescription className="text-xs">
                Enter your current password and a new one to update your credentials.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3.5">
              <Field label="Current Password" value={current} setter={setCurrent} showKey="current" />
              <Field label="New Password" value={next} setter={setNext} showKey="next" />
              {next.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${(strength.score / 6) * 100}%` }} />
                  </div>
                  <span className={`text-[10px] font-bold ${strength.text} w-10 text-right`}>{strength.label}</span>
                </div>
              )}
              <Field label="Confirm Password" value={confirm} setter={setConfirm} showKey="confirm" />
              {mismatch && <p className="text-[11px] text-destructive">Passwords do not match.</p>}
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border/40">
              <div className="w-2 h-2 rounded-full bg-warning shrink-0" />
              <p className="text-[11px] text-muted-foreground">Password management backend is coming soon. Your request will be noted.</p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={handleClose} className="h-9 rounded-xl text-sm">Cancel</Button>
              <Button onClick={handleSubmit} disabled={!canSubmit} className="h-9 px-5 rounded-xl text-sm">
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                {submitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}