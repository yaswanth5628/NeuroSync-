import { useEffect, useState } from "react";
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { analyzeImageQuality } from "@/lib/imageQuality";

export default function QualityCheckStep({ imageUrl, onRetake, onContinue }) {
  const [status, setStatus] = useState("checking");
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    setStatus("checking");
    analyzeImageQuality(imageUrl)
      .then((r) => {
        if (active) {
          setResult(r);
          setStatus(r.ok ? "ok" : "poor");
        }
      })
      .catch(() => {
        if (active) {
          setResult({ ok: false, issues: [{ key: "error", message: "Could not analyze the image. Please retake." }] });
          setStatus("poor");
        }
      });
    return () => { active = false; };
  }, [imageUrl]);

  return (
    <div className="glass-premium rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-primary/10">
          <ShieldCheck className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Image Quality Check</h3>
          <p className="text-xs text-muted-foreground">Verifying your photo before analysis</p>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-secondary/20">
        <img src={imageUrl} alt="Quality check" className="w-full max-h-72 object-contain" />
        {status === "checking" && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Loader2 className="w-4 h-4 animate-spin" /> Checking quality...
            </div>
          </div>
        )}
        {status === "ok" && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] bg-success/10 backdrop-blur px-3 py-1.5 rounded-full border border-success/20 text-success font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Quality good
          </div>
        )}
        {status === "poor" && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] bg-destructive/10 backdrop-blur px-3 py-1.5 rounded-full border border-destructive/20 text-destructive font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> Needs improvement
          </div>
        )}
      </div>

      {status === "checking" && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 rounded bg-secondary/50 animate-pulse" />
          ))}
        </div>
      )}

      {status === "ok" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <p className="text-xs text-muted-foreground">Your image meets our quality requirements. You're all set to continue.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onRetake} className="flex-1 rounded-xl h-10">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retake
            </Button>
            <Button onClick={onContinue} className="flex-1 bg-primary hover:bg-primary/90 rounded-xl h-10 font-semibold">
              Continue to Questions
            </Button>
          </div>
        </motion.div>
      )}

      {status === "poor" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="space-y-2">
            {result?.issues?.map((iss, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl bg-destructive/8 border border-destructive/20 p-3">
                <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80 leading-relaxed">{iss.message}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Please retake the photo to continue. You won't be able to proceed until the image quality is acceptable.
          </p>
          <Button onClick={onRetake} className="w-full bg-primary hover:bg-primary/90 rounded-xl h-10 font-semibold">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retake Photo
          </Button>
        </motion.div>
      )}
    </div>
  );
}