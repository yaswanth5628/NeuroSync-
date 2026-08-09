import { motion } from "framer-motion";
import { ClipboardList, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_QUESTIONS, CATEGORY_OPTIONS, DYNAMIC_QUESTIONS } from "@/lib/scanQuestions";

function AnswerInput({ question, value, onChange }) {
  if (question.type === "yesno") {
    return (
      <div className="flex gap-2">
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              value === opt
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }
  if (question.type === "select") {
    return (
      <div className="flex flex-wrap gap-1.5">
        {question.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              value === opt
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }
  return (
    <Input
      type={question.type === "number" ? "number" : "text"}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      className="rounded-xl"
    />
  );
}

export default function QuestionnaireStep({ category, setCategory, answers, setAnswer, onContinue, onBack }) {
  const dynamic = DYNAMIC_QUESTIONS[category] || [];
  const questions = [...BASE_QUESTIONS, ...dynamic];

  return (
    <div className="glass-premium rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-primary/10">
          <ClipboardList className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Quick Assessment</h3>
          <p className="text-xs text-muted-foreground">A few questions to guide the analysis</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-foreground mb-2">What best describes your concern?</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                category === c.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.2) }}
            className="space-y-1.5"
          >
            <label className="text-xs font-medium text-foreground/80 flex items-center gap-1">
              {q.label}
              {q.optional && <span className="text-muted-foreground/60 font-normal">(optional)</span>}
            </label>
            <AnswerInput question={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="outline" onClick={onBack} className="rounded-xl h-10">Back</Button>
        <Button onClick={onContinue} className="flex-1 bg-primary hover:bg-primary/90 rounded-xl h-10 font-semibold">
          Review Answers <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}