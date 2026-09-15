import AppErrorBoundary from "./components/AppErrorBoundary";
import { lazy, Suspense } from "react";
import { CircularProgress, Box, Button, Alert } from "@mui/material";
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import LoginPage from "./pages/LoginPage";
const Blogs = lazy(
  () => import("./components/LoginPage/NavMenuPages/Blog/Blogs"),
);
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const BlogDetails = lazy(
  () => import("./components/LoginPage/NavMenuPages/Blog/BlogDetails"),
);
const ResumeBuilderPage = lazy(() => import("./pages/ResumeBuilderPage"));
const Terms = lazy(() => import("./components/LoginPage/FooterPages/Terms"));
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
const Privacy = lazy(
  () => import("./components/LoginPage/FooterPages/Privacy"),
);
const Copyright = lazy(
  () => import("./components/LoginPage/FooterPages/Copyright"),
);
const AboutUsPage = lazy(
  () => import("./components/LoginPage/NavMenuPages/AboutUsPage"),
);
const OurTeamPage = lazy(
  () => import("./components/LoginPage/NavMenuPages/OurTeamPage"),
);
const ResumeOnlyView = lazy(
  () => import("./components/ResumeBuilderPage/DisplayResume/ResumeOnlyView"),
);
const ContactUs = lazy(
  () => import("./components/LoginPage/NavMenuPages/ContactUs/ContactUs"),
);
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));

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

function ApplicationRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <Box
            sx={{ display: "flex", justifyContent: "center", py: 10 }}
            role="status"
            aria-label="Loading page"
          >
            <CircularProgress />
          </Box>
        }
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/our-team" element={<OurTeamPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
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
          <Route
            path="/preview-only/:userId/:resumeId"
            element={<ResumeOnlyView />}
          />
          <Route
            path="/portfolio/:userId/:resumeId"
            element={<PortfolioPage />}
          />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/copyright" element={<Copyright />} />
          <Route path="*" element={<AuthRedirector />} />
        </Routes>
      </Suspense>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "*",
    element: <ApplicationRoutes />,
    errorElement: (
      <Box sx={{ maxWidth: 520, mx: "auto", py: 10, px: 3 }}>
        <Alert severity="info">
          This page could not load. Reload to try again; your saved resumes stay
          in your account.
        </Alert>
        <Button sx={{ mt: 2 }} onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </Box>
    ),
  },
]);
function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppErrorBoundary>
          <RouterProvider router={router} />
        </AppErrorBoundary>
      </ThemeProvider>
    </AuthProvider>
  );
}
export default App;
