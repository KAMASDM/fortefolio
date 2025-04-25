import { alpha, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
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

const StatCard = ({
  icon,
  title,
  value,
  delay,
  color = lavenderPalette.primary,
}) => (
  <Grid item xs={12} sm={4}>
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          textAlign: "center",
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${lavenderPalette.soft}`,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: `0 10px 20px ${lavenderPalette.medium}15`,
        }}
      >
        <Box
          component={motion.div}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${alpha(
              color,
              0.1
            )} 0%, ${alpha(color, 0.05)} 100%)`,
            zIndex: 0,
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            component={motion.div}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            sx={{
              display: "inline-flex",
              backgroundColor: alpha(color, 0.1),
              borderRadius: "50%",
              p: 1.5,
              mb: 2,
              color: color,
            }}
          >
            {" "}
            {icon}{" "}
          </Box>
          <Typography
            variant="h3"
            component="div"
            sx={{ fontWeight: 700, color: color, mb: 1 }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.5 }}
            >
              {" "}
              {value}{" "}
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: lavenderPalette.text, fontWeight: 500 }}
          >
            {" "}
            {title}{" "}
          </Typography>
        </Box>
      </Paper>
    </Box>
  </Grid>
);

export default StatCard;
