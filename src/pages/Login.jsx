import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Image } from "@/components/ui/image";
import { Mail, Lock, Loader2 } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";
import { toast } from "sonner";
import LoginHero from "@/components/auth/LoginHero";
import AuthFooter from "@/components/auth/AuthFooter";
import TrustBadges from "@/components/auth/TrustBadges";

const LOGO_URL =
  "https://media.base44.com/images/public/6a748724fb701fa67ea4ddda/12ca9d017_NeuroSync_Image.png";

export default function Login() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const returnTo = safeReturnTo();

  const handleGoogle = () => {
    setGoogleLoading(true);
    base44.auth.loginWithProvider("google", returnTo);
  };

  const handlePlaceholder = (feature) => {
    toast.info(`${feature} will be available in a future update.`);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <LoginHero />

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm animate-page-enter">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
              <Image src={LOGO_URL} className="w-10 h-10 rounded-lg" fittingType="fit" />
              <span className="text-lg font-bold tracking-tight">NeuroSync</span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Sign in to NeuroSync</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Secure access to your dermatology platform
              </p>
            </div>

            {/* Google button — primary CTA, only functional auth method */}
            <Button
              onClick={handleGoogle}
              className="w-full h-12 text-sm font-medium mb-4 glow-primary"
              disabled={googleLoading}
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  <GoogleIcon className="w-5 h-5 mr-2" /> Continue with Google
                </>
              )}
            </Button>

            {/* OR divider */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Email / Password — UI placeholders, not wired to auth */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or NeuroSync ID</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    onClick={() => handlePlaceholder("Password recovery")}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-muted-foreground cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 font-medium"
                onClick={() => handlePlaceholder("Email login")}
              >
                Login
              </Button>
            </div>

            {/* Create account — placeholder */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <button
                onClick={() => handlePlaceholder("Account creation")}
                className="text-primary font-medium hover:underline"
              >
                Create NeuroSync Account
              </button>
            </p>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-border">
              <TrustBadges variant="card" />
            </div>
          </div>
        </div>

        <AuthFooter />
      </div>
    </div>
  );
}