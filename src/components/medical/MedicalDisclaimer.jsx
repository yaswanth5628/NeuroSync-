import { AlertCircle } from "lucide-react";

export default function MedicalDisclaimer({ variant = "banner" }) {
  if (variant === "compact") {
    return (
      <p className="text-[10px] text-muted-foreground/60 italic leading-relaxed">
        NeuroSync is an AI-powered screening assistant for educational purposes only. Not a medical diagnosis. Always consult a qualified dermatologist.
      </p>
    );
  }

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-warning/20 bg-warning/5 p-3">
      <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-semibold text-warning">Medical Disclaimer:</span> NeuroSync is an AI-powered screening assistant designed for educational and early screening purposes only. It does not replace professional medical diagnosis, treatment, or advice. Always consult a qualified dermatologist regarding any medical condition.
      </p>
    </div>
  );
}