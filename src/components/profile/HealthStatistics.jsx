import { motion } from "framer-motion";
import {
  HeartPulse, Droplet, Ruler, Activity, AlertCircle, Pill,
  ClipboardList, Cigarette, Wine, Droplets, Moon, Dumbbell, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionCard from "./SectionCard";
import EditableField from "./EditableField";

function calcBMI(heightCm, weightKg) {
  const h = Number(heightCm);
  const w = Number(weightKg);
  if (!h || !w || h <= 0) return null;
  const m = h / 100;
  return Math.round((w / (m * m)) * 10) / 10;
}

function bmiCategory(bmi) {
  if (bmi == null) return { label: "—", color: "text-muted-foreground" };
  if (bmi < 18.5) return { label: "Underweight", color: "text-warning" };
  if (bmi < 25) return { label: "Normal", color: "text-success" };
  if (bmi < 30) return { label: "Overweight", color: "text-warning" };
  return { label: "Obese", color: "text-destructive" };
}

function VitalTile({ icon: Icon, label, value, unit, color }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-secondary/30 border border-border/30 px-3 py-2.5">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}1a` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-base font-bold leading-none" style={{ color }}>
          {value ?? "--"}{unit && <span className="text-xs font-semibold text-muted-foreground ml-0.5">{unit}</span>}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function HealthStatistics({ form, editMode, updateField, onEdit, health = [], scansCount }) {
  const latest = health[0];
  const heartRate = latest?.heart_rate ?? null;
  const spo2 = latest?.spo2 ?? null;
  const bmi = calcBMI(form.height, form.weight);
  const bmiCat = bmiCategory(bmi);
  const hasMedicalData =
    form.allergies || form.medical_history || form.medications || form.existing_skin_conditions;

  return (
    <SectionCard title="Health Statistics" icon={HeartPulse} delay={0.1}>
      {/* Vitals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <VitalTile icon={HeartPulse} label="Heart Rate" value={heartRate} unit="bpm" color="hsl(0 72% 51%)" />
        <VitalTile icon={Droplet} label="Blood O₂" value={spo2} unit="%" color="hsl(199 89% 48%)" />
        <VitalTile icon={Activity} label="BMI" value={bmi} color="hsl(142 71% 45%)" />
        <VitalTile icon={FileText} label="Scans" value={scansCount} color="hsl(265 70% 60%)" />
      </div>
      {bmi != null && (
        <p className="text-[11px] text-muted-foreground -mt-3 mb-4">
          BMI category: <span className={`font-semibold ${bmiCat.color}`}>{bmiCat.label}</span>
        </p>
      )}

      {/* Biometrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        <EditableField
          icon={Droplet}
          label="Blood Group"
          value={form.blood_group}
          onChange={(v) => updateField("blood_group", v)}
          editMode={editMode}
          options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
          placeholder="Select blood group"
        />
        <EditableField
          icon={Droplets}
          label="Skin Type"
          value={form.skin_type}
          onChange={(v) => updateField("skin_type", v)}
          editMode={editMode}
          options={["oily", "dry", "combination", "sensitive", "normal"]}
          placeholder="Select skin type"
        />
        <EditableField
          icon={Ruler}
          label="Height"
          value={form.height}
          onChange={(v) => updateField("height", v)}
          editMode={editMode}
          type="number"
          placeholder="170"
          suffix="cm"
        />
        <EditableField
          icon={Ruler}
          label="Weight"
          value={form.weight}
          onChange={(v) => updateField("weight", v)}
          editMode={editMode}
          type="number"
          placeholder="65"
          suffix="kg"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border/40" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Medical & Lifestyle</span>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        <EditableField icon={AlertCircle} label="Known Allergies" value={form.allergies} onChange={(v) => updateField("allergies", v)} editMode={editMode} multiline placeholder="e.g. Penicillin, peanuts..." maxLength={500} />
        <EditableField icon={ClipboardList} label="Medical History" value={form.medical_history} onChange={(v) => updateField("medical_history", v)} editMode={editMode} multiline placeholder="Previous diagnoses, surgeries..." maxLength={1000} />
        <EditableField icon={Pill} label="Current Medications" value={form.medications} onChange={(v) => updateField("medications", v)} editMode={editMode} multiline placeholder="List any medications..." maxLength={500} />
        <EditableField icon={Activity} label="Skin Conditions" value={form.existing_skin_conditions} onChange={(v) => updateField("existing_skin_conditions", v)} editMode={editMode} multiline placeholder="e.g. Eczema, psoriasis..." maxLength={500} />
        <EditableField icon={Cigarette} label="Smoking" value={form.smoking} onChange={(v) => updateField("smoking", v)} editMode={editMode} options={["Never", "Occasionally", "Regularly", "Heavy Smoker"]} placeholder="Select" />
        <EditableField icon={Wine} label="Alcohol" value={form.alcohol} onChange={(v) => updateField("alcohol", v)} editMode={editMode} options={["Never", "Occasionally", "Regularly", "Heavy"]} placeholder="Select" />
        <EditableField icon={Droplets} label="Hydration Level" value={form.hydration_level} onChange={(v) => updateField("hydration_level", v)} editMode={editMode} options={["Low", "Average", "Good", "Excellent"]} placeholder="Select" />
        <EditableField icon={Moon} label="Sleep Hours" value={form.sleep_hours} onChange={(v) => updateField("sleep_hours", v)} editMode={editMode} type="number" placeholder="e.g. 7" suffix="hrs" />
        <EditableField icon={Dumbbell} label="Exercise Frequency" value={form.exercise_frequency} onChange={(v) => updateField("exercise_frequency", v)} editMode={editMode} options={["Never", "Rarely", "Sometimes", "Often", "Daily"]} placeholder="Select" />
      </div>

      {!hasMedicalData && !editMode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center py-5 mt-2">
          <div className="w-12 h-12 rounded-2xl bg-secondary/40 flex items-center justify-center mb-3">
            <ClipboardList className="w-5 h-5 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Complete your medical profile for better insights.</p>
          <Button size="sm" onClick={onEdit} className="h-8 px-4 text-xs rounded-xl">
            Complete Profile
          </Button>
        </motion.div>
      )}
    </SectionCard>
  );
}