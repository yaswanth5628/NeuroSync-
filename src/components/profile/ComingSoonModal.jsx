import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ComingSoonModal({ open, onClose, icon: Icon, title, description }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md rounded-2xl border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            <DialogTitle className="text-base">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed text-left">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border/40">
          <div className="w-2 h-2 rounded-full bg-warning shrink-0 animate-pulse" />
          <p className="text-xs text-muted-foreground">
            This feature is currently in development and will be available in a future update.
          </p>
        </div>
        <div className="flex justify-end pt-1">
          <Button onClick={onClose} className="h-9 px-5 rounded-xl text-sm">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}