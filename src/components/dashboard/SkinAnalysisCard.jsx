import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatISTDate } from "@/lib/reportUtils";
import { ScanLine, ArrowRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SeverityBadge from "@/components/medical/SeverityBadge";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Skeleton from "@/components/ui/Skeleton";

export default function SkinAnalysisCard({ scan, loading, delay = 0.2 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="glass-premium rounded-3xl p-5 card-lift relative overflow-hidden"
    >
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-20 bg-accent" />

      <div className="relative flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-accent/10">
          <ScanLine className="w-5 h-5 text-accent" />
        </div>
        {scan?.severity && <SeverityBadge severity={scan.severity} />}
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        Skin Analysis
      </p>

      {loading ? (
        <div className="flex gap-3 mt-2">
          <Skeleton className="w-16 h-16 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ) : scan ? (
        <div className="flex gap-3 mt-2">
          {scan.image_url ? (
            <img
              src={scan.image_url}
              alt="Latest scan"
              className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold truncate">{scan.condition_name || "Analyzing..."}</p>
            <p className="text-2xl font-extrabold text-accent">
              {scan.confidence ? (
                <AnimatedCounter value={Math.round(scan.confidence)} suffix="%" duration={1200} />
              ) : (
                "--"
              )}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {scan.created_date && formatISTDate(scan.created_date)}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-sm font-bold text-foreground">No scans yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Take your first scan to start tracking.
          </p>
        </div>
      )}

      {scan ? (
        <Link to={`/DiseaseDetail/${scan.report_id || scan.id}`} className="block mt-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl h-8 text-xs border-accent/30 text-accent hover:bg-accent/10"
          >
            View Details <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      ) : (
        <Link to="/SkinScan" className="block mt-3">
          <Button size="sm" className="w-full rounded-xl h-8 text-xs">
            <ScanLine className="w-3 h-3 mr-1" /> Start Scan
          </Button>
        </Link>
      )}
    </motion.div>
  );
}