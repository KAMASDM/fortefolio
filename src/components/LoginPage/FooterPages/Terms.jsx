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

const Terms = () => {
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
                Terms and Conditions
              </Typography>
              <Box sx={{ width: theme.spacing(10) }} />
            </Box>

            <Typography
              variant="body2"
              color="error"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Disclaimer: This is a placeholder Terms and Conditions template.
              It is not legal advice and should not be used as such. Please
              consult with a legal professional to draft a comprehensive and
              legally compliant Terms and Conditions for your specific business.
            </Typography>

            <Typography variant="body1" paragraph>
              Welcome to MakeMyForte! These Terms and Conditions ("Terms")
              govern your use of the MakeMyForte online resume builder
              application (the "Service"), operated by MakeMyForte ("Company,"
              "we," "us," or "our").
            </Typography>
            <Typography variant="body1" paragraph>
              By accessing or using the Service, you agree to be bound by these
              Terms. If you disagree with any part of the terms, then you may
              not access the Service.
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
              1. Accounts
            </Typography>
            <Typography variant="body1" paragraph>
              When you create an account with us, you must provide us with
              information that is accurate, complete, and current at all times.
              Failure to do so constitutes a breach of the Terms, which may
              result in immediate termination of your account on our Service.
            </Typography>
            <Typography variant="body1" paragraph>
              You are responsible for safeguarding the password that you use to
              access the Service and for any activities or actions under your
              password.
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
              2. Intellectual Property
            </Typography>
            <Typography variant="body1" paragraph>
              The Service and its original content (excluding content provided
              by users), features, and functionality are and will remain the
              exclusive property of MakeMyForte and its licensors. The Service
              is protected by copyright, trademark, and other laws of both the
              India and foreign countries. Our trademarks and trade dress may
              not be used in connection with any product or service without the
              prior written consent of MakeMyForte.
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
              3. User Content
            </Typography>
            <Typography variant="body1" paragraph>
              You retain all rights to any resume content or other materials you
              submit, post, or display on or through the Service ("User
              Content"). By submitting User Content, you grant us a
              non-exclusive, worldwide, royalty-free license to use, modify,
              publicly perform, publicly display, reproduce, and distribute such
              User Content on and through the Service.
            </Typography>
            <Typography variant="body1" paragraph>
              You represent and warrant that: (i) the User Content is yours (you
              own it) or you have the right to use it and grant us the rights
              and license as provided in these Terms, and (ii) the posting of
              your User Content on or through the Service does not violate the
              privacy rights, publicity rights, copyrights, contract rights or
              any other rights of any person.
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
              4. Prohibited Conduct
            </Typography>
            <Typography variant="body1" paragraph>
              You agree not to use the Service for any unlawful purpose or in
              any way that might harm, abuse, or otherwise interfere with the
              Service or other users. Prohibited activities include, but are not
              limited to:
            </Typography>
            <Box component="ul" sx={{ ml: 3, mb: 2 }}>
              <Typography component="li" variant="body1">
                Distributing malware or other harmful code.
              </Typography>
              <Typography component="li" variant="body1">
                Engaging in any form of harassment or hate speech.
              </Typography>
              <Typography component="li" variant="body1">
                Attempting unauthorized access to the Service or its systems.
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
              5. Termination
            </Typography>
            <Typography variant="body1" paragraph>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
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
              6. Disclaimer
            </Typography>
            <Typography variant="body1" paragraph>
              Your use of the Service is at your sole risk. The Service is
              provided on an "AS IS" and "AS AVAILABLE" basis. The Service is
              provided without warranties of any kind, whether express or
              implied, including, but not limited to, implied warranties of
              merchantability, fitness for a particular purpose,
              non-infringement or course of performance.
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
              7. Governing Law
            </Typography>
            <Typography variant="body1" paragraph>
              These Terms shall be governed and construed in accordance with the
              laws of India, without regard to its conflict of law provisions.
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
              8. Changes to Terms
            </Typography>
            <Typography variant="body1" paragraph>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. By continuing to access or use our
              Service after those revisions become effective, you agree to be
              bound by the revised terms.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
      <Footer />
    </Box>
  );
};

export default Terms;
