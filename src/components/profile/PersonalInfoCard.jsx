import {
  User, Phone, Mail, Calendar, Heart, Globe, Languages, PhoneCall,
} from "lucide-react";
import SectionCard from "./SectionCard";
import EditableField from "./EditableField";

export default function PersonalInfoCard({ form, editMode, updateField }) {
  return (
    <SectionCard title="Personal Information" icon={User} delay={0.05}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        <EditableField
          icon={User}
          label="Full Name"
          value={form.full_name}
          onChange={(v) => updateField("full_name", v)}
          editMode={editMode}
          maxLength={100}
          placeholder="Enter your full name"
        />
        <EditableField
          icon={Mail}
          label="Email"
          value={form.email}
          editMode={false}
          plain
        />
        <EditableField
          icon={Phone}
          label="Phone Number"
          value={form.phone_number}
          onChange={(v) => updateField("phone_number", v)}
          editMode={editMode}
          type="tel"
          placeholder="+1 (555) 000-0000"
          maxLength={20}
        />
        <EditableField
          icon={Calendar}
          label="Date of Birth"
          value={form.date_of_birth}
          onChange={(v) => updateField("date_of_birth", v)}
          editMode={editMode}
          type="date"
        />
        <EditableField
          icon={Heart}
          label="Gender"
          value={form.gender}
          onChange={(v) => updateField("gender", v)}
          editMode={editMode}
          options={["Male", "Female", "Other"]}
          placeholder="Select gender"
        />
        <EditableField
          icon={Globe}
          label="Nationality"
          value={form.nationality}
          onChange={(v) => updateField("nationality", v)}
          editMode={editMode}
          placeholder="e.g. American"
          maxLength={50}
        />
        <EditableField
          icon={Languages}
          label="Language"
          value={form.language}
          onChange={(v) => updateField("language", v)}
          editMode={editMode}
          placeholder="e.g. English"
          maxLength={50}
        />
        <EditableField
          icon={PhoneCall}
          label="Emergency Contact"
          value={form.emergency_contact}
          onChange={(v) => updateField("emergency_contact", v)}
          editMode={editMode}
          placeholder="Name & phone number"
          maxLength={100}
        />
      </div>
    </SectionCard>
  );
}