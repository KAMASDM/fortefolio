import { Box } from "@mui/material";
import { motion } from "framer-motion";

const lavenderPalette = {
  light: "#EAE4F7", // Lighter background shade
  soft: "#D8CCF0", // Soft lavender
  medium: "#B9A5E3", // Medium lavender
  primary: "#9D88D9", // Primary lavender
  deep: "#7F68C9", // Deeper accent
  text: "#4A3B77", // Text color
  darkText: "#2E2152", // Dark text color
  gradient: "linear-gradient(135deg, #B9A5E3 0%, #7F68C9 100%)",
  accentGradient: "linear-gradient(45deg, #A190DD 30%, #7F68C9 90%)",
};

const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        zIndex: -1,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${lavenderPalette.light} 0%, ${lavenderPalette.soft} 100%)`,
        }}
      />

      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        sx={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: { xs: "50%", md: "40%" },
          height: { xs: "50%", md: "40%" },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${lavenderPalette.medium}20 0%, ${lavenderPalette.medium}00 70%)`,
          filter: "blur(60px)",
        }}
      />

      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -20, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: { xs: "45%", md: "35%" },
          height: { xs: "45%", md: "35%" },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${lavenderPalette.deep}20 0%, ${lavenderPalette.deep}00 70%)`,
          filter: "blur(60px)",
        }}
      />

      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        sx={{
          position: "absolute",
          top: "40%",
          left: { xs: "50%", md: "60%" },
          width: { xs: "30%", md: "25%" },
          height: { xs: "30%", md: "25%" },
          borderRadius: "60% 40% 70% 30% / 60% 30% 70% 40%",
          background: `linear-gradient(45deg, ${lavenderPalette.soft}30, ${lavenderPalette.primary}20)`,
          filter: "blur(40px)",
        }}
      />
    </Box>
  );
};

export default AnimatedBackground;
