import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

const pageTitles = {
  "/Dashboard": "Dashboard",
  "/Assistant": "AI Medical Assistant",
  "/SkinScan": "Skin Scan",
  "/ScanHistory": "Scan History",
  "/PrivacyDashboard": "Privacy & Security",
  "/Profile": "Profile",
};

function getPageTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/DiseaseDetail/")) return "Disease Details";
  if (pathname.startsWith("/AIReport/")) return "AI Medical Report";
  return "NeuroSync";
}

function useThemeInit() {
  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem("ns_theme") || "dark";
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const useDark = savedTheme === "dark" || (savedTheme === "system" && prefersDark);
      document.documentElement.classList.toggle("dark", useDark);
    };
    applyTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, []);
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const isDeepRoute =
    location.pathname.startsWith("/DiseaseDetail/") ||
    location.pathname.startsWith("/AIReport/");
  useThemeInit();

  // Android back button: push a sentinel when the mobile sidebar opens so the
  // hardware back button closes the overlay instead of leaving the app.
  useEffect(() => {
    if (!sidebarOpen) return;
    window.history.pushState({ nsSidebar: true }, "");
    const onPop = () => setSidebarOpen(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [sidebarOpen]);

  const closeSidebar = () => {
    setSidebarOpen(false);
    if (window.history.state && window.history.state.nsSidebar) {
      window.history.back();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden neural-grid">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar onMenuToggle={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-5 lg:pb-5 lg:pt-4 scrollbar-premium">
          <Outlet />
        </main>
        {!isDeepRoute && <BottomNav />}
      </div>
    </div>
  );
}