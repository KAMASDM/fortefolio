import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";
import { ref, onValue, off, serverTimestamp, update } from "firebase/database";
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
  Fab,
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
} from "@mui/icons-material";

import PersonalInfoForm from "../components/ResumeBuilderPage/Forms/PersonalInfoForm";
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
import { callOpenAI } from "../utils/openai";

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
  references: [],
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
  {
    id: 6,
    key: "references",
    label: "References",
    icon: <PersonOutlineIcon />,
    form: ReferenceForm,
  },
];

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
            category.skills.some((s) => s.trim() !== "")
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

const getRandomSystemMessage = () => {
  const systemMessages = [
    "You are a real person writing about your own experiences. Write naturally, like you're talking to someone you trust.",
    "Write as yourself - include your natural way of thinking, speaking, and explaining things. Don't try to sound perfect.",
    "You're sharing your personal story. Use your own voice, with all its quirks and natural speech patterns.",
    "Write like you normally do - with natural hesitations, corrections, and your genuine personality coming through.",
    "Tell your story the way you'd explain it to a friend over coffee. Be genuine, natural, and authentically yourself.",
  ];

  return systemMessages[Math.floor(Math.random() * systemMessages.length)];
};

const generateHumanizedSOPPrompt = (resumeData, additionalData) => {
  return `Write a personal Statement of Purpose for ${additionalData.universityName}, ${additionalData.courseName} program in ${additionalData.targetCountry}. Write naturally and authentically. Include: academic background, career goals, why this program, future plans. Target 800-900 words in 3-4 paragraphs.`;
};

const postProcessSOP = (sopContent) => {
  let processedContent = sopContent;

  const formalToNatural = {
    "endeavor to": "plan to",
    "in order to": "to",
    "for the purpose of": "to",
    facilitate: "help",
    utilize: "use",
    commence: "begin",
    regarding: "about",
    "in terms of": "for",
    "with respect to": "about",
    "prior to": "before",
    subsequently: "then",
    therefore: "so",
    furthermore: "also",
    moreover: "what's more",
    nonetheless: "still",
    consequently: "as a result",
    however: "but",
    nevertheless: "even so",
    thus: "so",
    hence: "that's why",
    wherein: "where",
    whereby: "how",
    whilst: "while",
    amongst: "among",
    upon: "on",
    shall: "will",
    "ought to": "should",
    "in addition": "also",
    "in conclusion": "so",
    "to summarize": "in short",
    "it is evident that": "clearly",
    "it can be seen that": "you can see",
    "it should be noted": "worth noting",
    "it is important to": "I need to",
    "one can observe": "you can see",
    "it becomes apparent": "it's clear",
    "it is crucial": "it's really important",
    significant: "big",
    substantial: "major",
    demonstrate: "show",
    illustrate: "show",
    exemplify: "show",
    indicate: "show",
    establish: "set up",
    implement: "do",
    execute: "carry out",
    accomplish: "get done",
    acquire: "get",
    obtain: "get",
    purchase: "buy",
    receive: "get",
    possess: "have",
  };

  Object.entries(formalToNatural).forEach(([formal, casual]) => {
    const regex = new RegExp(`\\b${formal}\\b`, "gi");
    processedContent = processedContent.replace(regex, casual);
  });

  processedContent = addHumanImperfections(processedContent);
  processedContent = addNaturalVariations(processedContent);
  processedContent = addConversationalElements(processedContent);

  return processedContent;
};

const addHumanImperfections = (text) => {
  let sentences = text.match(/[^\.!?]+[\.!?]+/g) || [];

  sentences = sentences.map((sentence, index) => {
    const random = Math.random();

    if (random < 0.2 && index > 0) {
      const starters = [
        "Actually, ",
        "So, ",
        "Well, ",
        "I mean, ",
        "You know, ",
        "Honestly, ",
        "To be fair, ",
        "Looking back, ",
      ];
      const starter = starters[Math.floor(Math.random() * starters.length)];
      sentence = starter + sentence.trim().toLowerCase();
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }

    if (random < 0.15) {
      const qualifiers = [
        " I think",
        " I believe",
        " I guess",
        " I suppose",
        " probably",
        " maybe",
        " sort of",
        " kind of",
      ];
      const qualifier =
        qualifiers[Math.floor(Math.random() * qualifiers.length)];
      const words = sentence.split(" ");
      if (words.length > 3) {
        words.splice(2, 0, qualifier + ",");
        sentence = words.join(" ");
      }
    }

    sentence = sentence.replace(/\bI am\b/g, "I'm");
    sentence = sentence.replace(/\bI have\b/g, "I've");
    sentence = sentence.replace(/\bI will\b/g, "I'll");
    sentence = sentence.replace(/\bI would\b/g, "I'd");
    sentence = sentence.replace(/\bdo not\b/g, "don't");
    sentence = sentence.replace(/\bcannot\b/g, "can't");
    sentence = sentence.replace(/\bwill not\b/g, "won't");
    sentence = sentence.replace(/\bthat is\b/g, "that's");
    sentence = sentence.replace(/\bit is\b/g, "it's");
    sentence = sentence.replace(/\bwe are\b/g, "we're");
    sentence = sentence.replace(/\bthey are\b/g, "they're");

    return sentence;
  });

  return sentences.join(" ");
};

const addFinalHumanTouches = (text) => {
  let finalText = text;

  finalText = finalText.replace(/^([A-Z])/gm, (match, firstChar, offset) => {
    if (offset === 0) return match;

    const naturalStarters = [
      "So, " + firstChar.toLowerCase(),
      "Well, " + firstChar.toLowerCase(),
      "And " + firstChar.toLowerCase(),
      "But " + firstChar.toLowerCase(),
      "Actually, " + firstChar.toLowerCase(),
      firstChar, // Keep original sometimes
    ];

    if (Math.random() < 0.3) {
      return naturalStarters[
        Math.floor(Math.random() * naturalStarters.length)
      ];
    }
    return match;
  });

  const casualReplacements = {
    " a lot of ": " lots of ",
    " many ": " tons of ",
    " very ": " really ",
    " extremely ": " super ",
    " particularly ": " especially ",
    " specifically ": " especially ",
    " approximately ": " around ",
    " currently ": " right now ",
    " recently ": " lately ",
    " frequently ": " often ",
    " occasionally ": " sometimes ",
    " immediately ": " right away ",
    " definitely ": " for sure ",
    " certainly ": " definitely ",
    " obviously ": " clearly ",
    " undoubtedly ": " no doubt ",
    " nevertheless ": " even so ",
    " furthermore ": " plus ",
    " additionally ": " also ",
    " subsequently ": " after that ",
    " consequently ": " so ",
    " therefore ": " thats why ",
    " however ": " but ",
    " although ": " even though ",
    " because ": " since ",
    " in order to ": " to ",
    " due to ": " because of ",
    " as a result of ": " because of ",
    " for the reason that ": " because ",
    " in spite of ": " despite ",
    " with regard to ": " about ",
    " in relation to ": " about ",
    " concerning ": " about ",
    " regarding ": " about ",
  };

  Object.entries(casualReplacements).forEach(([formal, casual]) => {
    const regex = new RegExp(formal, "gi");
    if (Math.random() < 0.7) {
      finalText = finalText.replace(regex, casual);
    }
  });
  finalText = finalText.replace(
    /\. (Which|That|Something that|This|It)/g,
    (match, word) => {
      if (Math.random() < 0.4) {
        return `. ${word}`;
      }
      return match;
    }
  );

  finalText = finalText.replace(
    /\. (I think|I believe|I feel|I know)/g,
    ". I mean, $1"
  );

  finalText = finalText.replace(
    /(\w+) was (very|really|extremely) (\w+)/g,
    (match, subject, intensity, adjective) => {
      if (Math.random() < 0.3) {
        return `${subject} was ${adjective}—${intensity} ${adjective}`;
      }
      return match;
    }
  );

  return finalText;
};

const addConversationalElements = (text) => {
  let processedText = text;

  const asidesPattern = /\b(which was|this was|it was)\s+([^.!?]+)/g;
  processedText = processedText.replace(
    asidesPattern,
    (match, start, content) => {
      if (Math.random() < 0.3) {
        return `(${content.trim()})`;
      }
      return match;
    }
  );

  const corrections = [
    {
      find: /\bvery important\b/g,
      replace: "really important—well, crucial actually",
    },
    { find: /\bI learned\b/g, replace: "I picked up" },
    { find: /\bI discovered\b/g, replace: "I found out" },
    { find: /\bI realized\b/g, replace: "it dawned on me" },
  ];

  corrections.forEach((correction) => {
    if (Math.random() < 0.3) {
      processedText = processedText.replace(
        correction.find,
        correction.replace
      );
    }
  });

  return processedText;
};

const addNaturalVariations = (text) => {
  let sentences = text.match(/[^\.!?]+[\.!?]+/g) || [];

  sentences = sentences.map((sentence, index) => {
    if (index > 0 && Math.random() < 0.25) {
      const naturalConnectors = [
        "Anyway, ",
        "So yeah, ",
        "Plus, ",
        "And honestly, ",
        "What's more, ",
        "Also, ",
        "Oh, and ",
      ];
      const connector =
        naturalConnectors[Math.floor(Math.random() * naturalConnectors.length)];

      if (
        !sentence
          .trim()
          .match(
            /^(Actually|So|Well|I mean|You know|Honestly|To be fair|Looking back|Anyway|Plus|Also)/
          )
      ) {
        sentence = connector + sentence.trim().toLowerCase();
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      }
    }

    if (index > 0 && Math.random() < 0.15) {
      if (!sentence.trim().match(/^(And|But|So|Well)/)) {
        const starters = ["And ", "But "];
        const starter = starters[Math.floor(Math.random() * starters.length)];
        sentence = starter + sentence.trim().toLowerCase();
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      }
    }

    return sentence;
  });

  return sentences.join(" ");
};

function ResumeBuilderPage() {
  const { resumeId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // const systemPrefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  // const [darkMode, setDarkMode] = useState(systemPrefersDarkMode);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => getCustomTheme(darkMode), [darkMode]);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // useEffect(() => {
  //   setDarkMode(systemPrefersDarkMode);
  // }, [systemPrefersDarkMode]);

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

  const [generatedContentTitle, setGeneratedContentTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [showGeneratedContentDialog, setShowGeneratedContentDialog] =
    useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generateContentError, setGenerateContentError] = useState("");
  const [showVisaFormDialog, setShowVisaFormDialog] = useState(false);
  const [showResumeTips, setShowResumeTips] = useState(false);
  const [showSOPFormDialog, setShowSOPFormDialog] = useState(false);
  const [sectionOrder, setSectionOrder] = useState([
    'education',
    'experience',
    'skills',
    'projects',
    'references'
  ]);

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
        const resumeId = snapshot.key;

        if (data) {
          const loadedData = {
            id: resumeId,
            personalInfo: {
              ...initialResumeState.personalInfo,
              ...(data.resumeData?.personalInfo || {}),
            },
            education: data.resumeData?.education || [],
            experience: data.resumeData?.experience || [],
            skills: data.resumeData?.skills || [],
            projects: data.resumeData?.projects || [],
            references: data.resumeData?.references || [],
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
    // setUnsavedChanges(true);
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
      fullPrompt = generateHumanizedSOPPrompt(resumeData, additionalData);

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
          "Required visa application details are missing."
        );
        setIsGeneratingContent(false);
        setShowGeneratedContentDialog(false);
        return;
      }
      fullPrompt = `Generate visa interview questions for student visa to ${additionalData.country}. University: ${additionalData.universityName}, Course: ${additionalData.courseName}. Include 10-12 realistic questions covering: purpose, finances, ties to home country, post-study plans. Format as numbered list with answers.`;
    } else {
      // Create a concise but informative summary of resume data
      const resumeSummary = `
Name: ${resumeData.personalInfo?.fullName || 'N/A'}
Contact: ${resumeData.personalInfo?.email || ''} ${resumeData.personalInfo?.phone || ''}
Professional Summary: ${resumeData.personalInfo?.summary || 'N/A'}

Skills:
${resumeData.skills?.map(cat => `- ${cat.name}: ${Array.isArray(cat.skills) ? cat.skills.join(', ') : cat.skills}`).join('\n') || 'N/A'}

Experience:
${resumeData.experience?.length ? resumeData.experience.map(exp => `
Position: ${exp.position || exp.jobTitle || 'N/A'}
Company: ${exp.company || 'N/A'}
Duration: ${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}
Key Responsibilities:
${Array.isArray(exp.responsibilities) ? exp.responsibilities.map(r => `- ${r}`).join('\n') : (exp.responsibilities || exp.description || 'N/A')}
`).join('\n') : 'N/A'}

Projects:
${resumeData.projects?.length ? resumeData.projects.map(proj => `
Title: ${proj.title || proj.name || 'N/A'}
Description: ${proj.description || 'N/A'}
Technologies: ${proj.technologies || 'N/A'}
`).join('\n') : 'N/A'}

Education:
${resumeData.education?.length ? resumeData.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.year || ''})`).join('\n') : 'N/A'}
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
              ? getRandomSystemMessage()
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

        if (type === "Statement of Purpose") {
          processedMessage = addFinalHumanTouches(processedMessage);
        }

        if (type === "Visa Interview Questions") {
          const redFlagTips = `\n\n---\n\n RED FLAG INDICATORS I'M WATCHING FOR:\n\n🚩 Financial Red Flags:\n- The sponsor's income doesn't justify the expense\n- Recent large deposits in bank accounts\n- Inconsistent financial documentation\n- Vague explanations about funding sources\n\n🚩 Intent Red Flags:\n- Weak ties to the home country\n- Strong connections in the destination country\n- Evasive answers about return plans\n- Inconsistent story about the purpose of travel\n\n🚩 Credibility Red Flags:**\n- Contradictory statements\n- Nervous behavior beyond normal interview anxiety\n- Rehearsed or coached answers\n- Unable to provide specific details about plans`;
          processedMessage += redFlagTips;
        }

        setGeneratedContent(processedMessage.trim());
      } else {
        setGenerateContentError(`No ${type} generated. Please try again.`);
      }
    } catch (err) {
      console.error(`Error generating ${type}:`, err);
      setGenerateContentError(`Failed to generate ${type}: ${err.message}`);
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
            onClick={handleGenerateInterviewQuestions}
            disabled={isGeneratingContent}
            sx={{
              "&:hover": { backgroundColor: "#f3f0fa" },
              opacity: isGeneratingContent ? 0.5 : 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <QuestionAnswerIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
            </ListItemIcon>
            <ListItemText
              primary="Generate Interview Questions"
              primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleGenerateCoverLetter}
            disabled={isGeneratingContent}
            sx={{
              "&:hover": { backgroundColor: "#f3f0fa" },
              opacity: isGeneratingContent ? 0.5 : 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ArticleIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
            </ListItemIcon>
            <ListItemText
              primary="Generate Cover Letter"
              primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setShowSOPFormDialog(true)}
            disabled={isGeneratingContent}
            sx={{
              "&:hover": { backgroundColor: "#f3f0fa" },
              opacity: isGeneratingContent ? 0.5 : 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ArticleIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
            </ListItemIcon>
            <ListItemText
              primary="Generate Statement of Purpose"
              primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setShowVisaFormDialog(true)}
            disabled={isGeneratingContent}
            sx={{
              "&:hover": { backgroundColor: "#f3f0fa" },
              opacity: isGeneratingContent ? 0.5 : 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <GavelIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
            </ListItemIcon>
            <ListItemText
              primary="Generate Visa Interview Questions"
              primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
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

            {/* <Navbar
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
            /> */}

            <Container
              // maxWidth="lg"
              sx={{
                flexGrow: 1,
                py: { xs: 2, sm: 3 },
                px: "0px !important",
                mb: { xs: 8, md: 3 },
              }}
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
                <AnimatedCard elevation={1}>{renderForm()}</AnimatedCard>
              ) : (
                <Box sx={{ mt: { xs: 0, sm: -2 } }}>
                  {" "}
                  <ResumePreview 
                    resumeData={resumeData} 
                    onBack={prevStep} 
                    sectionOrder={sectionOrder}
                    setSectionOrder={setSectionOrder}
                    onUpdateData={updateResumeData}
                    setUnsavedChanges={setUnsavedChanges}
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
                {/* <BottomNavigationAction
                  label={isSmall ? "View" : "Preview"}
                  value={previewStepId}
                  icon={<VisibilityIcon />}
                  sx={{ minWidth: "auto", px: 1 }}
                /> */}
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
          <Collapse in={!isPreviewMode}>
            <Tooltip title="Preview Resume" placement="left">
              <Fab
                variant="extended"
                onClick={() => handleNavItemClick(previewStepId)}
                sx={{
                  position: "fixed",
                  bottom: { xs: isMobile ? 80 : 32, md: 32 },
                  right: 32,
                  height: "50px",
                  width: "50px",
                  borderRadius: "50%",
                  color: "white",
                  backgroundImage: lavenderPalette.gradient,
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <VisibilityIcon sx={{ mr: 0 }} />
                {/* <VisibilityIcon sx={{ mr: 1 }} /> */}
                {/* Preview */}
              </Fab>
            </Tooltip>
          </Collapse>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default ResumeBuilderPage;
