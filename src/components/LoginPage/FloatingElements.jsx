import { useTheme } from "@emotion/react";
import { Box, useMediaQuery } from "@mui/material";
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

const FloatingElements = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const numElements = isMobile ? 8 : 15;
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {[...Array(numElements)].map((_, i) => {
        const size = Math.random() * (isMobile ? 20 : 30) + (isMobile ? 8 : 10);
        const shapes = [
          <Box
            key={`shape-circle-${i}`}
            component={motion.div}
            sx={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              background: `${lavenderPalette.soft}20`,
              border: `1px solid ${lavenderPalette.medium}30`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0.7, 1, 0.7],
              rotate: [0, Math.random() > 0.5 ? 180 : -180, 0],
              x: [0, Math.random() * 40 - 20, 0],
              y: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />,
          <Box
            key={`shape-square-${i}`}
            component={motion.div}
            sx={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "4px",
              background: `${lavenderPalette.soft}20`,
              border: `1px solid ${lavenderPalette.medium}30`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0.7, 1, 0.7],
              rotate: [0, Math.random() > 0.5 ? 90 : -90, 0],
              x: [0, Math.random() * 40 - 20, 0],
              y: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />,
          <Box
            key={`shape-triangle-${i}`}
            component={motion.div}
            sx={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid ${lavenderPalette.soft}20`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0.7, 1, 0.7],
              rotate: [0, Math.random() > 0.5 ? 120 : -120, 0],
              x: [0, Math.random() * 40 - 20, 0],
              y: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />,
        ];
        return shapes[Math.floor(Math.random() * shapes.length)];
      })}
    </Box>
  );
};

export default FloatingElements;
