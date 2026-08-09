import { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatISTDate } from "@/lib/reportUtils";
import {
  Search, FileText, ArrowRight, Image as ImageIcon,
  Calendar, Trash2, Loader2, History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MedicalDisclaimer from "@/components/medical/MedicalDisclaimer";
import SeverityBadge from "@/components/medical/SeverityBadge";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";

const SEVERITY_FILTERS = [
  { value: "all", label: "All" },
  { value: "mild", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "urgent", label: "Severe" },
];

export default function ScanHistory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const queryClient = useQueryClient();

  const { data: scans = [], isLoading } = useQuery({
    queryKey: ["scans"],
    queryFn: () => base44.entities.SkinScan.list("-created_date"),
    initialData: [],
  });

  const filtered = useMemo(() => {
    return scans.filter((s) => {
      const matchSearch =
        !search || (s.condition_name || "").toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || s.severity === filter;
      return matchSearch && matchFilter;
    });
  }, [scans, search, filter]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    const previous = queryClient.getQueryData(["scans"]);
    queryClient.setQueryData(["scans"], (old) => (old ? old.filter((s) => s.id !== id) : old));
    try {
      await base44.entities.SkinScan.delete(id);
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      toast.success("Scan deleted successfully");
    } catch {
      queryClient.setQueryData(["scans"], previous);
      toast.error("Failed to delete scan");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <PageHeader title="Scan History" subtitle="View and manage your previous skin scan reports" />

      <MedicalDisclaimer />

      {/* Search & Filter */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by condition name..."
            className="pl-9 rounded-xl"
          />
        </div>
        <div className="flex gap-1.5">
          {SEVERITY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} scan{filtered.length !== 1 ? "s" : ""} found
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
            <History className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-base font-bold mb-1">No Scans Found</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            {scans.length === 0
              ? "Start your first skin scan to see results here."
              : "Try adjusting your search or filter."}
          </p>
          <Link to="/SkinScan">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-9 px-4 text-sm">
              Scan Your Skin
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((scan, i) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card rounded-2xl border border-border p-3 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {scan.image_url ? (
                  <img
                    src={scan.image_url}
                    alt="Scan"
                    className="w-14 h-14 rounded-xl object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold truncate">
                      {scan.condition_name || "Unknown condition"}
                    </h4>
                    <SeverityBadge severity={scan.severity} size="sm" />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-semibold text-primary">
                      {scan.confidence ? `${scan.confidence}%` : "--"}
                    </span>
                    {scan.created_date && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatISTDate(scan.created_date)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link to={`/report/${scan.report_id || scan.id}`}>
                    <Button variant="outline" size="sm" className="h-8 px-2.5 rounded-xl text-xs">
                      <FileText className="w-3 h-3 mr-1" /> Report
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(scan.id)}
                    disabled={deletingId === scan.id}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  >
                    {deletingId === scan.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <Link
                to={`/DiseaseDetail/${scan.report_id || scan.id}`}
                className="block mt-2 pt-2 border-t border-border/30 text-xs text-primary font-semibold hover:translate-x-1 transition-transform"
              >
                View disease details →
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}