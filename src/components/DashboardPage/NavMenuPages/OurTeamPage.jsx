import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import ForteFolioLogo from "../ForteFolioLogo";
import AnimatedBackground from "../AnimatedBackground";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FloatingElements from "../FloatingElements";
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

const teamMembers = [
  {
    name: "Jeegar Desai",
    role: "Founder & CEO",
    bio: "Visionary leader passionate about empowering individuals through impactful resumes. Driving the strategic direction and growth of MakeMyForte.",
    avatar: "https://via.placeholder.com/150/9D88D9/FFFFFF?text=AA",
  },
  {
    name: "Sandeep Patel",
    role: "Co-Founder",
    bio: "Co-founder and strategic visionary behind the growth and direction of our platform.",
    avatar: "https://via.placeholder.com/150/7F68C9/FFFFFF?text=SP",
  },
  {
    name: "Sagar Ramani",
    role: "Developer",
    bio: "Crafting intuitive and aesthetically pleasing interfaces that make resume building a joy.",
    avatar: "https://via.placeholder.com/150/B9A5E3/FFFFFF?text=SR",
  },
  {
    name: "Darshan Patel",
    role: "Developer",
    bio: "Focused on building efficient and scalable solutions that power the backbone of MakeMyForte.",
    avatar: "https://via.placeholder.com/150/8F73D2/FFFFFF?text=DP",
  },
];

function OurTeamPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
              MakeMyForte Team
            </Typography>
          </Box>
        </Box>

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

          <Box sx={{ width: theme.spacing(10) }} />
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: `0 12px 30px rgba(157, 136, 217, 0.2)`,
                }}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${lavenderPalette.soft}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <Avatar
                  alt={member.name}
                  src={member.avatar}
                  sx={{
                    width: isMobile ? 100 : 120,
                    height: isMobile ? 100 : 120,
                    mb: 2,
                    border: `4px solid ${lavenderPalette.medium}`,
                    boxShadow: `0 4px 10px rgba(157, 136, 217, 0.2)`,
                  }}
                />
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, color: lavenderPalette.darkText }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mb: 1, color: lavenderPalette.deep, fontWeight: 500 }}
                >
                  {member.role}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: lavenderPalette.text }}
                >
                  {member.bio}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default OurTeamPage;
