import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Bell, Search, X, CheckCheck, Trash2, Heart, Shield, Zap, LogOut, UserCircle, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/lib/deviceInfo";

const categoryIcons = { health: Heart, security: Shield, system: Zap };
const categoryColors = {
  health: "text-success bg-success/10",
  security: "text-destructive bg-destructive/10",
  system: "text-primary bg-primary/10",
};

export default function TopBar({ onMenuToggle, title }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const isDeepRoute =
    location.pathname.startsWith("/DiseaseDetail/") ||
    location.pathname.startsWith("/AIReport/");

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => base44.entities.Notification.list("-created_date", 20),
    initialData: [],
  });

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const fullName = user?.full_name?.trim() || "NeuroSync User";
  const initials = getInitials(fullName);
  const photoUrl = user?.profile_photo_url;

  const markAllRead = async () => {
    await Promise.allSettled(
      notifications.filter((n) => !n.is_read).map((n) =>
        base44.entities.Notification.update(n.id, { is_read: true })
      )
    );
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const clearAll = async () => {
    await Promise.allSettled(notifications.map((n) => base44.entities.Notification.delete(n.id)));
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    setNotifOpen(false);
  };

  const markRead = async (id) => {
    await base44.entities.Notification.update(id, { is_read: true });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const handleLogout = () => {
    setMenuOpen(false);
    base44.auth.logout();
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 py-2.5 lg:px-5" style={{ paddingTop: "calc(0.625rem + env(safe-area-inset-top))" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {isDeepRoute ? (
            <Button variant="ghost" size="icon"
              className="shrink-0 h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
              onClick={() => navigate(-1)}
              aria-label="Back">
              <ArrowLeft className="w-4.5 h-4.5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon"
              className="lg:hidden shrink-0 h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
              onClick={onMenuToggle}
              aria-label="Open navigation menu">
              <Menu className="w-4.5 h-4.5" />
            </Button>
          )}
          <h1 className="text-base font-semibold tracking-tight truncate text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
            <Input placeholder="Search..." aria-label="Search" className="pl-9 w-44 bg-secondary/50 border-border/40 h-8 text-sm rounded-xl
              focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/30
              placeholder:text-muted-foreground/40 transition-all duration-200 focus:w-52" />
          </div>

          {/* Notification Bell */}
          {!isDeepRoute && (
          <div className="relative">
            <Button variant="ghost" size="icon"
              className="relative h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              onClick={() => setNotifOpen(!notifOpen)}
              aria-label={`Notifications, ${unreadCount} unread`}>
              <Bell className="w-4 h-4" />
              {unreadCount > 0 &&
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] bg-destructive rounded-full ring-2 ring-background flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              }
            </Button>

            <AnimatePresence>
              {notifOpen &&
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-bold">Notifications</span>
                        {unreadCount > 0 &&
                          <span className="text-[10px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">{unreadCount} new</span>
                        }
                      </div>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 &&
                          <button onClick={markAllRead} className="text-[11px] text-primary hover:text-primary/80 font-semibold flex items-center gap-1">
                            <CheckCheck className="w-3 h-3" /> All read
                          </button>
                        }
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg" onClick={() => setNotifOpen(false)} aria-label="Close notifications">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto scrollbar-none">
                      {notifications.length === 0 ?
                        <div className="flex flex-col items-center gap-2 py-10 text-center px-4">
                          <Bell className="w-8 h-8 text-muted-foreground/20" />
                          <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div> :
                        notifications.map((n) => {
                          const Icon = categoryIcons[n.category] || Zap;
                          const color = categoryColors[n.category] || "text-primary bg-primary/10";
                          return (
                            <div key={n.id}
                              onClick={() => markRead(n.id)}
                              className={`flex items-start gap-3 px-4 py-3 border-b border-border/30 hover:bg-secondary/30 cursor-pointer transition-colors ${!n.is_read ? "bg-primary/[0.03]" : ""}`}>
                              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${color}`}>
                                <Icon className="w-3 h-3" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-xs font-semibold truncate">{n.title}</p>
                                  {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                                {n.created_date &&
                                  <p className="text-[10px] text-muted-foreground/50 mt-1">
                                    {formatDistanceToNow(new Date(n.created_date), { addSuffix: true })}
                                  </p>
                                }
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>

                    {notifications.length > 0 &&
                      <div className="px-4 py-2.5 border-t border-border/60">
                        <button onClick={clearAll} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-destructive transition-colors font-medium">
                          <Trash2 className="w-3 h-3" /> Clear all notifications
                        </button>
                      </div>
                    }
                  </motion.div>
                </>
              }
            </AnimatePresence>
          </div>
          )}

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 h-8 pl-1.5 pr-2 rounded-xl hover:bg-secondary/60 transition-colors"
              aria-label="Account menu"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <div
                className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{
                  background: photoUrl ? undefined : "linear-gradient(135deg, hsl(199 89% 48% / 0.7), hsl(265 70% 60% / 0.7))",
                }}
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <span className="hidden sm:block text-xs font-semibold max-w-[100px] truncate">{fullName.split(" ")[0]}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3.5 border-b border-border/50">
                      <p className="text-sm font-bold truncate">{fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{(user?.email || "No email").toLowerCase()}</p>
                    </div>
                    <div className="py-1.5">
                      <button
                        onClick={() => { setMenuOpen(false); navigate("/Profile"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-secondary/40 transition-colors"
                      >
                        <UserCircle className="w-3.5 h-3.5 text-muted-foreground" /> Profile & Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/8 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}