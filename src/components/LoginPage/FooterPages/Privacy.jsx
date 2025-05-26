import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer/Footer";
import ForteFolioLogo from "../ForteFolioLogo";
import FloatingElements from "../FloatingElements";
import AnimatedBackground from "../AnimatedBackground";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
  gradient: "linear-gradient(135deg, #B9A5E3 0%, #7F68C9 100%)",
  accentGradient: "linear-gradient(45deg, #A190DD 30%, #7F68C9 90%)",
};

const Privacy = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        py: { xs: 4, md: 8 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3, md: 0 },
      }}
    >
      <AnimatedBackground />
      <FloatingElements />
      <Box
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        sx={{}}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
            }}
          >
            <Box
              component={motion.div}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box
                component={motion.div}
                whileHover={{
                  rotate: [0, -10, 10, -5, 0],
                  transition: { duration: 0.5 },
                }}
                sx={{ mr: 1.5, display: "flex" }}
              >
                <ForteFolioLogo />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: lavenderPalette.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {" "}
                MakeMyForte{" "}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: theme.shape.borderRadius * 1,
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.1)`,
              border: `1px solid ${lavenderPalette.soft}`,
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 3, sm: 4 },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackClick}
                sx={{
                  color: lavenderPalette.deep,
                  borderColor: lavenderPalette.medium,
                  "&:hover": {
                    borderColor: lavenderPalette.deep,
                    backgroundColor: "rgba(147, 112, 219, 0.05)",
                  },
                }}
                size="small"
              >
                Back
              </Button>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: lavenderPalette.darkText,
                  textAlign: "center",
                }}
              >
                Privacy Policy
              </Typography>
              <Box sx={{ width: theme.spacing(10) }} />
            </Box>

            <Typography
              variant="body2"
              color="error"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Disclaimer: This is a placeholder Privacy Policy template. It is
              not legal advice and should not be used as such. Please consult
              with a legal professional to draft a comprehensive and legally
              compliant Privacy Policy for your specific business.
            </Typography>

            <Typography variant="body1" paragraph>
              This Privacy Policy describes how MakeMyForte ("we," "us," or
              "our") collects, uses, and discloses your personal information
              when you use our online resume builder application (the
              "Service").
            </Typography>

            <Typography
              variant="h6"
              component="h2"
              sx={{
                mt: 4,
                mb: 1,
                fontWeight: 600,
                color: lavenderPalette.deep,
              }}
            >
              1. Information We Collect
            </Typography>
            <Typography variant="body1" paragraph>
              We collect information that you provide directly to us when you
              use the Service, such as:
            </Typography>
            <Box component="ul" sx={{ ml: 3, mb: 2 }}>
              <Typography component="li" variant="body1">
                **Account Information:** When you create an account, we collect
                your name, email address, and potentially your profile picture
                (if you sign in via Google).
              </Typography>
              <Typography component="li" variant="body1">
                **Resume Content:** All information you enter into your resume,
                including personal details, education, experience, skills,
                projects, and references.
              </Typography>
              <Typography component="li" variant="body1">
                **Usage Data:** Information about how you interact with the
                Service, such as pages visited, features used, and time spent on
                the application.
              </Typography>
            </Box>

            <Typography
              variant="h6"
              component="h2"
              sx={{
                mt: 4,
                mb: 1,
                fontWeight: 600,
                color: lavenderPalette.deep,
              }}
            >
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" paragraph>
              We use the information we collect for various purposes, including:
            </Typography>
            <Box component="ul" sx={{ ml: 3, mb: 2 }}>
              <Typography component="li" variant="body1">
                To provide, maintain, and improve the Service.
              </Typography>
              <Typography component="li" variant="body1">
                To personalize your experience and offer tailored features
                (e.g., AI-powered suggestions).
              </Typography>
              <Typography component="li" variant="body1">
                To communicate with you about your account and updates to the
                Service.
              </Typography>
              <Typography component="li" variant="body1">
                To analyze usage patterns and optimize our application's
                performance.
              </Typography>
            </Box>

            <Typography
              variant="h6"
              component="h2"
              sx={{
                mt: 4,
                mb: 1,
                fontWeight: 600,
                color: lavenderPalette.deep,
              }}
            >
              3. Data Sharing and Disclosure
            </Typography>
            <Typography variant="body1" paragraph>
              We do not sell or rent your personal information to third parties.
              We may share your information in the following circumstances:
            </Typography>
            <Box component="ul" sx={{ ml: 3, mb: 2 }}>
              <Typography component="li" variant="body1">
                **With Your Consent:** We may share your information if you give
                us explicit permission to do so (e.g., sharing your resume
                publicly).
              </Typography>
              <Typography component="li" variant="body1">
                **Service Providers:** We may share data with third-party
                vendors who perform services on our behalf (e.g., hosting,
                analytics, AI model providers). These providers are obligated to
                protect your information.
              </Typography>
              <Typography component="li" variant="body1">
                **Legal Requirements:** We may disclose your information if
                required to do so by law or in response to valid requests by
                public authorities.
              </Typography>
            </Box>

            <Typography
              variant="h6"
              component="h2"
              sx={{
                mt: 4,
                mb: 1,
                fontWeight: 600,
                color: lavenderPalette.deep,
              }}
            >
              4. Data Security
            </Typography>
            <Typography variant="body1" paragraph>
              We implement reasonable security measures to protect your personal
              information from unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the internet
              or electronic storage is 100% secure.
            </Typography>

            <Typography
              variant="h6"
              component="h2"
              sx={{
                mt: 4,
                mb: 1,
                fontWeight: 600,
                color: lavenderPalette.deep,
              }}
            >
              5. Your Rights
            </Typography>
            <Typography variant="body1" paragraph>
              You have certain rights regarding your personal information,
              including the right to access, correct, or delete your data.
              Please contact us to exercise these rights.
            </Typography>

            <Typography
              variant="h6"
              component="h2"
              sx={{
                mt: 4,
                mb: 1,
                fontWeight: 600,
                color: lavenderPalette.deep,
              }}
            >
              6. Changes to This Policy
            </Typography>
            <Typography variant="body1" paragraph>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
      <Footer />
    </Box>
  );
};

export default Privacy;
