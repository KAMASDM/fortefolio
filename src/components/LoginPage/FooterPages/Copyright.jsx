import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AnimatedBackground from "../AnimatedBackground";
import FloatingElements from "../FloatingElements";
import ForteFolioLogo from "../ForteFolioLogo";
import { Link, useNavigate } from "react-router-dom";

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

const Copyright = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
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
                Copyright Notice
              </Typography>
              <Box sx={{ width: theme.spacing(10) }} />
            </Box>

            <Typography
              variant="body2"
              color="error"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Disclaimer: This is a placeholder Copyright Notice template. It is
              not legal advice and should not be used as such. Please consult
              with a legal professional to draft a comprehensive and legally
              compliant Copyright Notice for your specific business.
            </Typography>

            <Typography variant="body1" paragraph>
              © {currentYear} MakeMyForte. All rights reserved.
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
              1. Ownership of Content
            </Typography>
            <Typography variant="body1" paragraph>
              All content and materials available on MakeMyForte, including but
              not limited to text, graphics, website name, code, images, and
              logos, are the intellectual property of MakeMyForte and are
              protected by applicable copyright and trademark law. Any
              inappropriate use, including but not limited to the reproduction,
              distribution, display, or transmission of any content on this site
              is strictly prohibited, unless specifically authorized by Anant
              Soft Computing.
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
              2. Permissible Use
            </Typography>
            <Typography variant="body1" paragraph>
              You are permitted to use the Service and its content for your
              personal, non-commercial use to create and manage resumes. Any
              other use, including commercial use, reproduction, modification,
              distribution, transmission, republication, display, or
              performance, without the prior written permission of Anant Soft
              Computing, is strictly prohibited.
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
              3. User-Generated Content
            </Typography>
            <Typography variant="body1" paragraph>
              While you retain ownership of the content you create and upload to
              the Service (e.g., your resume data), by using the Service, you
              grant MakeMyForte a license to host, display, and process your
              content as necessary to provide the Service. You are solely
              responsible for ensuring that your content does not infringe upon
              the intellectual property rights of any third party.
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
              4. Reporting Copyright Infringement
            </Typography>
            <Typography variant="body1" paragraph>
              If you believe that any content on MakeMyForte infringes upon your
              copyright, please contact us immediately with the following
              information:
            </Typography>
            <Box component="ul" sx={{ ml: 3, mb: 2 }}>
              <Typography component="li" variant="body1">
                A description of the copyrighted work that you claim has been
                infringed.
              </Typography>
              <Typography component="li" variant="body1">
                A description of where the material that you claim is infringing
                is located on the Service.
              </Typography>
              <Typography component="li" variant="body1">
                Your address, telephone number, and email address.
              </Typography>
              <Typography component="li" variant="body1">
                A statement by you that you have a good faith belief that the
                disputed use is not authorized by the copyright owner, its
                agent, or the law.
              </Typography>
              <Typography component="li" variant="body1">
                A statement by you, made under penalty of perjury, that the
                above information in your notice is accurate and that you are
                the copyright owner or authorized to act on the copyright
                owner's behalf.
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Please send all infringement notices to: [Your Contact Email for
              Legal Notices].
            </Typography>
          </Paper>
        </motion.div>
      </Container>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        sx={{
          pt: { xs: 3, md: 4 },
          pb: { xs: 3, md: 4 },
          borderTop: `1px solid ${lavenderPalette.soft}40`,
          textAlign: "center",
          width: "100%",
          marginTop: "auto",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: lavenderPalette.text,
            opacity: 0.8,
            display: "block",
            mb: 1,
          }}
        >
          © {new Date().getFullYear()} MakeMyForte |{" "}
          <Link
            to="/privacy-policy"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link
            to="/terms-conditions"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Terms of Service
          </Link>{" "}
          |{" "}
          <Link
            to="/copyright-notice"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Copyright Notice
          </Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: lavenderPalette.text,
            opacity: 0.6,
            fontSize: "0.7rem",
          }}
        >
          All rights reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default Copyright;
