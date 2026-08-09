import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import MedicalDisclaimer from "@/components/medical/MedicalDisclaimer";
import WelcomeHero from "@/components/dashboard/WelcomeHero";
import SkinAnalysisCard from "@/components/dashboard/SkinAnalysisCard";
import RecentReports from "@/components/dashboard/RecentReports";

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: scans = [], isLoading: scansLoading } = useQuery({
    queryKey: ["scans"],
    queryFn: () => base44.entities.SkinScan.list("-created_date", 10),
    initialData: [],
  });

  const queryClient = useQueryClient();
  const { pull, refreshing } = usePullToRefresh(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["me"] }),
      queryClient.invalidateQueries({ queryKey: ["scans"] }),
    ]);
  });

  const latestScan = scans[0];

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-page-enter pb-4">
      {/* Pull-to-refresh indicator */}
      <div
        className="flex items-end justify-center overflow-hidden"
        style={{ height: refreshing ? 40 : pull, transition: refreshing ? "height 0.2s ease" : "none" }}
        aria-hidden="true"
      >
        <Loader2 className={`w-5 h-5 text-primary mb-1 ${refreshing ? "animate-spin" : ""}`} />
      </div>
      <WelcomeHero
        user={user}
        userLoading={userLoading}
        scansCount={scans.length}
      />

      <MedicalDisclaimer />

      {/* Latest skin analysis */}
      <SkinAnalysisCard scan={latestScan} loading={scansLoading} delay={0.1} />

      {/* Recent Reports */}
      <RecentReports scans={scans} loading={scansLoading} />
    </div>
  );
}