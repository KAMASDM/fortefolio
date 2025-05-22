import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import theme from "./theme";
import ResumeOnlyView from "./components/ResumeBuilderPage/DisplayResume/ResumeOnlyView";
import Privacy from "./components/LoginPage/FooterPages/Privacy";
import Terms from "./components/LoginPage/FooterPages/Terms";
import Copyright from "./components/LoginPage/FooterPages/Copyright";
import AboutUsPage from "./components/DashboardPage/NavMenuPages/AboutUsPage";
import OurTeamPage from "./components/DashboardPage/NavMenuPages/OurTeamPage";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null;
  }

  return currentUser ? children : <Navigate to="/" replace />;
}
function AuthRedirector() {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  return currentUser ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/" replace />
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/our-team" element={<OurTeamPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume/:resumeId"
              element={
                <ProtectedRoute>
                  <ResumeBuilderPage />
                </ProtectedRoute>
              }
            />
            <Route path="/preview-only" element={<ResumeOnlyView />} />

            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms-conditions" element={<Terms />} />
            <Route path="/copyright-notice" element={<Copyright />} />
            <Route path="*" element={<AuthRedirector />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
