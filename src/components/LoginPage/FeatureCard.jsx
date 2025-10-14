import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import React from "react";

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

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
      sx={{ height: "100%" }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: `0 10px 30px ${lavenderPalette.medium}20`,
          transition: "all 0.3s ease",
          height: "100%",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${lavenderPalette.soft}50`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background: lavenderPalette.gradient,
          },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 3 },
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            component={motion.div}
            whileHover={{
              rotate: [0, -10, 10, -5, 0],
              transition: { duration: 0.5 },
            }}
            sx={{
              display: "flex",
              mb: 0,
              height: 56,
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: `linear-gradient(135deg, ${lavenderPalette.medium} 0%, ${lavenderPalette.deep} 100%)`,
                boxShadow: `0 4px 12px ${lavenderPalette.medium}40`,
              }}
            >
              {React.cloneElement(icon, { sx: { color: "white" } })}
            </Avatar>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: lavenderPalette.darkText,
                position: "relative",
                display: "inline-block",
                paddingBottom: 1,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "40%",
                  height: "2px",
                  background: lavenderPalette.gradient,
                },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: alpha(lavenderPalette.text, 0.85),
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeatureCard;
