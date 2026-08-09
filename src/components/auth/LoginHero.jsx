import { Image } from "@/components/ui/image";
import TrustBadges from "./TrustBadges";

const LOGO_URL =
  "https://media.base44.com/images/public/6a748724fb701fa67ea4ddda/12ca9d017_NeuroSync_Image.png";

export default function LoginHero() {
  return (
    <div
      className="hidden lg:flex relative flex-col justify-between overflow-hidden p-10 xl:p-14 neural-grid"
      style={{
        background:
          "linear-gradient(135deg, hsl(199 89% 48%) 0%, hsl(217 91% 60%) 50%, hsl(265 70% 55%) 100%)",
      }}
    >
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Image src={LOGO_URL} className="w-12 h-12 rounded-xl" fittingType="fit" />
          <span className="text-xl font-bold text-white tracking-tight">NeuroSync</span>
        </div>
      </div>

      <div className="relative z-10 max-w-md">
        <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
          Welcome to NeuroSync
        </h1>
        <p className="text-white/70 text-base leading-relaxed">
          AI-powered dermatology platform delivering intelligent skin analysis, secure medical
          reporting, and personalized skin health insights.
        </p>
      </div>

      <div className="relative z-10">
        <TrustBadges variant="hero" />
      </div>
    </div>
  );
}