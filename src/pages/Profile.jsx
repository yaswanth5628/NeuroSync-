import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { LogOut, Link2, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import HealthStatistics from "@/components/profile/HealthStatistics";
import ReportsHistory from "@/components/profile/ReportsHistory";
import SettingsCard from "@/components/profile/SettingsCard";
import NotificationsCard from "@/components/profile/NotificationsCard";
import PasswordModal from "@/components/profile/PasswordModal";
import DevicesModal from "@/components/profile/DevicesModal";
import ComingSoonModal from "@/components/profile/ComingSoonModal";
import DeleteAccountSection from "@/components/profile/DeleteAccountSection";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EMPTY_FORM = {
  full_name: "", email: "", phone_number: "", date_of_birth: "",
  height: "", weight: "", nationality: "", language: "",
  emergency_contact: "", profile_photo_url: "", gender: "",
  blood_group: "", skin_type: "", allergies: "", medical_history: "",
  medications: "", existing_skin_conditions: "", smoking: "",
  alcohol: "", hydration_level: "", sleep_hours: "", exercise_frequency: "",
};

const DEFAULT_NOTIF = { health: true, scans: true, security: true };

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [originalForm, setOriginalForm] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("ns_theme") || "dark");
  const [notifPrefs, setNotifPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem("ns_notif_prefs");
      return saved ? { ...DEFAULT_NOTIF, ...JSON.parse(saved) } : { ...DEFAULT_NOTIF };
    } catch { return { ...DEFAULT_NOTIF }; }
  });
  const [modal, setModal] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: hpData } = useQuery({
    queryKey: ["health-profile"],
    queryFn: () => base44.entities.UserHealthProfile.list("-created_date", 1),
  });
  const { data: scans = [] } = useQuery({ queryKey: ["scans"], queryFn: () => base44.entities.SkinScan.list(), initialData: [] });
  const { data: health = [] } = useQuery({ queryKey: ["health"], queryFn: () => base44.entities.HealthRecord.list(), initialData: [] });

  const healthProfile = hpData?.[0];

  useEffect(() => {
    if (user && !editMode) {
      setForm((f) => ({
        ...f,
        full_name: user.full_name || "",
        email: (user.email || "").toLowerCase(),
        phone_number: user.phone_number || "",
        date_of_birth: user.date_of_birth || "",
        height: user.height || "",
        weight: user.weight || "",
        nationality: user.nationality || "",
        language: user.language || "",
        emergency_contact: user.emergency_contact || "",
        profile_photo_url: user.profile_photo_url || "",
        smoking: user.smoking || "",
        alcohol: user.alcohol || "",
        hydration_level: user.hydration_level || "",
        sleep_hours: user.sleep_hours || "",
        exercise_frequency: user.exercise_frequency || "",
      }));
    }
  }, [user, editMode]);

  useEffect(() => {
    if (healthProfile && !editMode) {
      setForm((f) => ({
        ...f,
        gender: healthProfile.gender || "",
        blood_group: healthProfile.blood_group || "",
        skin_type: healthProfile.skin_type || "",
        allergies: healthProfile.allergies || "",
        medical_history: healthProfile.medical_history || "",
        medications: healthProfile.medications || "",
        existing_skin_conditions: healthProfile.existing_skin_conditions || "",
      }));
    }
  }, [healthProfile, editMode]);

  useEffect(() => {
    localStorage.setItem("ns_theme", theme);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = theme === "dark" || (theme === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", useDark);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ns_notif_prefs", JSON.stringify(notifPrefs));
  }, [notifPrefs]);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const hasUnsavedChanges = () => {
    if (!originalForm) return false;
    return Object.keys(form).some((key) => {
      const cur = (form[key] ?? "").toString().trim();
      const orig = (originalForm[key] ?? "").toString().trim();
      return cur !== orig;
    });
  };

  const handleEdit = () => { setOriginalForm({ ...form }); setEditMode(true); };
  const handleCancel = () => {
    if (hasUnsavedChanges()) { setConfirmDialog("cancel"); return; }
    if (originalForm) setForm({ ...originalForm });
    setEditMode(false);
  };
  const handleReset = () => { if (originalForm) setForm({ ...originalForm }); toast.info("Form reset to original values."); };

  const validate = () => {
    if (!form.full_name?.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }
    if (form.date_of_birth) {
      const dob = new Date(form.date_of_birth);
      if (isNaN(dob.getTime()) || dob > new Date()) { toast.error("Please enter a valid date of birth."); return false; }
    }
    if (form.sleep_hours && (Number(form.sleep_hours) < 0 || Number(form.sleep_hours) > 24)) {
      toast.error("Sleep hours must be between 0 and 24."); return false;
    }
    if (form.phone_number && form.phone_number.replace(/\D/g, "").length < 7) {
      toast.error("Please enter a valid phone number."); return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!user?.id) { toast.error("Unable to save. Please refresh the page and try again."); return; }
    setSaving(true);
    try {
      const userData = {
        full_name: form.full_name?.trim() || "",
        phone_number: form.phone_number?.trim() || "",
        date_of_birth: form.date_of_birth || "",
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        nationality: form.nationality?.trim() || "",
        language: form.language?.trim() || "",
        emergency_contact: form.emergency_contact?.trim() || "",
        profile_photo_url: form.profile_photo_url || "",
        smoking: form.smoking || "",
        alcohol: form.alcohol || "",
        hydration_level: form.hydration_level || "",
        sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
        exercise_frequency: form.exercise_frequency || "",
      };
      await base44.entities.User.update(user.id, userData);

      const healthData = {
        gender: form.gender ? form.gender.charAt(0).toUpperCase() + form.gender.slice(1).toLowerCase() : undefined,
        blood_group: form.blood_group || undefined,
        skin_type: form.skin_type || undefined,
        allergies: form.allergies?.trim() || undefined,
        medical_history: form.medical_history?.trim() || undefined,
        medications: form.medications?.trim() || undefined,
        existing_skin_conditions: form.existing_skin_conditions?.trim() || undefined,
      };
      if (healthProfile?.id) {
        await base44.entities.UserHealthProfile.update(healthProfile.id, healthData);
      } else {
        await base44.entities.UserHealthProfile.create(healthData);
      }

      queryClient.setQueryData(["me"], (old) => (old ? { ...old, ...userData } : old));
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.invalidateQueries({ queryKey: ["health-profile"] });
      await refreshUser();

      toast.success("Profile updated successfully.");
      setEditMode(false);
    } catch (err) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB."); return; }
    if (!user?.id) { toast.error("Unable to upload. Please refresh the page."); return; }
    setUploadingPhoto(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.User.update(user.id, { profile_photo_url: file_url });
      setForm((f) => ({ ...f, profile_photo_url: file_url }));
      queryClient.setQueryData(["me"], (old) => (old ? { ...old, profile_photo_url: file_url } : old));
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await refreshUser();
      toast.success("Profile photo updated.");
    } catch (err) {
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoRemove = () => setConfirmDialog("remove-photo");

  const confirmPhotoRemove = async () => {
    setConfirmDialog(null);
    if (!user?.id) return;
    try {
      await base44.entities.User.update(user.id, { profile_photo_url: "" });
      setForm((f) => ({ ...f, profile_photo_url: "" }));
      queryClient.setQueryData(["me"], (old) => (old ? { ...old, profile_photo_url: "" } : old));
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await refreshUser();
      toast.success("Profile photo removed.");
    } catch (err) {
      toast.error("Failed to remove photo.");
    }
  };

  const handleAccountAction = (type) => {
    if (type === "password") setModal("password");
    else if (type === "2fa") setModal("2fa");
    else if (type === "devices") setModal("devices");
  };

  const handleConnectedAccount = (name) => setModal(`connected-${name}`);

  const comingSoonContent = {
    "2fa": { icon: Shield, title: "Two-Factor Authentication", description: "Two-Factor Authentication (2FA) adds an extra layer of security to your NeuroSync account by requiring a second verification step at login. This feature will be available in a future update to keep your medical data even more secure." },
    "connected-Google": { icon: Link2, title: "Google Account", description: "Google account integration allows you to sign in with Google, sync contacts, and back up your health data. Full account management, including disconnect, will be available in a future update." },
    "connected-Apple ID": { icon: Link2, title: "Apple ID", description: "Apple ID integration enables Sign in with Apple and iCloud backup for your health records. This integration will be available in a future update." },
    "connected-Phone Number": { icon: Smartphone, title: "Phone Number", description: "Phone number verification enhances account security and enables SMS-based notifications. You can update your phone number in the Personal Information section above." },
  };

  const activeComingSoon = modal && modal !== "password" && modal !== "devices" ? comingSoonContent[modal] : null;

  return (
    <div className="space-y-4 max-w-3xl mx-auto animate-page-enter pb-4">
      <ProfileHeader
        user={user}
        form={form}
        editMode={editMode}
        saving={saving}
        uploadingPhoto={uploadingPhoto}
        scansCount={scans.length}
        healthCount={health.length}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onReset={handleReset}
        onPhotoUpload={handlePhotoUpload}
        onPhotoRemove={handlePhotoRemove}
      />

      <PersonalInfoCard form={form} editMode={editMode} updateField={updateField} />
      <HealthStatistics
        form={form}
        editMode={editMode}
        updateField={updateField}
        onEdit={handleEdit}
        health={health}
        scansCount={scans.length}
      />
      <ReportsHistory scans={scans} />
      <SettingsCard
        user={user}
        theme={theme}
        onThemeChange={setTheme}
        onAction={handleAccountAction}
        onConnectedAccount={handleConnectedAccount}
        phoneLinked={!!form.phone_number}
      />
      <NotificationsCard prefs={notifPrefs} setPrefs={setNotifPrefs} />

      <Button
        variant="outline"
        onClick={() => setConfirmDialog("sign-out")}
        className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 rounded-xl h-10 font-semibold"
      >
        <LogOut className="w-4 h-4 mr-2" /> Sign Out of NeuroSync
      </Button>

      <DeleteAccountSection user={user} />

      {/* Confirmation Dialogs */}
      <AlertDialog open={confirmDialog === "cancel"} onOpenChange={(o) => !o && setConfirmDialog(null)}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Keep Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (originalForm) setForm({ ...originalForm }); setEditMode(false); setConfirmDialog(null); }}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDialog === "remove-photo"} onOpenChange={(o) => !o && setConfirmDialog(null)}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove profile photo?</AlertDialogTitle>
            <AlertDialogDescription>
              Your profile photo will be permanently removed. You can upload a new one anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPhotoRemove}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDialog === "sign-out"} onOpenChange={(o) => !o && setConfirmDialog(null)}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of NeuroSync?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your health data and scans.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => base44.auth.logout()}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PasswordModal open={modal === "password"} onClose={() => setModal(null)} />
      <DevicesModal open={modal === "devices"} onClose={() => setModal(null)} />
      <ComingSoonModal
        open={!!activeComingSoon}
        onClose={() => setModal(null)}
        icon={activeComingSoon?.icon}
        title={activeComingSoon?.title}
        description={activeComingSoon?.description}
      />
    </div>
  );
}