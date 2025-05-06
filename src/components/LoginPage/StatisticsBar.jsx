import { Box, Typography } from "@mui/material";
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

const stats = [
  { number: "15K+", label: "Users" },
  { number: "Modern", label: "Templates" },
  { number: "Responsive", label: "Design" },
];
const StatisticsBar = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: { xs: 3, sm: 4, md: 5 },
        py: 2,
        mt: 4,
        flexWrap: "wrap",
      }}
    >
      {stats.map((stat, index) => (
        <Box
          key={stat.label}
          component={motion.div}
          initial={{ scale: 0.9, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.9 + index * 0.2, duration: 0.5 }}
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 700,
              color: lavenderPalette.deep,
              position: "relative",
              mb: 0.5,
            }}
          >
            {stat.number}
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: index * 0.5,
              }}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                background: `radial-gradient(circle, ${lavenderPalette.medium}30 0%, transparent 70%)`,
                borderRadius: "50%",
                zIndex: -1,
                filter: "blur(8px)",
              }}
            />
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: lavenderPalette.text,
              fontWeight: 500,
            }}
          >
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StatisticsBar;
