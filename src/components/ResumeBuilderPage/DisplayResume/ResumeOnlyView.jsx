import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Share as ShareIcon,
  Email as EmailIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { ResumeTemplateContent } from "./ResumeTemplateContent";
import { constants } from "../Templates/constants";
import { formatDate, isSectionEmpty, getInitials } from "../utils/resumeUtils";

const { TEMPLATES, FONTS, COLOR_SCHEMES } = constants;

const ResumeOnlyView = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const {
    resumeData,
    activeTemplate = TEMPLATES.MODERN,
    fontFamily = FONTS.POPPINS,
    colorScheme = COLOR_SCHEMES.BLUE,
  } = location.state || {};

  const currentUrl = window.location.href;

  const handleShare = (platform) => {
    switch (platform) {
      case "email":
        window.open(
          `mailto:?subject=Check out this resume&body=${encodeURIComponent(
            currentUrl
          )}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(currentUrl).then(() => {
          setSnackbarMessage("Link copied to clipboard!");
          setOpenSnackbar(true);
        });
        break;
      default:
        if (navigator.share) {
          navigator
            .share({
              title: "Resume",
              url: currentUrl,
            })
            .catch((err) => console.error("Error sharing:", err));
        } else {
          navigator.clipboard.writeText(currentUrl).then(() => {
            setSnackbarMessage("Link copied to clipboard!");
            setOpenSnackbar(true);
          });
        }
    }
  };

  const shareActions = [
    { icon: <EmailIcon />, name: "Email", action: () => handleShare("email") },
    {
      icon: <CopyIcon />,
      name: "Copy Link",
      action: () => handleShare("copy"),
    },
  ];

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (!resumeData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Resume data not found.
        </Typography>
        <Typography variant="body1">
          Please generate the resume from the main application.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1100px",
        margin: "auto",
        minHeight: "100vh",
        fontFamily: fontFamily,
        color: theme.palette.text.primary,
        position: "relative",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          boxShadow: 3,
          p: { xs: 2, sm: 3, md: 4 },
        }}
        className="resume-container"
      >
        <ResumeTemplateContent
          resumeData={resumeData}
          activeTemplate={activeTemplate}
          fontFamily={fontFamily}
          colorScheme={colorScheme}
          isSectionEmpty={(section) => isSectionEmpty(section, resumeData)}
          getInitials={getInitials}
          formatDate={formatDate}
          isMobile={isMobile}
          isSmallMobile={isSmallMobile}
          starredSections={[]}
          toggleStarSection={() => {}}
        />
      </Box>
      <SpeedDial
        ariaLabel="Share Resume"
        sx={{
          position: "fixed",
          right: { xs: 16, sm: 24, md: 30 },
          bottom: { xs: 16, sm: 24, md: 30 },
        }}
        icon={<SpeedDialIcon openIcon={<ShareIcon />} />}
        direction="up"
      >
        {shareActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeOnlyView;
