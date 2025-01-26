import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import School from "./pages/School";
import Learning from "./pages/Learning";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JoinSchool from "./pages/JoinSchool";
import Chatter from "./pages/Chatter";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={cn("min-h-screen", isMobile ? "pb-16" : "pt-16")}>
      {children}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider 
        defaultTheme="system" 
        enableSystem={true} 
        attribute="class" 
        themes={["light", "dark", "rainbow"]}
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/join-school"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <div className="container mx-auto px-4 py-4 md:py-8">
                    <JoinSchool />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <div className="container mx-auto px-4 py-4 md:py-8">
                    <Dashboard />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/school"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <School />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Learning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <div className="container mx-auto px-4 py-4 md:py-8">
                    <Settings />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatter"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Chatter />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;