import { Routes, Route, Navigate } from "react-router-dom";
import { AppProviders } from "@/components/providers/AppProviders";
import { ProtectedRoute } from "@/components/routes/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import School from "./pages/School";
import Learning from "./pages/Learning";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JoinSchool from "./pages/JoinSchool";

const AppRoutes = () => {
  return (
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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;