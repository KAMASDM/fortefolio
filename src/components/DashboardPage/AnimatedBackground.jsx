import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

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

const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        zIndex: -2,
        background: `linear-gradient(135deg, ${
          lavenderPalette.light
        } 0%, ${alpha(lavenderPalette.soft, 0.7)} 100%)`,
      }}
    >
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
        sx={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${lavenderPalette.medium}15 0%, ${lavenderPalette.medium}00 70%)`,
          filter: "blur(60px)",
        }}
      />
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: "35%",
          height: "35%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${lavenderPalette.deep}15 0%, ${lavenderPalette.deep}00 70%)`,
          filter: "blur(60px)",
        }}
      />
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        sx={{
          position: "absolute",
          top: "40%",
          left: "60%",
          width: "25%",
          height: "25%",
          borderRadius: "60% 40% 70% 30% / 60% 30% 70% 40%",
          background: `linear-gradient(45deg, ${lavenderPalette.soft}20, ${lavenderPalette.primary}15)`,
          filter: "blur(40px)",
        }}
      />
    </Box>
  );
};

export default AnimatedBackground;
