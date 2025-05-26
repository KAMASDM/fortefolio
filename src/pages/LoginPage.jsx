import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import EditIcon from "@mui/icons-material/Edit";
import GoogleIcon from "@mui/icons-material/Google";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionIcon from "@mui/icons-material/Description";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
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

function LoginPage() {
  const { handleGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoverButton, setHoverButton] = useState(false);

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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: { xs: 3, md: 4 },
            mt: { xs: 2, md: 3 },
          }}
        >
          <Box
            component={motion.div}
            animate={{
              rotate: [0, 10, 0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.3 },
            }}
          >
            <ForteFolioLogo
              width={isSmall ? 50 : 70}
              height={isSmall ? 50 : 70}
            />
          </Box>
          <Typography
            variant={isSmall ? "h4" : "h3"}
            component="h1"
            sx={{
              ml: 2,
              fontWeight: 800,
              background: lavenderPalette.gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 4px 12px ${lavenderPalette.medium}30`,
              position: "relative",
            }}
          >
            MakeMyForte
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              sx={{
                position: "absolute",
                top: -10,
                right: -15,
                color: lavenderPalette.deep,
              }}
            >
              <AutoAwesomeIcon fontSize="small" />
            </Box>
          </Typography>
        </Box>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 400,
            color: lavenderPalette.text,
          }}
          align="center"
        >
          Create professional resumes that help you stand out and land your
          dream job
        </Typography>
        <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            gap={6}
            mt={8}
            width="100%"
          >
            <Box
              flex={1}
              sx={{
                textAlign: { xs: "center", md: "left" },
                mb: { xs: 4, md: 0 },
                order: { xs: 2, md: 0 },
              }}
            >
              <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
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
            <Divider
              flexItem
              orientation="vertical"
              sx={{
                width: "4px",
                display: { xs: "none", md: "block" },
                backgroundImage: lavenderPalette.accentGradient,
                borderRadius: "2px",
              }}
            />
            <Box
              flexShrink={0}
              sx={{
                width: { xs: "100%", sm: "100%", md: "auto" },
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                mb: 4,
                order: { xs: 1, md: 0 },
              }}
            >
              <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
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
                        position: "relative",
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
                          animate={{
                            rotate: [0, 360],
                          }}
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
                        animate={{
                          width: ["0%", "100%", "0%"],
                        }}
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
                    <Box
                      component={motion.div}
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.97 }}
                      sx={{ width: "100%" }}
                      onHoverStart={() => setHoverButton(true)}
                      onHoverEnd={() => setHoverButton(false)}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={
                          isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <Box
                              component={motion.div}
                              animate={
                                hoverButton
                                  ? {
                                      rotate: [0, -10, 10, -5, 0],
                                    }
                                  : {}
                              }
                              transition={{ duration: 0.5 }}
                            >
                              <GoogleIcon />
                            </Box>
                          )
                        }
                        onClick={onGoogleSignIn}
                        disabled={isLoading}
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
                            "&::before": {
                              left: "100%",
                            },
                          },
                        }}
                      >
                        {isLoading ? "Signing In..." : "Continue with Google"}
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
                    </Box>
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
                        sx={{
                          color: lavenderPalette.text,
                          fontStyle: "italic",
                        }}
                      >
                        Setup takes less than 1 minute
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            </Box>
          </Box>
          <StatisticsBar />
          <TestimonialBadge />
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}

export default LoginPage;
