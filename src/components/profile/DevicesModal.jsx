import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Smartphone, Monitor, CheckCircle2, Clock } from "lucide-react";
import { getDeviceInfo } from "@/lib/deviceInfo";
import { format } from "date-fns";

export default function DevicesModal({ open, onClose }) {
  const { browser, os } = getDeviceInfo();
  const now = format(new Date(), "MMM d, yyyy 'at' h:mm a");

  const devices = [
    { name: "This Device", browser, os, status: "Active now", lastActive: "Current session", current: true },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="text-base">Login Devices</DialogTitle>
          <DialogDescription className="text-xs">
            Devices currently signed into your NeuroSync account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2.5">
          {devices.map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-secondary/20">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Monitor className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{d.name}</p>
                  {d.current && (
                    <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-success/15 text-success">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{d.browser} · {d.os}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground/50" />
                  <p className="text-[11px] text-muted-foreground/60">{d.lastActive}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
                <div className="w-1.5 h-1.5 rounded-full bg-success" /> {d.status}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border/40">
          <Smartphone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground">
            Detailed session history and remote device management will be available in a future update. Session started {now}.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}