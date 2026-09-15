import ResumeNavigationGuard from "../components/ResumeBuilderPage/ResumeNavigationGuard";
import ResumeWorkspaceTools from "../components/ResumeBuilderPage/ResumeWorkspaceTools";
import LiveResumePreview from "../components/ResumeBuilderPage/LiveResumePreview";
import { getResumeInsights } from "../services/resumeInsights";
import React, { useState, useEffect, useMemo } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import AnimatedBackground from "../components/DashboardPage/AnimatedBackground";
import {
  CssBaseline,
  Container,
  Box,
  Paper,
  Drawer,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Button,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  Grow,
  LinearProgress,
  CircularProgress,
  Alert,
  Tooltip,
  Badge,
  useMediaQuery,
  Snackbar,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  ArrowBack as ArrowBackIcon,
  SaveOutlined as SaveIcon,
  EditOutlined as EditIcon,
  ErrorOutline as ErrorIcon,
  DescriptionOutlined as DescriptionIcon,
  SchoolOutlined as SchoolIcon,
  WorkOutlineOutlined as WorkIcon,
  PsychologyOutlined as PsychologyIcon,
  BuildOutlined as ConstructionIcon,
  VisibilityOutlined as VisibilityIcon,
  CheckCircleOutline as CheckCircleIcon,
  DashboardOutlined as DashboardIcon,
  ArrowForward as ArrowForwardIcon,
  PersonOutline as PersonOutlineIcon,
  QuestionAnswerOutlined as QuestionAnswerIcon,
  ArticleOutlined as ArticleIcon,
  GavelOutlined as GavelIcon,
  LightbulbOutlined as LightbulbIcon,
  AutoFixHigh as AutoFixHighIcon,
} from "@mui/icons-material";

import PersonalInfoForm, {
  validatePersonalInfo,
} from "../components/ResumeBuilderPage/Forms/PersonalInfoForm";
import EducationForm from "../components/ResumeBuilderPage/Forms/EducationForm";
import ExperienceForm from "../components/ResumeBuilderPage/Forms/ExperienceForm";
import SkillsForm from "../components/ResumeBuilderPage/Forms/SkillsForm";
import ProjectsForm from "../components/ResumeBuilderPage/Forms/ProjectsForm";
import ReferenceForm from "../components/ResumeBuilderPage/Forms/RefrenceForm";
import ResumePreview from "../components/ResumeBuilderPage/ResumePreview/ResumePreview";
import UpdateResumeName from "../components/ResumeBuilderPage/UpdateResumeName/UpdateResumeName";
import Navbar from "../components/ResumeBuilderPage/NavbarForResumeBuilder/Navbar";
import GeneratedContentDialog from "../components/ResumeBuilderPage/GenerateQuestionDialog/GeneratedContentDialog";
import ResumeTipsDialog from "../components/ResumeBuilderPage/ResumeTipsDialog/ResumeTipsDialog";
import VisaInterviewFormDialog from "../components/ResumeBuilderPage/GenerateQuestionDialog/VisaInterviewFormDialog";
import FloatingElements from "../components/DashboardPage/FloatingElements";
import { getCustomTheme } from "../theme/customTheme";
import SOPFormDialog from "../components/ResumeBuilderPage/GenerateQuestionDialog/SOPFormDialog";
import EnhanceResumeDialog from "../components/ResumeBuilderPage/EnhanceResume/EnhanceResumeDialog";
import { callOpenAI } from "../utils/openai";
import { useResumeEditor } from "../hooks/useResumeEditor";
import { lavenderPalette } from "../components/ResumeBuilderPage/lavenderPalette";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: 8,
    height: 8,
    minWidth: 8,
  },
}));

const AnimatedCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: "all 0.3s ease-in-out",
  position: "relative",
}));

const sections = [
  {
    id: 1,
    key: "personalInfo",
    label: "Personal Info",
    icon: <DescriptionIcon />,
    form: PersonalInfoForm,
  },
  {
    id: 2,
    key: "education",
    label: "Education",
    icon: <SchoolIcon />,
    form: EducationForm,
  },
  {
    id: 3,
    key: "experience",
    label: "Experience",
    icon: <WorkIcon />,
    form: ExperienceForm,
  },
  {
    id: 4,
    key: "skills",
    label: "Skills",
    icon: <PsychologyIcon />,
    form: SkillsForm,
  },
  {
    id: 5,
    key: "projects",
    label: "Projects",
    icon: <ConstructionIcon />,
    form: ProjectsForm,
  },
  {
    id: 6,
    key: "references",
    label: "References",
    icon: <PersonOutlineIcon />,
    form: ReferenceForm,
  },
];

const totalSteps = sections.length;
const previewStepId = totalSteps + 1;

const isSectionComplete = (sectionKey, data) => {
  if (!data) return false;
  switch (sectionKey) {
    case "personalInfo":
      return !!(data.fullName && data.email);
    case "education":
      return (
        data.length > 0 && data.some((item) => item.institution && item.degree)
      );
    case "experience":
      return (
        data.length > 0 && data.some((item) => item.company && item.position)
      );
    case "skills":
      return (
        data.length > 0 &&
        data.some(
          (category) =>
            category.name &&
            category.skills &&
            category.skills.length > 0 &&
            category.skills.some((s) => s.trim() !== ""),
        )
      );
    case "projects":
      return data.length > 0 && data.some((item) => item.title);
    case "references":
      return (
        data.length > 0 &&
        data.some((item) => item.name && item.name.trim() !== "")
      );
    default:
      return false;
  }
};

function ResumeBuilderPage() {
  const { resumeId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  // const systemPrefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  // const [darkMode, setDarkMode] = useState(systemPrefersDarkMode);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => getCustomTheme(darkMode), [darkMode]);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // useEffect(() => {
  //   setDarkMode(systemPrefersDarkMode);
  // }, [systemPrefersDarkMode]);

  const isPreviewMode = searchParams.get("view") === "preview";
  const currentStep = isPreviewMode
    ? previewStepId
    : sections.find((section) => section.key === searchParams.get("step"))
        ?.id || 1;
  const [showLivePreview, setShowLivePreview] = useState(true);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTitleDialog, setShowTitleDialog] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const {
    resumeData,
    replaceResume,
    canUndo,
    canRedo,
    undo,
    redo,
    isOnline,
    shouldBlockNavigation,
    discardDraft,
    resumeMetadata,
    setResumeMetadata,
    presentation,
    updatePresentation,
    updateResumeData,
    unsavedChanges,
    setUnsavedChanges,
    isLoading,
    isSaving,
    error,
    saveError,
    notification,
    setNotification,
    showLeaveConfirmation,
    setShowLeaveConfirmation,
    navigateWithConfirmation,
    handleConfirmedNavigation,
    saveResumeData,
  } = useResumeEditor({
    currentUser,
    resumeId,
    navigate,
    initialPreview: location?.state?.preview === true,
  });

  const [generatedContentTitle, setGeneratedContentTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [showGeneratedContentDialog, setShowGeneratedContentDialog] =
    useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generateContentError, setGenerateContentError] = useState("");
  const [showVisaFormDialog, setShowVisaFormDialog] = useState(false);
  const [showResumeTips, setShowResumeTips] = useState(false);
  const [showSOPFormDialog, setShowSOPFormDialog] = useState(false);
  const [showEnhanceDialog, setShowEnhanceDialog] = useState(false);
  const [aiToolsMenuAnchor, setAiToolsMenuAnchor] = useState(null);
  const [personalInfoErrors, setPersonalInfoErrors] = useState({});
  const sectionOrder = presentation.sectionOrder;

  useEffect(() => {
    if (Object.keys(personalInfoErrors).length === 0) return;
    if (
      Object.keys(validatePersonalInfo(resumeData.personalInfo)).length === 0
    ) {
      setPersonalInfoErrors({});
    }
  }, [resumeData.personalInfo, personalInfoErrors]);

  const completedSections = useMemo(() => {
    const completed = {};
    sections.forEach((sec) => {
      completed[sec.key] = isSectionComplete(sec.key, resumeData[sec.key]);
    });
    return completed;
  }, [resumeData]);

  const completionProgress = useMemo(
    () => getResumeInsights(resumeData).score,
    [resumeData],
  );

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavItemClick = (stepId) => {
    const next = new URLSearchParams(searchParams);
    if (stepId === previewStepId) {
      next.set("view", "preview");
      next.delete("step");
    } else if (sections.some((section) => section.id === stepId)) {
      next.delete("view");
      next.set("step", sections.find((section) => section.id === stepId).key);
    } else return;
    setSearchParams(next);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBottomNavChange = (event, newValue) => {
    if (
      newValue === currentStep ||
      (newValue === previewStepId && isPreviewMode)
    )
      return;
    handleNavItemClick(newValue);
  };

  const nextStep = () => {
    if (!isPreviewMode && currentStep === 1) {
      const errors = validatePersonalInfo(resumeData.personalInfo);
      setPersonalInfoErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    const nextId = isPreviewMode
      ? previewStepId
      : currentStep < totalSteps
        ? currentStep + 1
        : previewStepId;
    handleNavItemClick(nextId);
  };

  const prevStep = () => {
    const prevId = isPreviewMode
      ? totalSteps
      : currentStep > 1
        ? currentStep - 1
        : 1;
    handleNavItemClick(prevId);
  };

  const handleOpenTitleDialog = () => {
    setCurrentTitle(resumeMetadata.title);
    setShowTitleDialog(true);
  };
  const handleCloseTitleDialog = () => setShowTitleDialog(false);

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleManualSave = () => {
    saveResumeData(true);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const generateContent = async (type, additionalData = null) => {
    if (!currentUser || !resumeId) {
      setGenerateContentError("User not authenticated or resume ID missing.");
      return;
    }

    setGeneratedContentTitle(`Generated ${type}`);
    setShowGeneratedContentDialog(true);
    setIsGeneratingContent(true);
    setGeneratedContent("");
    setGenerateContentError("");

    let fullPrompt = "";
    let apiPayload = {
      model: "gemini-1.5-pro-latest",
      temperature: 0.7,
      max_tokens: 2500, // Increased for detailed content
    };

    if (type === "Statement of Purpose" && additionalData) {
      fullPrompt = `Write a clear, professional statement of purpose using only these supplied facts. Do not invent life stories, funding, academic achievements or goals. If details are missing, explain what the applicant should add. Aim for 600-800 words. Resume: ${JSON.stringify(resumeData)}. Application details: ${JSON.stringify(additionalData)}`;

      apiPayload = {
        model: "gemini-1.5-pro-latest",
        temperature: 1.0,
        max_tokens: 1500,
        top_p: 0.9,
        frequency_penalty: 0.8,
        presence_penalty: 0.7,
      };
    } else if (type === "Visa Interview Questions") {
      if (!additionalData) {
        setGenerateContentError(
          "Required visa application details are missing.",
        );
        setIsGeneratingContent(false);
        setShowGeneratedContentDialog(false);
        return;
      }
      fullPrompt = `Generate visa interview questions for student visa to ${additionalData.country}. University: ${additionalData.universityName}, Course: ${additionalData.courseName}. Use the applicant details: ${JSON.stringify(additionalData)}. Resume: ${JSON.stringify(resumeData)}. Include 10-12 practice questions covering purpose, finances, home ties and plans. Suggest answer structures grounded in supplied facts; do not invent financial or personal details.`;
    } else {
      // Create a concise but informative summary of resume data
      const resumeSummary = `
Name: ${resumeData.personalInfo?.fullName || "N/A"}
Contact: ${resumeData.personalInfo?.email || ""} ${resumeData.personalInfo?.phone || ""}
Professional Summary: ${resumeData.personalInfo?.summary || "N/A"}

Skills:
${resumeData.skills?.map((cat) => `- ${cat.name}: ${Array.isArray(cat.skills) ? cat.skills.join(", ") : cat.skills}`).join("\n") || "N/A"}

Experience:
${
  resumeData.experience?.length
    ? resumeData.experience
        .map(
          (exp) => `
Position: ${exp.position || exp.jobTitle || "N/A"}
Company: ${exp.company || "N/A"}
Duration: ${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}
Key Responsibilities:
${Array.isArray(exp.responsibilities) ? exp.responsibilities.map((r) => `- ${r}`).join("\n") : exp.responsibilities || exp.description || "N/A"}
`,
        )
        .join("\n")
    : "N/A"
}

Projects:
${
  resumeData.projects?.length
    ? resumeData.projects
        .map(
          (proj) => `
Title: ${proj.title || proj.name || "N/A"}
Description: ${proj.description || "N/A"}
Technologies: ${proj.technologies || "N/A"}
`,
        )
        .join("\n")
    : "N/A"
}

Education:
${resumeData.education?.length ? resumeData.education.map((edu) => `${edu.degree} from ${edu.institution} (${edu.year || ""})`).join("\n") : "N/A"}
`.trim();

      let basePrompt = `Based on the following resume information, please generate a ${type}. `;
      switch (type) {
        case "Interview Questions":
          basePrompt +=
            "Generate 8-10 job interview questions with answers. Focus on skills and experience. Format: 'Q: [question] A: [answer]'.";
          break;
        case "Cover Letter":
          basePrompt +=
            "Write a detailed, professional cover letter (minimum 350 words) that: 1) Opens with strong enthusiasm for the specific role and company (use 'Hiring Manager' and 'your company' if names are not specified, do NOT use bracketed placeholders like [Name]) 2) Dedicates a full paragraph to highlighting key achievements from the provided Experience section that match the role 3) Dedicates another full paragraph to explaining specific interest in the company's mission/industry 4) Closes with a confident call to action. Use a professional, persuasive tone. Do not be concise. Expand on the resume details to tell a compelling story.";
          break;
        default:
          basePrompt += "";
      }
      fullPrompt = `${basePrompt}\n\nResume Information:\n${resumeSummary}\n\n${type}:`;
    }

    try {
      // Use secure Firebase Function instead of direct API call
      const messages = [
        {
          role: "system",
          content:
            type === "Statement of Purpose"
              ? "Write in a professional, personal voice using only facts supplied by the applicant."
              : "You are a helpful assistant.",
        },
        {
          role: "user",
          content: fullPrompt,
        },
      ];

      const model = apiPayload.model || "gemini-1.5-flash-latest";
      const temperature = apiPayload.temperature || 0.7;
      const maxTokens = apiPayload.max_tokens || 1500;

      const message = await callOpenAI(messages, {
        model,
        temperature,
        maxTokens,
      });

      if (message) {
        let processedMessage = message;

        setGeneratedContent(processedMessage.trim());
      } else {
        setGenerateContentError(`No ${type} generated. Please try again.`);
      }
    } catch (err) {
      console.error(`Error generating ${type}:`, err);
      setGenerateContentError(err.message);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleGenerateInterviewQuestions = () =>
    generateContent("Interview Questions");
  const handleGenerateCoverLetter = () => generateContent("Cover Letter");

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "transparent",
          }}
        >
          <Paper
            elevation={3}
            sx={{ p: 4, borderRadius: 4, textAlign: "center", maxWidth: 300 }}
          >
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Loading...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preparing your resume editor.
            </Typography>
            <LinearProgress
              sx={{
                width: "80%",
                height: 4,
                borderRadius: 2,
                mt: 3,
                mx: "auto",
              }}
            />
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "background.default",
            p: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              textAlign: "center",
              maxWidth: 450,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.error.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <ErrorIcon color="error" sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600 }}>
              Error Loading Resume
            </Typography>
            <Alert
              severity="error"
              variant="outlined"
              sx={{ mb: 3, textAlign: "left", borderRadius: 2 }}
            >
              {error}
            </Alert>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<DashboardIcon />}
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  const renderForm = () => {
    const currentSection = sections.find((sec) => sec.id === currentStep);
    if (!currentSection)
      return <Alert severity="warning">Invalid step selected.</Alert>;

    const FormComponent = currentSection.form;
    const sectionKey = currentSection.key;

    return (
      <Box key={currentSection.id}>
        <Grow in={true} timeout={350}>
          <div>
            <FormComponent
              data={resumeData[sectionKey]}
              updateData={(data) => updateResumeData(sectionKey, data)}
              isComplete={completedSections[sectionKey]}
              nextStep={nextStep}
              externalErrors={
                sectionKey === "personalInfo" ? personalInfoErrors : undefined
              }
            />
          </div>
        </Grow>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            pt: 3,
            borderTop: `1px solid #9D88D9`,
          }}
        >
          <Button
            variant="outlined"
            onClick={prevStep}
            disabled={currentStep === 1}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: "#9D88D9",
              color: "#9D88D9",
              "&:hover": {
                borderColor: "#8c74cc",
                backgroundColor: "rgba(157, 136, 217, 0.08)",
              },
            }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={nextStep}
            endIcon={
              currentStep !== totalSteps ? (
                <ArrowForwardIcon />
              ) : (
                <VisibilityIcon />
              )
            }
            sx={{
              backgroundColor: "#9D88D9",
              "&:hover": {
                backgroundColor: "#8c74cc",
              },
            }}
          >
            {currentStep === totalSteps ? "Preview" : "Next Section"}
          </Button>
        </Box>
      </Box>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "transparent",
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 2.5,
          bgcolor: "primary.main",
          backgroundImage: lavenderPalette.gradient,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
          Resume Editor
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Click to rename" placement="bottom-start">
            <Typography
              variant="body2"
              noWrap
              onClick={handleOpenTitleDialog}
              sx={{
                color: alpha("#ffffff", 0.9),
                flexGrow: 1,
                mr: 1,
                cursor: "pointer",
                "&:hover": { color: "#ffffff" },
              }}
            >
              {resumeMetadata.title}
            </Typography>
          </Tooltip>
          <IconButton
            size="small"
            sx={{
              color: alpha("#ffffff", 0.7),
              "&:hover": { color: "#ffffff", bgcolor: alpha("#ffffff", 0.1) },
            }}
            onClick={handleOpenTitleDialog}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      <List
        sx={{
          pt: 1,
          pb: 0,
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "transparent",
        }}
      >
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigateWithConfirmation("/dashboard")}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {" "}
              <DashboardIcon />{" "}
            </ListItemIcon>
            <ListItemText
              primary="My Dashboard"
              primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setShowResumeTips(true)}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LightbulbIcon />
            </ListItemIcon>
            <ListItemText
              primary="Resume Tips"
              primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ mx: 2, my: 1 }} />

        <Typography
          variant="overline"
          sx={{ px: 2.5, mb: 0.5, display: "block", color: "text.disabled" }}
        >
          Sections
        </Typography>

        {sections.map((section) => (
          <ListItem key={section.id} disablePadding>
            <ListItemButton
              selected={!isPreviewMode && currentStep === section.id}
              onClick={() => handleNavItemClick(section.id)}
              sx={{
                "&.Mui-selected": {
                  color: "#9D88D9",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#f3f0fa",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {completedSections[section.key] ? (
                  <StyledBadge
                    overlap="circular"
                    variant="dot"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    sx={{
                      "& .MuiBadge-dot": {
                        backgroundColor: "#9D88D9",
                      },
                    }}
                  >
                    {React.cloneElement(section.icon, {
                      sx: {
                        color:
                          !isPreviewMode && currentStep === section.id
                            ? "#9D88D9"
                            : "rgba(0, 0, 0, 0.6)",
                      },
                    })}
                  </StyledBadge>
                ) : (
                  React.cloneElement(section.icon, {
                    sx: {
                      color:
                        !isPreviewMode && currentStep === section.id
                          ? "#9D88D9"
                          : "rgba(0, 0, 0, 0.6)",
                    },
                  })
                )}
              </ListItemIcon>
              <ListItemText
                primary={section.label}
                primaryTypographyProps={{
                  fontWeight:
                    !isPreviewMode && currentStep === section.id ? 600 : 500,
                  variant: "body2",
                }}
              />
              {completedSections[section.key] && (
                <CheckCircleIcon
                  sx={{
                    fontSize: 18,
                    opacity: 0.8,
                    ml: 1,
                    color: "#9D88D9",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ mx: 2, my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton
            selected={isPreviewMode}
            onClick={() => handleNavItemClick(previewStepId)}
            sx={{
              "&.Mui-selected": {
                color: "#9D88D9",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#f3f0fa",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <VisibilityIcon
                sx={{
                  color: isPreviewMode ? "#9D88D9" : "rgba(0, 0, 0, 0.6)",
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Preview"
              primaryTypographyProps={{
                fontWeight: isPreviewMode ? 600 : 500,
                variant: "body2",
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => setAiToolsMenuAnchor(e.currentTarget)}
            sx={{ "&:hover": { backgroundColor: "#f3f0fa" } }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AutoFixHighIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
            </ListItemIcon>
            <ListItemText
              primary="AI Tools"
              primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
            />
          </ListItemButton>
        </ListItem>
        <Menu
          anchorEl={aiToolsMenuAnchor}
          open={Boolean(aiToolsMenuAnchor)}
          onClose={() => setAiToolsMenuAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setAiToolsMenuAnchor(null);
              setShowEnhanceDialog(true);
            }}
          >
            <ListItemIcon>
              <AutoFixHighIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Enhance Resume</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAiToolsMenuAnchor(null);
              handleGenerateInterviewQuestions();
            }}
            disabled={isGeneratingContent}
          >
            <ListItemIcon>
              <QuestionAnswerIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Interview Questions</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAiToolsMenuAnchor(null);
              handleGenerateCoverLetter();
            }}
            disabled={isGeneratingContent}
          >
            <ListItemIcon>
              <ArticleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cover Letter</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAiToolsMenuAnchor(null);
              setShowSOPFormDialog(true);
            }}
            disabled={isGeneratingContent}
          >
            <ListItemIcon>
              <ArticleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Statement of Purpose</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAiToolsMenuAnchor(null);
              setShowVisaFormDialog(true);
            }}
            disabled={isGeneratingContent}
          >
            <ListItemIcon>
              <GavelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Visa Interview Questions</ListItemText>
          </MenuItem>
        </Menu>
      </List>

      <Box
        sx={{
          p: 2,
          mt: "auto",
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.action.hover, 0.02),
        }}
      >
        <Button
          fullWidth
          variant={unsavedChanges ? "contained" : "outlined"}
          onClick={handleManualSave}
          disabled={isSaving}
          startIcon={
            isSaving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          sx={{ mb: 1, color: "#9D88D9", borderColor: "#9D88D9" }}
        >
          {isSaving
            ? "Saving..."
            : unsavedChanges
              ? "Save Changes"
              : "Save All"}
        </Button>
        {saveError && (
          <Typography
            variant="caption"
            color="error"
            display="block"
            textAlign="center"
          >
            {saveError}
          </Typography>
        )}
        {!saveError && resumeMetadata.lastModified && (
          <Typography
            variant="caption"
            display="block"
            sx={{ textAlign: "center", color: "text.secondary" }}
          >
            Last saved:{" "}
            {new Date(resumeMetadata.lastModified).toLocaleTimeString()}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
          }}
        >
          <Box
            component="nav"
            sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}
          >
            <SwipeableDrawer
              variant="temporary"
              open={mobileOpen}
              onOpen={() => setMobileOpen(true)}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: 280,
                  borderRight: "none",
                },
              }}
            >
              {drawerContent}
            </SwipeableDrawer>

            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", md: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: 280,
                  bgcolor: "background.paper",
                  borderRight: `1px solid ${theme.palette.divider}`,
                },
              }}
              open
            >
              {drawerContent}
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "transparent",
            }}
          >
            <span
              id="back-to-top-anchor"
              style={{ position: "absolute", top: "-100px" }}
            ></span>

            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <Navbar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                unsavedChanges={unsavedChanges}
                isSaving={isSaving}
                completionProgress={completionProgress}
                isPreviewMode={isPreviewMode}
                currentStep={currentStep}
                handleManualSave={handleManualSave}
                handleNavItemClick={handleNavItemClick}
                previewStepId={previewStepId}
                handleDrawerToggle={handleDrawerToggle}
                onOpenResumeTips={() => setShowResumeTips(true)}
              />
            </Box>

            <Container
              // maxWidth="lg"
              sx={{
                flexGrow: 1,
                py: { xs: 2, sm: 3 },
                px: "0px !important",
                mb: { xs: 8, md: 3 },
              }}
            >
              <ResumeWorkspaceTools
                resumeData={resumeData}
                metadata={resumeMetadata}
                presentation={presentation}
                onImport={replaceResume}
                onUpdate={updateResumeData}
                onSection={(key) =>
                  handleNavItemClick(
                    sections.find((section) => section.key === key)?.id || 1,
                  )
                }
                canUndo={canUndo}
                canRedo={canRedo}
                undo={undo}
                redo={redo}
                isOnline={isOnline}
                isSaving={isSaving}
                unsavedChanges={unsavedChanges}
                saveError={saveError}
              />
              {!isPreviewMode && !isMobile && (
                <Button
                  size="small"
                  sx={{ mb: 1 }}
                  onClick={() => setShowLivePreview((value) => !value)}
                >
                  {showLivePreview ? "Hide live preview" : "Show live preview"}
                </Button>
              )}

              {/* Only shown in the sm-md gap: below this, BottomNavigation covers section
                  switching; at md+, the permanent sidebar drawer already shows the same
                  section list, so rendering the Stepper too would just duplicate it. */}
              {!isPreviewMode && isMobile && !isSmall && (
                <Paper
                  elevation={0}
                  sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: "transparent",
                    border: `1px solid ${lavenderPalette.primary}`,
                    borderRadius: 2,
                  }}
                >
                  <Stepper
                    activeStep={currentStep - 1}
                    alternativeLabel
                    sx={{
                      "& .MuiStepIcon-root": {
                        color: lavenderPalette.soft,
                        "&.Mui-active": {
                          color: lavenderPalette.primary,
                          transform: "scale(1.1)",
                          boxShadow: `0 0 12px ${lavenderPalette.medium}`,
                          borderRadius: "50%",
                        },
                        "&.Mui-completed": {
                          color: lavenderPalette.deep,
                        },
                      },

                      "& .MuiStepLabel-label": {
                        color: lavenderPalette.text,
                        "&.Mui-active": {
                          fontWeight: "bold",
                          color: lavenderPalette.darkText,
                        },
                        "&.Mui-completed": {
                          color: lavenderPalette.text,
                        },
                      },

                      "& .MuiStepConnector-line": {
                        borderColor: lavenderPalette.soft,
                        borderTopWidth: "2px",
                      },

                      "& .Mui-active > .MuiStepConnector-line, & .Mui-completed > .MuiStepConnector-line":
                        {
                          borderColor: lavenderPalette.primary,
                        },
                    }}
                  >
                    {sections.map((section) => (
                      <Step
                        key={section.id}
                        completed={completedSections[section.key]}
                      >
                        <StepLabel
                          onClick={() => handleNavItemClick(section.id)}
                          sx={{
                            cursor: "pointer",
                            "&:hover .MuiStepLabel-label": {
                              color: lavenderPalette.deep,
                            },
                          }}
                        >
                          {section.label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Paper>
              )}

              {!isPreviewMode ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      !isMobile && showLivePreview
                        ? "minmax(0, 1fr) minmax(280px, 0.75fr)"
                        : "minmax(0, 1fr)",
                    gap: 2,
                  }}
                >
                  <AnimatedCard elevation={1} sx={{ minWidth: 0 }}>
                    {renderForm()}
                  </AnimatedCard>
                  {!isMobile && showLivePreview && (
                    <LiveResumePreview
                      resumeData={resumeData}
                      presentation={presentation}
                    />
                  )}
                </Box>
              ) : (
                <Box sx={{ mt: { xs: 0, sm: -2 } }}>
                  {" "}
                  <ResumePreview
                    resumeData={resumeData}
                    onBack={prevStep}
                    sectionOrder={sectionOrder}
                    presentation={presentation}
                    onPresentationChange={updatePresentation}
                    onBeforePublish={() => saveResumeData(false)}
                    onUpdateResumeData={updateResumeData}
                    onEnhanceResume={() => setShowEnhanceDialog(true)}
                    metadata={resumeMetadata}
                  />
                </Box>
              )}
            </Container>
          </Box>{" "}
          {isMobile && (
            <Paper
              elevation={3}
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: (theme) => theme.zIndex.appBar,
                display: { md: "none" },
                borderTop: `1px solid ${lavenderPalette.primary}`,
              }}
            >
              <BottomNavigation
                sx={{
                  overflowX: "auto",
                  justifyContent: "flex-start",
                  "& .MuiBottomNavigationAction-root": {
                    flexShrink: 0,
                    minWidth: 62,
                  },
                }}
                value={isPreviewMode ? previewStepId : currentStep}
                onChange={handleBottomNavChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Dashboard"
                  icon={<ArrowBackIcon />}
                  onClick={() => navigateWithConfirmation("/dashboard")}
                  sx={{ minWidth: "auto", px: 1 }}
                />

                {sections.map((section) => (
                  <BottomNavigationAction
                    key={section.id}
                    label={
                      isSmall ? section.label.substring(0, 4) : section.label
                    }
                    value={section.id}
                    icon={
                      completedSections[section.key] ? (
                        <StyledBadge
                          overlap="circular"
                          variant="dot"
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          {section.icon}
                        </StyledBadge>
                      ) : (
                        section.icon
                      )
                    }
                    sx={{ minWidth: "auto", px: 1 }}
                  />
                ))}
                <BottomNavigationAction
                  label={isSmall ? "View" : "Preview"}
                  value={previewStepId}
                  icon={<VisibilityIcon />}
                  sx={{ minWidth: "auto", px: 1 }}
                />
              </BottomNavigation>
            </Paper>
          )}
          <ResumeNavigationGuard
            shouldBlock={shouldBlockNavigation}
            onSave={() => saveResumeData(true)}
            onDiscard={discardDraft}
          />
          <UpdateResumeName
            open={showTitleDialog}
            onClose={handleCloseTitleDialog}
            currentTitle={currentTitle}
            setCurrentTitle={setCurrentTitle}
            resumeTitle={resumeMetadata.title}
            setResumeMetadata={setResumeMetadata}
            setUnsavedChanges={setUnsavedChanges}
            setNotification={setNotification}
            notification={notification}
            handleCloseNotification={handleCloseNotification}
            isMobile={isMobile}
            showLeaveConfirmation={showLeaveConfirmation}
            setShowLeaveConfirmation={setShowLeaveConfirmation}
            handleConfirmedNavigation={handleConfirmedNavigation}
          />
          <SOPFormDialog
            open={showSOPFormDialog}
            onClose={() => setShowSOPFormDialog(false)}
            onGenerate={(sopData) => {
              generateContent("Statement of Purpose", sopData);
            }}
          />
          <GeneratedContentDialog
            open={showGeneratedContentDialog}
            onClose={() => setShowGeneratedContentDialog(false)}
            title={generatedContentTitle}
            content={generatedContent}
            loading={isGeneratingContent}
            error={generateContentError}
          />
          <VisaInterviewFormDialog
            open={showVisaFormDialog}
            onClose={() => setShowVisaFormDialog(false)}
            onGenerate={(visaData) => {
              generateContent("Visa Interview Questions", visaData);
            }}
          />
          <ResumeTipsDialog
            open={showResumeTips}
            onClose={() => setShowResumeTips(false)}
          />
          <EnhanceResumeDialog
            open={showEnhanceDialog}
            onClose={() => setShowEnhanceDialog(false)}
            resumeData={resumeData}
          />
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification.severity}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default ResumeBuilderPage;
