import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/routes/ProtectedRoute";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import Import from "@/pages/Import";
import Learning from "@/pages/Learning";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import JoinSchool from "@/pages/JoinSchool";

function App() {
  return (
    <TooltipProvider delayDuration={0}>
      <Router>
        <Routes>
          {/* Redirect root to login or dashboard based on auth status */}
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="container mx-auto px-4 py-20 md:py-24">
                    <Dashboard />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/import"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="container mx-auto px-4 py-20 md:py-24">
                    <Import />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="container mx-auto px-4 py-20 md:py-24">
                    <Learning />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="container mx-auto px-4 py-20 md:py-24">
                    <Profile />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="container mx-auto px-4 py-20 md:py-24">
                    <Settings />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/join-school" element={<JoinSchool />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </TooltipProvider>
  );
}

export default App;