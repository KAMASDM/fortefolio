import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";

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

const Footer = () => {
  return (
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
          to="/terms-and-conditions"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Terms and Conditions
        </Link>{" "}
        |{" "}
        <Link
          to="/copyright"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Copyright
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
  );
};

export default Footer;
