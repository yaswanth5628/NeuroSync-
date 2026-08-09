import { Scan, Sun, Focus, Crop, Sparkles } from "lucide-react";
import ScanUploader from "./ScanUploader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const TIPS = [
  { icon: Sun, text: "Use good, natural lighting" },
  { icon: Focus, text: "Keep the camera steady and in focus" },
  { icon: Crop, text: "Fill most of the frame with the lesion" },
  { icon: Sparkles, text: "Avoid filters, glare, or heavy shadows" },
];

export default function CaptureStep({ imagePreviewUrl, onImageSelected, onContinue, disabled }) {
  return (
    <div className="glass-premium rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-primary/10">
          <Scan className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Capture Skin Image</h3>
          <p className="text-xs text-muted-foreground">A clear photo leads to a better assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TIPS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 rounded-xl bg-secondary/30 border border-border/40 p-2.5"
          >
            <t.icon className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-[11px] text-foreground/80 leading-tight">{t.text}</span>
          </motion.div>
        ))}
      </div>

      <ScanUploader onImageSelected={onImageSelected} disabled={disabled} />

      <Button
        onClick={onContinue}
        disabled={!imagePreviewUrl || disabled}
        className="w-full bg-primary hover:bg-primary/90 rounded-xl h-11 font-semibold disabled:opacity-40"
        style={imagePreviewUrl && !disabled ? { boxShadow: "0 0 24px hsl(199 89% 48% / 0.3)" } : {}}
      >
        Continue to Quality Check
      </Button>
    </div>
  );
}