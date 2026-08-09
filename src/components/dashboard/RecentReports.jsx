import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatISTDate } from "@/lib/reportUtils";
import { FileText, ChevronRight, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SeverityBadge from "@/components/medical/SeverityBadge";
import Skeleton from "@/components/ui/Skeleton";

export default function RecentReports({ scans = [], loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="glass-premium rounded-3xl p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-primary/10">
            <FileText className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Recent Reports</h2>
            <p className="text-[11px] text-muted-foreground">
              {scans.length > 0
                ? `${scans.length} analysis record${scans.length > 1 ? "s" : ""}`
                : "No reports yet"}
            </p>
          </div>
        </div>
        {scans.length > 0 && (
          <Link to="/ScanHistory">
            <Button variant="ghost" size="sm" className="text-xs h-8 rounded-xl">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl">
              <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : scans.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-semibold">No reports yet</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Your completed skin analyses will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {scans.slice(0, 5).map((scan, idx) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05 }}
            >
              <Link
                to={`/DiseaseDetail/${scan.report_id || scan.id}`}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-secondary/40 transition-colors group"
              >
                {scan.image_url ? (
                  <img
                    src={scan.image_url}
                    alt="Scan"
                    className="w-11 h-11 rounded-xl object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {scan.condition_name || "Unknown condition"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {scan.confidence ? `${scan.confidence}% confidence` : "Pending"} ·{" "}
                    {scan.created_date && formatISTDate(scan.created_date)}
                  </p>
                </div>
                <SeverityBadge severity={scan.severity} size="sm" />
                <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary/60 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}