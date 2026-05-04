import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SoundProvider } from "@/hooks/useSoundEffects";
import { MusicProvider } from "@/hooks/useBackgroundMusic";
import Index from "./pages/Index";
import Setup from "./pages/Setup";
import AdminLogin from "./pages/AdminLogin";
import AdminBoard from "./pages/AdminBoard";
import NotFound from "./pages/NotFound";
import { GlobalAssetLoader } from "@/components/game/GlobalAssetLoader";

const queryClient = new QueryClient();

const RequireProfile = ({ children }: { children: React.ReactNode }) => {
  const { isProfileComplete, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary animate-pulse">جاري التحميل...</div>
      </div>
    );
  }
  if (!isProfileComplete) return <Navigate to="/setup" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MusicProvider>
            <SoundProvider>
              <GlobalAssetLoader>
              <Routes>
                {/* Player routes — no login required */}
                <Route path="/setup" element={<Setup />} />
                <Route path="/" element={
                  <RequireProfile>
                    <Index />
                  </RequireProfile>
                } />

                {/* Hidden admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/board-9k2x" element={<AdminBoard />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
              </GlobalAssetLoader>
            </SoundProvider>
          </MusicProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
