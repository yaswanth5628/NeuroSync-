import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, MessageSquare, ScanLine, History,
  ShieldCheck, User, X, Brain, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/Dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/SkinScan", icon: ScanLine, label: "Skin Scan" },
  { path: "/ScanHistory", icon: History, label: "Scan History" },
  { path: "/Assistant", icon: MessageSquare, label: "AI Assistant" },
  { path: "/PrivacyDashboard", icon: ShieldCheck, label: "Privacy & Security" },
  { path: "/Profile", icon: User, label: "Profile" },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside aria-label="Primary navigation" style={{ paddingTop: "env(safe-area-inset-top)" }} className={`
        fixed top-0 left-0 h-full w-60 z-50 flex flex-col
        bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0"
              style={{ boxShadow: "0 0 18px hsl(199 89% 48% / 0.45)" }}
            >
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-sidebar-foreground">NeuroSync</span>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Dermatology AI</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden h-7 w-7 text-muted-foreground" onClick={onClose} aria-label="Close navigation menu">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-white/[0.04]'}
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <div className={`p-1.5 rounded-lg transition-all duration-200 shrink-0 ${
                  isActive ? "bg-primary/20" : "group-hover:bg-white/[0.06]"
                }`}>
                  <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : ''}`} />
                </div>
                <span className="flex-1 text-[13px]">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="mx-2.5 mb-4 p-3 rounded-xl border border-sidebar-border/40 bg-white/[0.025]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Status</span>
            <CheckCircle2 className="w-3 h-3 text-success" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-0.5">
              {[30, 55, 80].map((h, i) => (
                <div key={i} className="w-1.5 rounded-sm bg-success"
                  style={{ height: `${h}%`, minHeight: 4, maxHeight: 10, opacity: 0.6 + i * 0.2 }} />
              ))}
            </div>
            <p className="text-[11px] font-semibold text-foreground">All systems online</p>
          </div>
        </div>
      </aside>
    </>
  );
}