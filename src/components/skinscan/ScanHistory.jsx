import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatISTDate } from "@/lib/reportUtils";
import { Trash2, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

const severityColors = {
  mild:     "text-success bg-success/10 border-success/20",
  moderate: "text-warning bg-warning/10 border-warning/20",
  urgent:   "text-destructive bg-destructive/10 border-destructive/20",
};

export default function ScanHistory({ onSelect }) {
  const queryClient = useQueryClient();

  const { data: scans = [] } = useQuery({
    queryKey: ["scans"],
    queryFn: () => base44.entities.SkinScan.list("-created_date", 20),
    initialData: [],
  });

  const deleteScan = async (e, id) => {
    e.stopPropagation();
    try {
      await base44.entities.SkinScan.delete(id);
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    } catch {
      toast.error("Failed to delete scan");
    }
  };

  if (scans.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground/50" />
        <h3 className="text-sm font-semibold">Previous Scans</h3>
        <span className="text-xs text-muted-foreground">({scans.length})</span>
      </div>
      <div className="space-y-2">
        {scans.map((scan, i) => (
          <motion.div
            key={scan.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelect(scan)}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-border/80 hover:bg-secondary/20 cursor-pointer transition-all group"
          >
            {scan.image_url && (
              <img src={scan.image_url} alt="scan" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-border/50" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{scan.condition_name || "Unknown condition"}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {scan.severity && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${severityColors[scan.severity] || ""}`}>
                    {scan.severity}
                  </span>
                )}
                {scan.confidence && (
                  <span className="text-[10px] text-muted-foreground">{Math.round(scan.confidence)}% confidence</span>
                )}
                {scan.created_date && (
                  <span className="text-[10px] text-muted-foreground/50">
                    {formatISTDate(scan.created_date)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                onClick={(e) => deleteScan(e, scan.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/60 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}