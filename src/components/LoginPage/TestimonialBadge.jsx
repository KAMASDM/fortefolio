import { Box, Paper, Typography } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
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
const TestimonialBadge = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      sx={{
        mt: 4,
        mb: { xs: 4, md: 0 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          py: 1.5,
          px: { xs: 2, sm: 3 },
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          gap: 1,
          border: `1px solid ${lavenderPalette.soft}`,
          boxShadow: `0 8px 16px ${lavenderPalette.medium}15`,
          textAlign: "center",
        }}
      >
        <VerifiedIcon
          sx={{
            color: lavenderPalette.deep,
            fontSize: 20,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: lavenderPalette.text,
            fontWeight: 500,
          }}
        >
          "ForteFolio helped me land my dream job!" - Sarah K.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestimonialBadge;
