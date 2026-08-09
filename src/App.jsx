import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import SkinScan from './pages/SkinScan';
import ScanHistory from './pages/ScanHistory';
import DiseaseDetail from './pages/DiseaseDetail';
import PrivacyDashboard from './pages/PrivacyDashboard';
import AIReport from './pages/AIReport';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading NeuroSync...</p>
        </div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') return <UserNotRegisteredError />;

  if (authError?.type === 'auth_required' || !isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Dashboard" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Assistant" element={<Assistant />} />
        <Route path="/SkinScan" element={<SkinScan />} />
        <Route path="/ScanHistory" element={<ScanHistory />} />
        <Route path="/DiseaseDetail/:id" element={<DiseaseDetail />} />
        <Route path="/PrivacyDashboard" element={<PrivacyDashboard />} />
        <Route path="/report/:reportId" element={<AIReport />} />
        <Route path="/AIReport/:id" element={<AIReport />} />
        <Route path="/Profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;