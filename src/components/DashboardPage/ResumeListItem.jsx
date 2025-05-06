import {
  alpha,
  Avatar,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  Description as DescriptionIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
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

const ResumeListItem = ({ resume, onEdit, onPreview, onContextMenu }) => {
  const lastModifiedDate = resume.lastModified
    ? new Date(resume.lastModified)
    : null;
  const lastModifiedText = lastModifiedDate
    ? formatDistanceToNow(lastModifiedDate, { addSuffix: true })
    : "Never modified";

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ x: 5 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          border: `1px solid ${lavenderPalette.soft}`,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          boxShadow: `0 8px 25px ${alpha(lavenderPalette.primary, 0.08)}`,
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            background: lavenderPalette.gradient,
            borderRadius: "3px 0 0 3px",
          },
        }}
        onContextMenu={(e) => onContextMenu(e, resume.id)}
      >
        <Avatar
          sx={{
            background: lavenderPalette.gradient,
            width: 48,
            height: 48,
            ml: 1,
          }}
        >
          {" "}
          <DescriptionIcon />{" "}
        </Avatar>
        <Box sx={{ ml: 2, flexGrow: 1, overflow: "hidden" }}>
          <Typography
            variant="h6"
            component="div"
            noWrap
            title={resume.title}
            sx={{ fontWeight: 600, color: lavenderPalette.darkText }}
          >
            {" "}
            {resume.title}{" "}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: lavenderPalette.text,
              }}
            >
              <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: 14 }} />
              <Typography variant="body2"> {lastModifiedText} </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LinearProgress
                variant="determinate"
                value={resume.completionPercentage}
                sx={{
                  width: 100,
                  height: 6,
                  borderRadius: 3,
                  mr: 1,
                  backgroundColor: alpha(lavenderPalette.soft, 0.3),
                  "& .MuiLinearProgress-bar": {
                    background: lavenderPalette.gradient,
                    borderRadius: 3,
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: lavenderPalette.text }}
              >
                {" "}
                {resume.completionPercentage}%{" "}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: { xs: 0.5, sm: 1 },
            alignItems: "center",
          }}
        >
          {" "}
          <Tooltip title="Preview">
            <IconButton
              size="small"
              onClick={() => onPreview(resume.id)}
              sx={{
                color: lavenderPalette.deep,
                "&:hover": {
                  backgroundColor: alpha(lavenderPalette.medium, 0.1),
                },
              }}
            >
              {" "}
              <VisibilityIcon />{" "}
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit(resume.id)}
              sx={{
                color: lavenderPalette.deep,
                "&:hover": {
                  backgroundColor: alpha(lavenderPalette.medium, 0.1),
                },
              }}
            >
              {" "}
              <EditIcon />{" "}
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options">
            <IconButton
              size="small"
              onClick={(e) => onContextMenu(e, resume.id)}
              sx={{
                color: lavenderPalette.text,
                "&:hover": {
                  backgroundColor: alpha(lavenderPalette.medium, 0.1),
                },
              }}
            >
              {" "}
              <MoreVertIcon fontSize="small" />{" "}
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResumeListItem;
