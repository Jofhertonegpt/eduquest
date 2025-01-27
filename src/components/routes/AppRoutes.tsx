import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/routes/ProtectedRoute";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import Import from "@/pages/Import";
import Learning from "@/pages/Learning";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import JoinSchool from "@/pages/JoinSchool";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root to login or dashboard based on auth status */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        } 
      />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <>
              <Navigation />
              <Dashboard />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/import"
        element={
          <ProtectedRoute>
            <>
              <Navigation />
              <Import />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/learning"
        element={
          <ProtectedRoute>
            <>
              <Navigation />
              <Learning />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <>
              <Navigation />
              <Profile />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <>
              <Navigation />
              <Settings />
            </>
          </ProtectedRoute>
        }
      />

      <Route path="/join-school" element={<JoinSchool />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};