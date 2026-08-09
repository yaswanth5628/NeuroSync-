import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ScanLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function WelcomeHero({ user, userLoading, scansCount }) {
  const firstName = user?.full_name?.split(" ")[0] || "there";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-3xl p-6 sm:p-7"
      style={{
        background:
          "linear-gradient(120deg, hsl(211 100% 50%) 0%, hsl(199 89% 48%) 45%, hsl(217 91% 60%) 100%)",
        boxShadow: "0 12px 40px hsl(199 89% 48% / 0.28)",
      }}
    >
      {/* Decorative orbs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-lg font-bold text-white border-2 border-white/40"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              {userLoading ? (
                <Skeleton className="w-full h-full rounded-2xl" />
              ) : user?.profile_photo_url ? (
                <img src={user.profile_photo_url} alt="Profile" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              ) : (
                firstName === "there" ? "NS" : (firstName[0] || "N").toUpperCase()
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> {getGreeting()}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {userLoading ? <Skeleton className="h-8 w-44 bg-white/20" /> : firstName}
            </h1>
            <p className="text-sm text-white/80 mt-1">
              {format(new Date(), "EEEE, MMMM d")} ·{" "}
              {scansCount > 0
                ? `${scansCount} scan${scansCount > 1 ? "s" : ""} completed`
                : "Start your first scan today"}
            </p>
          </div>
        </div>

        <Link to="/SkinScan">
          <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl h-11 px-5 font-bold shadow-lg">
            <ScanLine className="w-4 h-4 mr-2" /> Scan Your Skin
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}