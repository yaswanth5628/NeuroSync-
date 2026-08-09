import { Link } from "react-router-dom";
import { formatISTDate } from "@/lib/reportUtils";
import { FileText, ChevronRight, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionCard from "./SectionCard";
import SeverityBadge from "@/components/medical/SeverityBadge";

export default function ReportsHistory({ scans = [] }) {
  return (
    <SectionCard
      title="Reports History"
      icon={FileText}
      delay={0.15}
      action={
        scans.length > 0 ? (
          <Link to="/ScanHistory">
            <Button variant="ghost" size="sm" className="text-xs h-7">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        ) : null
      }
    >
      {scans.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
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
          {scans.slice(0, 5).map((scan) => (
            <Link
              key={scan.id}
              to={`/DiseaseDetail/${scan.report_id || scan.id}`}
              className="flex items-center gap-3 p-2 rounded-2xl hover:bg-secondary/40 transition-colors group"
            >
              {scan.image_url ? (
                <img src={scan.image_url} alt="Scan" className="w-10 h-10 rounded-xl object-cover border border-border shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{scan.condition_name || "Unknown condition"}</p>
                <p className="text-xs text-muted-foreground">
                  {scan.confidence ? `${scan.confidence}% confidence` : "Pending"} ·{" "}
                  {scan.created_date && formatISTDate(scan.created_date)}
                </p>
              </div>
              <SeverityBadge severity={scan.severity} size="sm" />
              <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary/60 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </SectionCard>
  );
}