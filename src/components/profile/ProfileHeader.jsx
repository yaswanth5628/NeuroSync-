import { useRef } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Camera, Edit3, Save, X, RotateCcw, Loader2, CheckCircle2,
  Mail, Calendar, Trash2, FileText, HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileHeader({
  user,
  form,
  editMode,
  saving,
  uploadingPhoto,
  scansCount,
  healthCount,
  onEdit,
  onSave,
  onCancel,
  onReset,
  onPhotoUpload,
  onPhotoRemove,
}) {
  const fileRef = useRef(null);
  const fullName = form.full_name?.trim() || "NeuroSync User";
  const initials =
    fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "NS";
  const photoUrl = form.profile_photo_url;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onPhotoUpload(file);
    e.target.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-3xl card-lift"
    >
      {/* Blue gradient banner */}
      <div
        className="h-24"
        style={{
          background:
            "linear-gradient(120deg, hsl(211 100% 50%) 0%, hsl(199 89% 48%) 50%, hsl(217 91% 60%) 100%)",
        }}
      >
        <div className="absolute -top-8 right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="glass-premium px-5 sm:px-7 pb-5 pt-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-card flex items-center justify-center text-2xl font-bold text-white"
              style={{
                background: photoUrl
                  ? undefined
                  : "linear-gradient(135deg, hsl(199 89% 48%), hsl(217 91% 60%))",
                boxShadow: "0 8px 28px hsl(199 89% 48% / 0.3)",
              }}
            >
              {uploadingPhoto ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-2xl flex items-center justify-center border-2 border-card hover:bg-primary/90 transition-colors cursor-pointer">
              {uploadingPhoto ? (
                <Loader2 className="w-3.5 h-3.5 text-primary-foreground animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-primary-foreground" />
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left sm:pb-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <h2 className="text-xl font-extrabold tracking-tight">{fullName}</h2>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/20">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start mt-1.5">
              <Mail className="w-3 h-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{user?.email?.toLowerCase() || "No email on file"}</p>
            </div>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
              <Calendar className="w-3 h-3 text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground/60">
                Member since {user?.created_date ? format(new Date(user.created_date), "MMMM yyyy") : "—"}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 justify-center sm:pb-1 flex-wrap">
            {editMode ? (
              <>
                <Button size="sm" onClick={onSave} disabled={saving} className="h-8 px-4 text-xs rounded-xl">
                  {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 px-3 text-xs rounded-xl">
                  <X className="w-3 h-3 mr-1" /> Cancel
                </Button>
                <Button size="sm" variant="ghost" onClick={onReset} className="h-8 px-3 text-xs rounded-xl text-muted-foreground">
                  <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
                {photoUrl && (
                  <Button size="sm" variant="ghost" onClick={onPhotoRemove} className="h-8 px-3 text-xs rounded-xl text-destructive">
                    <Trash2 className="w-3 h-3 mr-1" /> Photo
                  </Button>
                )}
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={onEdit} className="h-8 px-4 text-xs rounded-xl">
                <Edit3 className="w-3 h-3 mr-1" /> Edit
              </Button>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <Stat icon={FileText} label="Scans" value={scansCount} color="text-primary" />
          <Stat icon={HeartPulse} label="Health Logs" value={healthCount} color="text-accent" />
          <Stat icon={CheckCircle2} label="Status" value="Active" color="text-success" />
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-secondary/30 border border-border/30 px-3 py-2.5">
      <div className="w-8 h-8 rounded-xl bg-background/60 flex items-center justify-center shrink-0">
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className={`text-base font-bold tabular-nums leading-none ${color}`}>{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">{label}</p>
      </div>
    </div>
  );
}