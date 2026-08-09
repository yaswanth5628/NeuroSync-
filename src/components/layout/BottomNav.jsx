import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, ScanLine, MessageSquare, History, User } from "lucide-react";

const navItems = [
  { path: "/Dashboard", icon: LayoutDashboard, label: "Home" },
  { path: "/SkinScan", icon: ScanLine, label: "Scan" },
  { path: "/Assistant", icon: MessageSquare, label: "AI" },
  { path: "/ScanHistory", icon: History, label: "Reports" },
  { path: "/Profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav aria-label="Main navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/Dashboard" && location.pathname.startsWith(item.path + "/"));
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[56px]"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={`flex items-center justify-center w-9 h-9 rounded-2xl transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
                style={isActive ? { boxShadow: "0 4px 14px hsl(199 89% 48% / 0.35)" } : {}}
              >
                <item.icon className="w-4.5 h-4.5" />
              </motion.div>
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? "text-primary" : "text-muted-foreground/70"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}