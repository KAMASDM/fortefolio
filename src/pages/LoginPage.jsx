import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  useTheme,
  useMediaQuery,
  alpha,
  Avatar,
  Divider,
  IconButton,
  Drawer,
  List,
  ListItem, 
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import GroupIcon from "@mui/icons-material/Group";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import BoltIcon from "@mui/icons-material/Bolt";
import EditIcon from "@mui/icons-material/Edit";
import GoogleIcon from "@mui/icons-material/Google";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from "@mui/icons-material/Description";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MenuIcon from "@mui/icons-material/Menu";

import Footer from "../components/Footer/Footer";
import FeatureCard from "../components/LoginPage/FeatureCard";
import StatisticsBar from "../components/LoginPage/StatisticsBar";
import ForteFolioLogo from "../components/LoginPage/ForteFolioLogo";
import FloatingElements from "../components/LoginPage/FloatingElements";
import TestimonialBadge from "../components/LoginPage/TestimonialBadge";
import AnimatedBackground from "../components/LoginPage/AnimatedBackground";

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

const features = [
  {
    icon: <DescriptionIcon fontSize="medium" />,
    title: "Professional Templates",
    description:
      "Build standout resumes with beautiful templates designed by career Experts for Every Industry",
  },
  {
    icon: <EditIcon fontSize="medium" />,
    title: "Smart Editor",
    description:
      "Our intelligent editor makes creating and updating your resume effortless with real-time feedback",
  },
  {
    icon: <PhoneAndroidIcon fontSize="medium" />,
    title: "Work Anywhere",
    description:
      "Access your portfolio from any device - build on desktop, edit on mobile, share from anywhere",
  },
  {
    icon: <BoltIcon fontSize="medium" />,
    title: "Instant Sharing",
    description:
      "Share your resume via email, custom link, or download as a perfectly formatted PDF in seconds",
  },
];

const navItems = [
  {
    text: "About Us",
    icon: <InfoIcon sx={{ color: lavenderPalette.primary }} />,
    to: "/about-us",
  },
  {
    text: "Our Team",
    icon: <GroupIcon sx={{ color: lavenderPalette.primary }} />,
    to: "/our-team",
  },
  {
    text: "Blog",
    icon: <ReceiptIcon sx={{ color: lavenderPalette.primary }} />,
    to: "/blogs",
  },
  {
    text: "Contact Us",
    icon: <ContactPageIcon sx={{ color: lavenderPalette.primary }} />,
    to: "/contact-us",
  },
];

function LoginPage() {
  const { handleGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoverButton, setHoverButton] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const success = await handleGoogleLogin();
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Login cancelled or failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login Page Error:", err);
      setError("An unexpected error occurred during login. Please try again.");
      setIsLoading(false);
    }
  };

  const drawerWidth = 240;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AnimatedBackground />
      <FloatingElements />
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: "100vh",
          zIndex: 1,
        }}
      >
        <Box
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Container maxWidth="lg">
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Box
                component={motion.div}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: { xs: isSmall && !mobileOpen ? 1 : 0, sm: 0 }, // Adjust margin if wrapping occurs
                }}
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
                  variant="h6"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: lavenderPalette.gradient,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  MakeMyForte
                </Typography>
              </Box>

              {isSmall ? (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{ color: lavenderPalette.text }}
                >
                  <MenuIcon fontSize="large" />
                </IconButton>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 2 },
                    flexWrap: "wrap",
                    justifyContent: { sm: "flex-end" },
                    width: { sm: "auto" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 0.5, sm: 1 }, // Gap between buttons
                      // mr: { xs: 0, sm: 2 }, // Margin right for the button group
                      // order: { xs: 1, sm: 0 }, // This was in original, implies ordering relative to siblings not shown in snippet
                      // If this is the only child of its parent, 'order' has no direct effect.
                      // For simplicity and direct application of user's snippet, these are kept.
                    }}
                  >
                    <Button
                      component={Link}
                      to="/about-us"
                      size={"medium"}
                      startIcon={<InfoIcon />}
                      sx={{
                        color: lavenderPalette.text,
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 6,
                        px: { xs: 1, sm: 2 },
                        py: { xs: 0.5, sm: 1 },
                        border: `1px solid transparent`,
                        "&:hover": {
                          backgroundColor: lavenderPalette.light,
                          borderColor: lavenderPalette.soft,
                        },
                      }}
                    >
                      About Us
                    </Button>
                    <Button
                      component={Link}
                      to="/our-team"
                      size={"medium"}
                      startIcon={<GroupIcon />}
                      sx={{
                        color: lavenderPalette.text,
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 6,
                        px: { xs: 1, sm: 2 },
                        py: { xs: 0.5, sm: 1 },
                        border: `1px solid transparent`,
                        "&:hover": {
                          backgroundColor: lavenderPalette.light,
                          borderColor: lavenderPalette.soft,
                        },
                      }}
                    >
                      Our Team
                    </Button>
                    <Button
                      component={Link}
                      to="/blogs"
                      size={"medium"}
                      startIcon={<ReceiptIcon />}
                      sx={{
                        color: lavenderPalette.text,
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 6,
                        px: { xs: 1, sm: 2 },
                        py: { xs: 0.5, sm: 1 },
                        border: `1px solid transparent`,
                        "&:hover": {
                          backgroundColor: lavenderPalette.light,
                          borderColor: lavenderPalette.soft,
                        },
                      }}
                    >
                      Blog
                    </Button>
                    <Button
                      component={Link}
                      to="/contact-us"
                      size={"medium"}
                      startIcon={<ContactPageIcon />}
                      sx={{
                        color: lavenderPalette.text,
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 6,
                        px: { xs: 1, sm: 2 },
                        py: { xs: 0.5, sm: 1 },
                        border: `1px solid transparent`,
                        "&:hover": {
                          backgroundColor: lavenderPalette.light,
                          borderColor: lavenderPalette.soft,
                        },
                      }}
                    >
                      Contact Us
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Container>
        </Box>
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: lavenderPalette.light,
              paddingTop: 2,
            },
          }}
        >
          <Box sx={{ textAlign: "center" }} role="presentation">
            <List>
              {navItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.to}
                    onClick={handleDrawerToggle}
                  >
                    {" "}
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{ color: lavenderPalette.darkText, fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 400,
            color: lavenderPalette.text,
            mt: 2,
          }}
          align="center"
        >
          Create professional resumes that help you stand out and land your
          dream job
        </Typography>
        <Grid
          container
          spacing={4}
          sx={{
            mt: { xs: 2, md: 4 },
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
            {" "}
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Grid
                container
                spacing={{ xs: 2, sm: 3 }}
                sx={{ mb: { xs: 4, md: 0 } }}
              >
                {" "}
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={feature.title}>
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      delay={0.4 + index * 0.15}
                      index={index}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          <Grid
            item
            md={1}
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              order: { md: 2 },
            }}
          >
            <Divider
              flexItem
              orientation="vertical"
              sx={{
                minHeight: "200px",
                backgroundImage: lavenderPalette.accentGradient,
                borderRadius: "2px",
              }}
            />
          </Grid>

          <Grid item xs={12} md={5} sx={{ order: { xs: 1, md: 3 } }}>
            {" "}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                component={motion.div}
                whileHover={{
                  boxShadow: `0 30px 100px ${lavenderPalette.primary}30`,
                  transition: { duration: 0.3 },
                }}
                sx={{
                  width: "100%",
                  maxWidth: "430px",
                  position: "relative",
                  mx: "auto",
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -15,
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background: lavenderPalette.medium,
                    transform: "rotate(15deg)",
                    zIndex: 0,
                  }}
                />
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  sx={{
                    position: "absolute",
                    bottom: -15,
                    left: -15,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: lavenderPalette.deep,
                    zIndex: 0,
                  }}
                />
                <Paper
                  elevation={16}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    borderRadius: 4,
                    backdropFilter: "blur(20px)",
                    background: "rgba(255, 255, 255, 0.9)",
                    boxShadow: `0 20px 80px ${lavenderPalette.primary}25`,
                    position: "relative",
                    overflow: "hidden",
                    border: `1px solid ${lavenderPalette.soft}70`,
                    zIndex: 1,
                    mb: { xs: 4, md: 0 },
                  }}
                >
                  <Box
                    component={motion.div}
                    whileHover={{
                      y: -5,
                      boxShadow: `0 20px 30px ${lavenderPalette.primary}30`,
                      transition: { duration: 0.3 },
                    }}
                    sx={{
                      backgroundColor: lavenderPalette.medium,
                      borderRadius: "50%",
                      padding: 1.5,
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 112,
                      height: 112,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: "white",
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <Box
                        component={motion.div}
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        sx={{
                          position: "absolute",
                          top: "-6px",
                          left: "-6px",
                          width: "calc(100% + 12px)",
                          height: "calc(100% + 12px)",
                          borderRadius: "50%",
                          border: `4px dashed ${lavenderPalette.soft}70`,
                        }}
                      />
                      <ForteFolioLogo width={50} height={50} />
                    </Avatar>
                  </Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontWeight: "bold",
                      color: lavenderPalette.darkText,
                      textAlign: "center",
                      mb: 1,
                      position: "relative",
                    }}
                  >
                    Welcome to MakeMyForte
                    <Box
                      component={motion.div}
                      animate={{ width: ["0%", "100%", "0%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                      sx={{
                        position: "absolute",
                        bottom: "-4px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        height: "4px",
                        background: lavenderPalette.gradient,
                        borderRadius: "2px",
                      }}
                    />
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 5,
                      textAlign: "center",
                      maxWidth: "320px",
                      color: lavenderPalette.text,
                    }}
                  >
                    Begin your journey to creating impressive, job-winning
                    resumes
                  </Typography>
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        width: "100%",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "error.light",
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={onGoogleSignIn}
                    disabled={isLoading}
                    onMouseEnter={() => setHoverButton(true)}
                    onMouseLeave={() => setHoverButton(false)}
                    sx={{
                      py: 1.8,
                      borderRadius: "16px",
                      textTransform: "none",
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      boxShadow: `0 10px 20px ${lavenderPalette.medium}30`,
                      background: lavenderPalette.gradient,
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(90deg, transparent, ${alpha(
                          lavenderPalette.light,
                          0.4
                        )}, transparent)`,
                        transition: "all 0.6s ease",
                      },
                      "&:hover": {
                        boxShadow: `0 15px 25px ${lavenderPalette.medium}40`,
                        "&::before": { left: "100%" },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <Box
                          component={motion.div}
                          animate={
                            hoverButton ? { rotate: [0, -10, 10, -5, 0] } : {}
                          }
                          transition={{ duration: 0.5 }}
                          sx={{ display: "flex", alignItems: "center" }} // ensures icon is centered
                        >
                          <GoogleIcon />
                        </Box>
                      )}
                      <Box component="span">
                        {isLoading ? "Signing In..." : "Continue with Google"}
                      </Box>
                    </Box>
                    <AnimatePresence>
                      {hoverButton &&
                        !isLoading &&
                        [...Array(5)].map((_, i) => (
                          <Box
                            key={`particle-${i}`}
                            component={motion.div}
                            initial={{
                              opacity: 1,
                              scale: 0,
                              x: "50%",
                              y: "50%",
                            }}
                            animate={{
                              opacity: 0,
                              scale: Math.random() * 0.5 + 0.5,
                              x: `${(Math.random() - 0.5) * 200}%`,
                              y: `${(Math.random() - 0.5) * 200}%`,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: Math.random() * 0.5 + 0.4,
                            }}
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "white",
                              pointerEvents: "none",
                            }}
                          />
                        ))}
                    </AnimatePresence>
                  </Button>
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    sx={{
                      mt: 3,
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ color: lavenderPalette.primary, fontSize: 16 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: lavenderPalette.text, fontStyle: "italic" }}
                    >
                      Setup takes less than 1 minute
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Grid>
        </Grid>{" "}
        <StatisticsBar />
        <TestimonialBadge />
      </Container>
      <Footer />
    </Box>
  );
}

export default LoginPage;
