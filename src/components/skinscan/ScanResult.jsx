import { AlertTriangle, CheckCircle, Info, ShieldAlert, Heart, Stethoscope, Lightbulb, AlertCircle, Activity, Download, Brain, ListTree, Pill, Shield, ClipboardList, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const severityConfig = {
  mild:     { label: "Mild", color: "text-success", bg: "bg-success/10 border-success/20", dot: "bg-success", ring: "hsl(142 71% 45%)" },
  moderate: { label: "Moderate", color: "text-warning", bg: "bg-warning/10 border-warning/20", dot: "bg-warning", ring: "hsl(38 92% 50%)" },
  urgent:   { label: "Urgent", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", dot: "bg-destructive", ring: "hsl(0 72% 51%)" },
};

const URGENCY_LABELS = {
  routine: "Routine care",
  soon: "See a doctor soon",
  urgent: "Urgent — seek care",
};

function InfoCard({ icon: Icon, title, content, color = "text-primary", bg = "bg-primary/8 border-primary/15", index = 0 }) {
  if (!content) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={`rounded-2xl border p-4 card-lift ${bg}`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div className="p-1.5 rounded-lg bg-background/40">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
        </div>
        <h4 className={`text-xs font-bold uppercase tracking-wider ${color}`}>{title}</h4>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{content}</p>
    </motion.div>
  );
}

export default function ScanResult({ result }) {
  const sev = severityConfig[result.severity] || severityConfig.mild;
  const confidence = Math.round(result.confidence || 0);
  const scanId = result.report_id || result.id;
  let parsedQuestionnaire = null;
  try { parsedQuestionnaire = result.questionnaire ? JSON.parse(result.questionnaire) : null; } catch { parsedQuestionnaire = null; }
  const urgencyLabel = URGENCY_LABELS[result.estimated_urgency];

  return (
    <div className="space-y-4 animate-page-enter">
      {/* Main Result Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-premium rounded-2xl border border-border p-5 card-lift"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Activity className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Analysis Result</h3>
        </div>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Detected Condition</p>
            <h3 className="text-xl font-bold text-foreground leading-tight">{result.condition_name}</h3>
            {result.description && (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{result.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* Confidence */}
            <div className="text-center">
              <div className="text-3xl font-bold text-primary tabular-nums">
                <AnimatedCounter value={confidence} suffix="%" duration={1200} />
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Confidence</div>
            </div>
            {/* Severity */}
            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${sev.bg} ${sev.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
              {sev.label}
            </span>
            {result.dermatologist_recommended != null && (
              <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${result.dermatologist_recommended ? "bg-accent/10 border-accent/20 text-accent" : "bg-success/10 border-success/20 text-success"}`}>
                <Stethoscope className="w-3 h-3" />
                {result.dermatologist_recommended ? "Dermatologist advised" : "Self-care OK"}
              </span>
            )}
            {urgencyLabel && (
              <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border bg-secondary border-border text-muted-foreground">
                <Clock className="w-3 h-3" />
                {urgencyLabel}
              </span>
            )}
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">AI Confidence</span>
            <span className="text-[10px] font-bold text-primary">{confidence}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full bg-primary"
              style={{ boxShadow: `0 0 12px ${sev.ring}40` }}
            />
          </div>
        </div>

        {scanId && (
          <div className="flex gap-2 mt-4">
            <Link to={`/DiseaseDetail/${scanId}`}>
              <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs">
                <Info className="w-3 h-3 mr-1" /> Full Details
              </Button>
            </Link>
            <Link to={`/report/${scanId}`}>
              <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs">
                <Download className="w-3 h-3 mr-1" /> Save Report
              </Button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Detail Cards */}
      <div className="grid gap-3">
        <InfoCard
          icon={Info}
          title="Common Causes"
          content={result.causes}
          color="text-primary"
          bg="bg-primary/8 border-primary/15"
          index={0}
        />
        <InfoCard
          icon={CheckCircle}
          title="Common Symptoms"
          content={result.symptoms}
          color="text-accent"
          bg="bg-accent/8 border-accent/15"
          index={1}
        />
        <InfoCard
          icon={ShieldAlert}
          title="Precautions"
          content={result.precautions}
          color="text-warning"
          bg="bg-warning/8 border-warning/15"
          index={2}
        />
        <InfoCard
          icon={Heart}
          title="Self-Care Tips"
          content={result.self_care}
          color="text-success"
          bg="bg-success/8 border-success/15"
          index={3}
        />
        {result.treatment_note && (
          <InfoCard
            icon={Lightbulb}
            title="Treatment Note"
            content={result.treatment_note}
            color="text-primary"
            bg="bg-primary/8 border-primary/15"
            index={4}
          />
        )}
        <InfoCard
          icon={Stethoscope}
          title="When to See a Doctor"
          content={result.when_to_see_doctor}
          color="text-accent"
          bg="bg-accent/8 border-accent/15"
          index={5}
        />
        <InfoCard
          icon={AlertTriangle}
          title="Emergency Warning Signs"
          content={result.warning_signs}
          color="text-destructive"
          bg="bg-destructive/8 border-destructive/15"
          index={6}
        />
      </div>

      {/* Enhanced clinical sections */}
      {(result.clinical_reasoning || result.differential_diagnoses || result.otc_recommendations || result.red_flag_symptoms || result.prevention_advice) && (
        <div className="grid gap-3">
          <InfoCard icon={Brain} title="Clinical Reasoning" content={result.clinical_reasoning} color="text-primary" bg="bg-primary/8 border-primary/15" index={0} />
          <InfoCard icon={ListTree} title="Differential Diagnoses" content={result.differential_diagnoses} color="text-accent" bg="bg-accent/8 border-accent/15" index={1} />
          <InfoCard icon={Pill} title="OTC Recommendations" content={result.otc_recommendations} color="text-success" bg="bg-success/8 border-success/15" index={2} />
          <InfoCard icon={AlertTriangle} title="Red Flag Symptoms" content={result.red_flag_symptoms} color="text-destructive" bg="bg-destructive/8 border-destructive/15" index={3} />
          <InfoCard icon={Shield} title="Prevention Advice" content={result.prevention_advice} color="text-primary" bg="bg-primary/8 border-primary/15" index={4} />
        </div>
      )}

      {/* Patient questionnaire */}
      {parsedQuestionnaire?.responses?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border p-4 bg-secondary/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <ClipboardList className="w-3.5 h-3.5 text-primary" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Your Assessment Responses</h4>
          </div>
          <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-premium">
            {parsedQuestionnaire.responses.map((r, i) => (
              <div key={i} className="flex justify-between gap-3 text-xs">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-medium text-foreground text-right">{r.answer}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-start gap-3 bg-secondary/40 rounded-2xl border border-border/50 p-4"
      >
        <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground/70">Disclaimer: </span>
          This analysis is for preliminary screening and educational support only. It is <strong>not a medical diagnosis</strong>. Results may vary and should not replace professional medical advice. Always consult a qualified dermatologist or healthcare provider for an accurate diagnosis and appropriate treatment.
        </p>
      </motion.div>
    </div>
  );
}