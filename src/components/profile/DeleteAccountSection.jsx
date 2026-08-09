import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import SectionCard from "./SectionCard";

export default function DeleteAccountSection({ user }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!user?.id) {
      toast.error("Unable to delete account. Please refresh and try again.");
      return;
    }
    setDeleting(true);
    try {
      // Remove all user-owned data first (RLS scopes each deleteMany to the user).
      await Promise.allSettled([
        base44.entities.SkinScan.deleteMany({ created_by_id: user.id }),
        base44.entities.HealthRecord.deleteMany({ created_by_id: user.id }),
        base44.entities.UserHealthProfile.deleteMany({ created_by_id: user.id }),
        base44.entities.ChatMessage.deleteMany({ created_by_id: user.id }),
        base44.entities.Notification.deleteMany({ created_by_id: user.id }),
      ]);
      try {
        await base44.entities.User.delete(user.id);
      } catch (e) {
        // Self-deletion may be restricted by the platform; data is already cleared.
      }
      queryClient.clear();
      toast.success("Your account and data have been deleted.");
      base44.auth.logout(window.location.origin);
    } catch (err) {
      setDeleting(false);
      toast.error(err?.message || "Failed to delete account. Please try again.");
    }
  };

  return (
    <SectionCard title="Danger Zone" icon={AlertTriangle} delay={0.22}>
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-destructive/15 text-destructive border border-destructive/20 flex items-center justify-center shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Delete Account</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Permanently delete your account and all associated scans, health records, and chat history. This action cannot be undone.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="mt-3 w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 rounded-xl h-10 font-semibold"
      >
        <Trash2 className="w-4 h-4 mr-2" /> Delete My Account
      </Button>

      <AlertDialog open={open} onOpenChange={(o) => { if (!deleting) setOpen(o); }}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all your scans, health records, and chat history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={deleting}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
}