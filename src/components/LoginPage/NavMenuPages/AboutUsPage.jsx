import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AnimatedBackground from "../AnimatedBackground";
import FloatingElements from "../FloatingElements";
import ForteFolioLogo from "../ForteFolioLogo";
import { useNavigate } from "react-router-dom";

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

function AboutUsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <AnimatedBackground />
      <FloatingElements />
      <Container
        maxWidth="lg"
        sx={{ pb: 8, pt: 4, position: "relative", zIndex: 1 }}
      >
        <Box
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 1.5,
            mb: 4,
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
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              sx={{
                fontWeight: 700,
                background: lavenderPalette.gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              About MakeMyForte
            </Typography>
          </Box>
        </Box>

        <Paper
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${lavenderPalette.soft}`,
            boxShadow: `0 8px 25px rgba(157, 136, 217, 0.1)`,
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
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: lavenderPalette.darkText,
                textAlign: "center",
              }}
            >
              Our Mission
            </Typography>
            <Box sx={{ width: theme.spacing(10) }} />
          </Box>
          <Typography
            variant="body1"
            paragraph
            sx={{ mb: 2, color: lavenderPalette.text, lineHeight: 1.8 }}
          >
            At **MakeMyForte**, our mission is to empower individuals to craft
            professional, impactful, and personalized resumes with unparalleled
            ease and efficiency. We believe that a well-designed resume is more
            than just a document; it's a powerful tool that unlocks career
            opportunities and showcases your unique strengths.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ mb: 2, color: lavenderPalette.text, lineHeight: 1.8 }}
          >
            We are dedicated to simplifying the resume creation process, making
            it accessible to everyone, from recent graduates to seasoned
            professionals. Our intuitive platform combines cutting-edge design
            with user-friendly features, ensuring your best self is presented to
            prospective employers.
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: lavenderPalette.darkText,
              textAlign: "center",
              mt: 6,
              mb: 4,
            }}
          >
            Our Vision
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ mb: 2, color: lavenderPalette.text, lineHeight: 1.8 }}
          >
            We envision a world where every individual has the confidence and
            tools to effectively communicate their value and land their dream
            job. MakeMyForte strives to be the leading global platform for
            career document creation, continually innovating to meet the
            evolving needs of the job market.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ mb: 2, color: lavenderPalette.text, lineHeight: 1.8 }}
          >
            Through continuous improvement, community feedback, and a passion
            for empowering careers, we aim to be your trusted partner in
            professional growth.
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: lavenderPalette.darkText,
              textAlign: "center",
              mt: 6,
              mb: 4,
            }}
          >
            Our Values
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 3,
              justifyContent: "space-around",
              mt: 4,
            }}
          >
            {[
              {
                title: "Empowerment",
                description: "Giving users the tools to succeed.",
              },
              {
                title: "Simplicity",
                description: "Making complex tasks easy and intuitive.",
              },
              {
                title: "Innovation",
                description: "Continuously improving our offerings.",
              },
              {
                title: "Excellence",
                description:
                  "Striving for the highest quality in everything we do.",
              },
            ].map((value, index) => (
              <Box
                key={value.title}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: lavenderPalette.light,
                  border: `1px solid ${lavenderPalette.medium}`,
                  boxShadow: `0 4px 10px rgba(157, 136, 217, 0.1)`,
                  flex: 1,
                  minWidth: isMobile ? "100%" : "20%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: lavenderPalette.deep, mb: 1 }}
                >
                  {value.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: lavenderPalette.text }}
                >
                  {value.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default AboutUsPage;
