import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";
import { ref, onValue, off, serverTimestamp, update } from "firebase/database";
import { ThemeProvider } from "@mui/material/styles";
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
  styled,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  SaveOutlined as SaveIcon,
  EditOutlined as EditIcon,
  ErrorOutline as ErrorIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  DescriptionOutlined as DescriptionIcon,
  SchoolOutlined as SchoolIcon,
  WorkOutlineOutlined as WorkIcon,
  PsychologyOutlined as PsychologyIcon,
  BuildOutlined as ConstructionIcon,
  VisibilityOutlined as VisibilityIcon,
  CheckCircleOutline as CheckCircleIcon,
  DashboardOutlined as DashboardIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

import PersonalInfoForm from "../components/ResumeBuilderPage/PersonalInfoForm";
import EducationForm from "../components/ResumeBuilderPage/EducationForm";
import ExperienceForm from "../components/ResumeBuilderPage/ExperienceForm";
import SkillsForm from "../components/ResumeBuilderPage/SkillsForm";
import ProjectsForm from "../components/ResumeBuilderPage/ProjectsForm";
import ResumePreview from "../components/ResumeBuilderPage/ResumePreview";
import UpdateResumeName from "../components/ResumeBuilderPage/UpdateResumeName";
import Navbar from "../components/ResumeBuilderPage/Navbar";
import { getCustomTheme } from "../theme/customTheme";

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
  padding: theme.spacing(3, 3, 4, 3),
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: "all 0.3s ease-in-out",
  position: "relative",
}));

const initialResumeState = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
};

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
        data.length > 0 && data.every((item) => item.institution && item.degree)
      );
    case "experience":
      return (
        data.length > 0 && data.every((item) => item.company && item.position)
      );
    case "skills":
      return data.length > 0;
    case "projects":
      return data.length > 0 && data.every((item) => item.title);
    default:
      return false;
  }
};

function ResumeBuilderPage() {
  const { resumeId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const systemPrefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(systemPrefersDarkMode);
  const theme = useMemo(() => getCustomTheme(darkMode), [darkMode]);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setDarkMode(systemPrefersDarkMode);
  }, [systemPrefersDarkMode]);

  useEffect(() => {
    if (location?.state?.preview === true) {
      setIsPreviewMode(true);
    }
  }, [location?.state?.preview]);

  const [currentStep, setCurrentStep] = useState(sections[0].id);
  const [resumeData, setResumeData] = useState(initialResumeState);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [resumeMetadata, setResumeMetadata] = useState({
    title: "Untitled Resume",
    lastModified: null,
    createdAt: null,
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [showTitleDialog, setShowTitleDialog] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const completedSections = useMemo(() => {
    const completed = {};
    sections.forEach((sec) => {
      completed[sec.key] = isSectionComplete(sec.key, resumeData[sec.key]);
    });
    return completed;
  }, [resumeData]);

  const completionProgress = useMemo(() => {
    return (
      (Object.values(completedSections).filter(Boolean).length / totalSteps) *
      100
    );
  }, [completedSections]);

  useEffect(() => {
    if (!currentUser || !resumeId) {
      navigate("/dashboard");
      return;
    }
    setIsLoading(true);
    setError("");
    const resumeRef = ref(
      database,
      `users/${currentUser.uid}/resumes/${resumeId}`
    );

    const listener = onValue(
      resumeRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedData = {
            personalInfo: {
              ...initialResumeState.personalInfo,
              ...(data.resumeData?.personalInfo || {}),
            },
            education: data.resumeData?.education || [],
            experience: data.resumeData?.experience || [],
            skills: data.resumeData?.skills || [],
            projects: data.resumeData?.projects || [],
          };
          setResumeData(loadedData);
          setResumeMetadata(
            data.metadata || {
              title: "Untitled Resume",
              lastModified: null,
              createdAt: serverTimestamp(),
            }
          );
          setCurrentTitle(data.metadata?.title || "Untitled Resume");
          setUnsavedChanges(false);
        } else {
          setError(`Resume with ID ${resumeId} not found.`);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching resume:", err);
        setError(
          "Could not load resume data. Check connection or permissions."
        );
        setIsLoading(false);
      }
    );

    return () => off(resumeRef, "value", listener);
  }, [currentUser, resumeId, navigate]);

  const saveResumeData = useCallback(
    async (showSuccessNotification = true) => {
      if (!currentUser || !resumeId || isSaving) return false;

      setIsSaving(true);
      setSaveError("");

      const resumeRef = ref(
        database,
        `users/${currentUser.uid}/resumes/${resumeId}`
      );
      const updates = {
        resumeData: resumeData,
        "metadata/lastModified": serverTimestamp(),
        "metadata/title": resumeMetadata.title,
        ...(resumeMetadata.createdAt === null && {
          "metadata/createdAt": serverTimestamp(),
        }),
      };

      try {
        await update(resumeRef, updates);
        console.log("Resume saved successfully:", resumeId);
        setUnsavedChanges(false);
        if (showSuccessNotification) {
          setNotification({
            open: true,
            message: "Resume saved successfully!",
            severity: "success",
          });
        }

        return true;
      } catch (err) {
        console.error("Firebase save error:", err);
        setSaveError("Failed to save. Please check connection and try again.");
        setNotification({
          open: true,
          message: "Failed to save changes",
          severity: "error",
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [
      currentUser,
      resumeId,
      isSaving,
      resumeData,
      resumeMetadata.title,
      resumeMetadata.createdAt,
    ]
  );

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  // new
  useEffect(() => {
    if (unsavedChanges) {
      const debounce = setTimeout(() => {
        saveResumeData(false);
      }, 5000);

      return () => clearTimeout(debounce);
    }
  }, [resumeData, saveResumeData, unsavedChanges]);

  useEffect(() => {
    return () => {
      if (unsavedChanges) {
        console.log(
          "Attempting auto-save on unmount due to unsaved changes..."
        );
        saveResumeData(false);
      }
    };
  }, [unsavedChanges, saveResumeData]);

  const updateResumeData = useCallback((sectionKey, data) => {
    setResumeData((prevData) => ({
      ...prevData,
      [sectionKey]: data,
    }));
    setUnsavedChanges(true);
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavItemClick = (stepId) => {
    if (stepId === previewStepId) {
      setIsPreviewMode(true);
      setCurrentStep(previewStepId);
    } else if (stepId > 0 && stepId <= totalSteps) {
      setIsPreviewMode(false);
      setCurrentStep(stepId);
    }
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

  const navigateWithConfirmation = (destination) => {
    if (unsavedChanges) {
      setPendingNavigation(destination);
      setShowLeaveConfirmation(true);
    } else {
      navigate(destination);
    }
  };

  const handleConfirmedNavigation = async (saveBeforeLeaving) => {
    setShowLeaveConfirmation(false);
    let canNavigate = true;

    if (saveBeforeLeaving && unsavedChanges) {
      canNavigate = await saveResumeData(true);
    }

    if (canNavigate && pendingNavigation) {
      navigate(pendingNavigation);
    }
    setPendingNavigation(null);
  };

  const nextStep = () => {
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

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        {" "}
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "background.default",
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
            {" "}
            <FormComponent
              data={resumeData[sectionKey]}
              updateData={(data) => updateResumeData(sectionKey, data)}
              isComplete={completedSections[sectionKey]}
            />
          </div>
        </Grow>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            variant="outlined"
            onClick={prevStep}
            disabled={currentStep === 1}
            startIcon={<ArrowBackIcon />}
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
          >
            {currentStep === totalSteps ? "Preview Resume" : "Next Section"}
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
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 2.5,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
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

      <List sx={{ pt: 1, pb: 0, flexGrow: 1, overflowY: "auto" }}>
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
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {completedSections[section.key] ? (
                  <StyledBadge
                    overlap="circular"
                    variant="dot"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  >
                    {React.cloneElement(section.icon, {
                      color:
                        !isPreviewMode && currentStep === section.id
                          ? "primary"
                          : "inherit",
                    })}
                  </StyledBadge>
                ) : (
                  React.cloneElement(section.icon, {
                    color:
                      !isPreviewMode && currentStep === section.id
                        ? "primary"
                        : "inherit",
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
                  color="success"
                  sx={{ fontSize: 18, opacity: 0.8, ml: 1 }}
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
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {" "}
              <VisibilityIcon />{" "}
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
          color={unsavedChanges ? "warning" : "primary"}
          onClick={handleManualSave}
          disabled={isSaving}
          startIcon={
            isSaving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          sx={{ mb: 1 }}
        >
          {isSaving
            ? "Saving..."
            : unsavedChanges
            ? "Save Changes"
            : "All Saved"}
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Box component="nav" sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}>
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
            width: { md: "calc(100% - 280px)" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span
            id="back-to-top-anchor"
            style={{ position: "absolute", top: "-100px" }}
          ></span>

          <Navbar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            unsavedChanges={unsavedChanges}
            isSaving={isSaving}
            completionProgress={completionProgress}
            isPreviewMode={isPreviewMode}
            handleManualSave={handleManualSave}
            handleNavItemClick={handleNavItemClick}
            previewStepId={previewStepId}
            handleDrawerToggle={handleDrawerToggle}
          />

          <Container
            maxWidth="lg"
            sx={{ flexGrow: 1, py: { xs: 2, sm: 3 }, mb: { xs: 8, md: 3 } }}
          >
            <Collapse in={unsavedChanges && !isSaving}>
              <Alert
                severity="info"
                variant="standard"
                sx={{ mb: 2, display: { xs: "none", sm: "flex" } }}
                icon={<SaveIcon fontSize="inherit" />}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleManualSave}
                    disabled={isSaving}
                  >
                    Save Now
                  </Button>
                }
              >
                {" "}
                You have unsaved changes.{" "}
              </Alert>
            </Collapse>

            {!isPreviewMode && !isSmall && (
              <Paper elevation={0} sx={{ mb: 3, p: 1, bgcolor: "transparent" }}>
                <Stepper activeStep={currentStep - 1} alternativeLabel>
                  {sections.map((section) => (
                    <Step
                      key={section.id}
                      completed={completedSections[section.key]}
                    >
                      <StepLabel
                        onClick={() => handleNavItemClick(section.id)}
                        sx={{ cursor: "pointer" }}
                      >
                        {section.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            )}

            {!isPreviewMode ? (
              <AnimatedCard elevation={1}>{renderForm()}</AnimatedCard>
            ) : (
              <Box sx={{ mt: { xs: 0, sm: -2 } }}>
                {" "}
                <ResumePreview resumeData={resumeData} onBack={prevStep} />
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
            }}
          >
            <BottomNavigation
              value={isPreviewMode ? previewStepId : currentStep}
              onChange={handleBottomNavChange}
              showLabels
            >
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
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1300,
            boxShadow: 3,
            minWidth: 160,
          }}
        ></Box>
      </Box>{" "}
    </ThemeProvider>
  );
}

export default ResumeBuilderPage;
