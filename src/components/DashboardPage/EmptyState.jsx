import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import {
  Add as AddIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

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

const EmptyState = ({ onCreateNew }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    sx={{ textAlign: "center", py: 8, px: 3 }}
  >
    <Box
      component={motion.div}
      animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
      transition={{ duration: 5, repeat: Infinity }}
      sx={{ mb: 3, display: "inline-block" }}
    >
      <DescriptionIcon
        sx={{ fontSize: 100, color: lavenderPalette.medium, opacity: 0.7 }}
      />
    </Box>
    <Typography
      variant="h4"
      gutterBottom
      sx={{ fontWeight: 700, color: lavenderPalette.darkText }}
    >
      {" "}
      Create Your First Resume{" "}
    </Typography>
    <Typography
      variant="h6"
      sx={{ maxWidth: 600, mx: "auto", mb: 4, color: lavenderPalette.text }}
    >
      {" "}
      Start building your professional resume and unlock your career potential.{" "}
    </Typography>
    <Box
      component={motion.div}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        onClick={onCreateNew}
        sx={{
          py: 1.5,
          px: 3,
          borderRadius: 8,
          background: lavenderPalette.gradient,
          textTransform: "none",
          fontSize: "1.1rem",
          fontWeight: 600,
          boxShadow: `0 10px 20px ${lavenderPalette.medium}30`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${lavenderPalette.soft}40, transparent)`,
            transition: "all 0.6s ease",
          },
          "&:hover": {
            boxShadow: `0 15px 25px ${lavenderPalette.medium}40`,
            "&::before": { left: "100%" },
          },
        }}
      >
        {" "}
        Create Your First Resume{" "}
      </Button>
    </Box>
  </Box>
);

export default EmptyState;
