import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  alpha,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  AutoAwesome as AutoAwesomeIcon,
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

  const ResumeCard = ({ resume, onEdit, onContextMenu, onFindJobs }) => {
  const lastModifiedDate = resume.lastModified
    ? new Date(resume.lastModified)
    : null;
  const lastModifiedText = lastModifiedDate
    ? formatDistanceToNow(lastModifiedDate, { addSuffix: true })
    : "Never modified";

  return (
    <Box
      component={motion.div}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      sx={{ height: "100%" }}
    >
      <Card
        elevation={0}
        onContextMenu={(e) => onContextMenu(e, resume.id)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          border: `1px solid ${lavenderPalette.soft}`,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          boxShadow: `0 10px 30px ${alpha(lavenderPalette.primary, 0.1)}`,
          transition: "all 0.3s ease",
        }}
      >
        <Box
          sx={{
            height: 140,
            background: lavenderPalette.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component={motion.div}
            animate={{ y: [0, -5, 0], rotate: [0, -2, 2, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <DescriptionIcon sx={{ fontSize: 60, opacity: 0.8 }} />
          </Box>
          <Box
            component={motion.div}
            animate={{ rotate: [0, 360], x: [0, 10, 0], y: [0, -5, 0] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 30,
              height: 30,
              borderRadius: 2,
              background: "rgba(255, 255, 255, 0.2)",
              zIndex: 0,
            }}
          />
          <Box
            component={motion.div}
            animate={{ rotate: [0, -360], x: [0, -10, 0], y: [0, 15, 0] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            sx={{
              position: "absolute",
              bottom: 20,
              left: 20,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              zIndex: 0,
            }}
          />

          {resume.completionPercentage < 100 && (
            <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
              <LinearProgress
                variant="determinate"
                value={resume.completionPercentage}
                sx={{
                  height: 5,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  "& .MuiLinearProgress-bar": { backgroundColor: "white" },
                }}
              />
            </Box>
          )}
          {resume.completionPercentage === 100 && (
            <Box
              component={motion.div}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              sx={{ position: "absolute", top: 12, right: 12 }}
            >
              <Chip
                label="Complete"
                color="success"
                size="small"
                icon={<AutoAwesomeIcon fontSize="small" />}
                sx={{
                  fontWeight: "bold",
                  background: "rgba(255,255,255,0.9)",
                  color: lavenderPalette.deep,
                  "& .MuiChip-icon": { color: lavenderPalette.deep },
                }}
              />
            </Box>
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
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
              mt: 1,
              color: lavenderPalette.text,
            }}
          >
            <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
            <Typography variant="body2"> {lastModifiedText} </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: lavenderPalette.text }}
              >
                {" "}
                Completion: {resume.completionPercentage}%{" "}
              </Typography>
              <Typography
                variant="body2"
                component={motion.div}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                sx={{
                  color:
                    resume.completionPercentage === 100
                      ? "success.main"
                      : "inherit",
                }}
              >
                {" "}
                {resume.completionPercentage === 100
                  ? "✓ Complete"
                  : `${5 -
                  Object.values(resume.sections || {}).filter(Boolean)
                    .length
                  } sections left`}{" "}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={resume.completionPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(lavenderPalette.soft, 0.3),
                "& .MuiLinearProgress-bar": {
                  background: lavenderPalette.gradient,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 3 }}>
            {resume.sections?.hasPersonalInfo && (
              <Chip
                label="Personal Info"
                size="small"
                sx={{
                  backgroundColor: alpha(lavenderPalette.medium, 0.1),
                  color: lavenderPalette.deep,
                  borderRadius: 4,
                  fontWeight: 500,
                  border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}`,
                }}
              />
            )}
            {resume.sections?.hasEducation && (
              <Chip
                label="Education"
                size="small"
                sx={{
                  backgroundColor: alpha(lavenderPalette.medium, 0.1),
                  color: lavenderPalette.deep,
                  borderRadius: 4,
                  fontWeight: 500,
                  border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}`,
                }}
              />
            )}
            {resume.sections?.hasExperience && (
              <Chip
                label="Experience"
                size="small"
                sx={{
                  backgroundColor: alpha(lavenderPalette.medium, 0.1),
                  color: lavenderPalette.deep,
                  borderRadius: 4,
                  fontWeight: 500,
                  border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}`,
                }}
              />
            )}
            {resume.sections?.hasSkills && (
              <Chip
                label="Skills"
                size="small"
                sx={{
                  backgroundColor: alpha(lavenderPalette.medium, 0.1),
                  color: lavenderPalette.deep,
                  borderRadius: 4,
                  fontWeight: 500,
                  border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}`,
                }}
              />
            )}
            {resume.sections?.hasProjects && (
              <Chip
                label="Projects"
                size="small"
                sx={{
                  backgroundColor: alpha(lavenderPalette.medium, 0.1),
                  color: lavenderPalette.deep,
                  borderRadius: 4,
                  fontWeight: 500,
                  border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}`,
                }}
              />
            )}
          </Box>
        </CardContent>
        <Divider sx={{ backgroundColor: lavenderPalette.soft }} />
        <CardActions
          sx={{
            justifyContent: "flex-end",
            p: 2,
            backgroundColor: alpha(lavenderPalette.light, 0.3),
          }}
        >
          <Box>
            <Tooltip title="Edit Resume">
              <IconButton
                size="small"
                onClick={() => onEdit(resume.id)}
                sx={{
                  backgroundColor: alpha(lavenderPalette.medium, 0.1),
                  color: lavenderPalette.deep,
                  "&:hover": {
                    backgroundColor: alpha(lavenderPalette.medium, 0.2),
                  },
                  mr: 1,
                }}
              >
                {" "}
                <EditIcon fontSize="small" />{" "}
              </IconButton>
            </Tooltip>
            <Tooltip title="Find Jobs">
              <IconButton
                size="small"
                onClick={() => onFindJobs && onFindJobs(resume.title)}
                sx={{
                  backgroundColor: alpha(lavenderPalette.medium, 0.05),
                  color: lavenderPalette.deep,
                  mr: 1,
                }}
              >
                <DescriptionIcon fontSize="small" />
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
        </CardActions>
      </Card>
    </Box>
  );
};

export default ResumeCard;
