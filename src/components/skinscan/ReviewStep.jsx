import { motion } from "framer-motion";
import { Eye, Pencil, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_OPTIONS, BASE_QUESTIONS, DYNAMIC_QUESTIONS } from "@/lib/scanQuestions";

export default function ReviewStep({ imageUrl, category, answers, onEditAnswers, onRetake, onAnalyze, analyzing }) {
  const catLabel = CATEGORY_OPTIONS.find((c) => c.value === category)?.label || "—";
  const questions = [...BASE_QUESTIONS, ...(DYNAMIC_QUESTIONS[category] || [])];
  const responses = questions
    .filter((q) => answers[q.id] != null && answers[q.id] !== "")
    .map((q) => ({ label: q.label, answer: String(answers[q.id]) }));

  return (
    <div className="glass-premium rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-primary/10">
          <Eye className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Review Your Assessment</h3>
          <p className="text-xs text-muted-foreground">Confirm everything looks right before analysis</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-secondary/20 shrink-0">
          <img src={imageUrl} alt="Review" className="w-24 h-24 object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">Concern: <span className="text-primary">{catLabel}</span></p>
          <p className="text-[11px] text-muted-foreground mt-1">{responses.length} answers provided</p>
          <div className="flex gap-1.5 mt-2">
            <Button variant="outline" size="sm" onClick={onEditAnswers} className="rounded-xl h-7 text-xs">
              <Pencil className="w-3 h-3 mr-1" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onRetake} className="rounded-xl h-7 text-xs">
              <RefreshCw className="w-3 h-3 mr-1" /> Retake
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-secondary/20 p-3 max-h-56 overflow-y-auto scrollbar-premium space-y-1.5">
        {responses.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">No answers provided yet.</p>
        ) : (
          responses.map((r, i) => (
            <div key={i} className="flex justify-between gap-3 text-xs">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-medium text-foreground text-right">{r.answer}</span>
            </div>
          ))
        )}
      </div>

      <Button
        onClick={onAnalyze}
        disabled={analyzing}
        className="w-full bg-primary hover:bg-primary/90 rounded-xl h-11 font-semibold disabled:opacity-40"
        style={!analyzing ? { boxShadow: "0 0 24px hsl(199 89% 48% / 0.3)" } : {}}
      >
        {analyzing ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
        ) : (
          <><Sparkles className="w-4 h-4 mr-2" /> Run AI Analysis</>
        )}
      </Button>
    </div>
  );
}