import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/routes/ProtectedRoute";
import Navigation from "@/components/Navigation";
import { JofhSchool } from "@/components/curriculum/JofhSchool";
import Dashboard from "@/pages/Dashboard";
import Import from "@/pages/Import";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Creator from "@/pages/Creator";
import Index from "@/pages/Index";
import Learning from "@/pages/Learning";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<Index />} />

      {/* Jofh School - Default Curriculum */}
      <Route path="/jofh-school" element={<JofhSchool />} />

      {/* Public authentication routes */}
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
        path="/learning/:id"
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
        path="/creator"
        element={
          <ProtectedRoute>
            <>
              <Navigation />
              <Creator />
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

      {/* Catch all unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};