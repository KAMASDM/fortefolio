import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
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
  CircularProgress, // Added for loading indicator
} from "@mui/material";
import {
  Share as ShareIcon,
  Email as EmailIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { ResumeTemplateContent } from "./ResumeTemplateContent";
import { constants } from "../ResumePreview/constants";
import { formatDate, isSectionEmpty, getInitials } from "../utils/resumeUtils";
import PreviewWrapper from "../Templates/PreviewWrapper";
import { getPublishedResume } from "../../../services/resumeService";

const { TEMPLATES, FONTS, COLOR_SCHEMES } = constants;

const ResumeOnlyView = () => {
  const { userId, resumeId } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const {
    activeTemplate = TEMPLATES.MODERN,
    fontFamily = FONTS.POPPINS,
    colorScheme = COLOR_SCHEMES.BLUE,
  } = location.state || {};

  useEffect(() => {
    const fetchResumeData = async () => {
      if (!userId || !resumeId) {
        setError("User ID or Resume ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const data = await getPublishedResume(userId, resumeId);
        if (data) {
          const presentation = data.presentation || {};
          const formattedData = {
            id: resumeId,
            personalInfo: data.resumeData?.personalInfo || {},
            education: data.resumeData?.education || [],
            experience: data.resumeData?.experience || [],
            skills: data.resumeData?.skills || [],
            projects: data.resumeData?.projects || [],
            references: data.resumeData?.references || [],
            activeTemplate: presentation.template || activeTemplate,
            fontFamily: presentation.fontFamily || fontFamily,
            colorScheme:
              COLOR_SCHEMES[
                String(presentation.colorScheme || "blue").toUpperCase()
              ] || colorScheme,
            fontSize: presentation.fontSize || 10,
            sectionOrder: presentation.sectionOrder || [],
            starredSections: presentation.starredSections || [],
          };
          setResumeData(formattedData);
        } else {
          setError("Resume not found.");
        }
      } catch (err) {
        console.error("Firebase fetch error:", err);
        setError("Failed to fetch resume data.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [userId, resumeId, activeTemplate, fontFamily, colorScheme]);

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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Resume...</Typography>
      </Box>
    );
  }

  if (error || !resumeData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error || "Resume data not found."}
        </Typography>
        <Typography variant="body1">
          Please check the URL or generate the resume again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        margin: "auto",
        minHeight: "100vh",
        fontFamily: resumeData.fontFamily,
        color: theme.palette.text.primary,
        position: "relative",
        width: "100%", // Instead of minWidth
        marginInline: "8px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ResumeTemplateContent
        resumeData={resumeData}
        activeTemplate={resumeData.activeTemplate}
        fontFamily={resumeData.fontFamily}
        colorScheme={resumeData.colorScheme}
        isSectionEmpty={(section) => isSectionEmpty(section, resumeData)}
        getInitials={getInitials}
        formatDate={formatDate}
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
        starredSections={resumeData.starredSections}
        sectionOrder={resumeData.sectionOrder}
        fontSize={resumeData.fontSize}
        toggleStarSection={() => {}}
      />
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
