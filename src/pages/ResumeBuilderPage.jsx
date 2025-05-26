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
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
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

  const [generatedContentTitle, setGeneratedContentTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [showGeneratedContentDialog, setShowGeneratedContentDialog] =
    useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generateContentError, setGenerateContentError] = useState("");
  const [showCountrySelection, setShowCountrySelection] = useState(false);
  const [showResumeTips, setShowResumeTips] = useState(false);

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

  const generateContent = async (type, country = null) => {
    if (!currentUser || !resumeId) {
      setGenerateContentError("User not authenticated or resume ID missing.");
      return;
    }

    setGeneratedContentTitle(`Generated ${type}`);
    setShowGeneratedContentDialog(true);
    setIsGeneratingContent(true);
    setGeneratedContent("");
    setGenerateContentError("");

    let basePrompt = `Based on the following resume data, please generate a ${type}. `;
    switch (type) {
      case "Interview Questions":
        basePrompt +=
          "Focus on questions that would assess the candidate's skills, experience, personality, and suitability for roles related to their profile. **For each question, also provide a concise and ideal answer.** Format the output as a numbered list of 'Question: [question]\nAnswer: [answer]'.";
        break;
      case "Cover Letter":
        basePrompt +=
          "Write a professional and compelling cover letter for my job application. Here are my details: Job Application Information: Position title: [Exact job title from posting] Company name: [Company name] Department/Team: [If specified in job posting] Job posting source: [Where you found the job - LinkedIn, company website, etc.] Application deadline: [If mentioned] Company Research: Company mission/values: [What the company stands for] Recent company news: [Recent achievements, expansions, products, or initiatives] Company culture: [What you know about their work environment] Industry position: [Their role in the industry, competitors, market position] Why you want to work there: [Specific reasons beyond just the job] Job Requirements Analysis: Key qualifications required: [Top 5-6 requirements from job posting] Preferred qualifications: [Additional skills/experience they want] Specific skills mentioned: [Technical skills, software, methodologies listed] Experience level required: [Years of experience, seniority level] Education requirements: [Degree requirements, certifications needed] Your Background: Current position/status: [Your current job title and company] Years of relevant experience: [Total experience in this field/role] Education: [Highest degree, relevant certifications, graduation year] Industry experience: [Industries you've worked in] Career progression: [Brief overview of your career growth] Relevant Experience: Most relevant role: [Job title, company, duration, key responsibilities] Relevant project 1: [Specific project that matches job requirements] Relevant project 2: [Another project showcasing required skills] Leadership experience: [Any management, team lead, or project lead roles] Cross-functional collaboration: [Experience working with different teams] Key Achievements: Quantifiable achievement 1: [Specific result with numbers/percentages] Quantifiable achievement 2: [Another measurable accomplishment] Award or recognition: [Any awards, recognition, or special acknowledgments] Problem-solving example: [A challenge you solved and the impact] Innovation/improvement: [Process improvements or innovations you've made] Skills Match: Technical skills: [Skills that directly match job requirements] Soft skills: [Communication, leadership, analytical skills, etc.] Industry knowledge: [Specific industry expertise relevant to role] Tools/software: [Specific tools mentioned in job posting that you know] Certifications: [Relevant certifications you hold] Personal Motivation: Why this role interests you: [Specific aspects of the job that excite you] Career goals alignment: [How this role fits your career trajectory] What you hope to contribute: [How you plan to add value to the team] Growth opportunities: [What you hope to learn/develop in this role] Connection/Referral: Referral source: [If someone referred you, mention their name and role] Networking connection: [If you met someone from the company] Previous interaction: [Any prior contact with the company] Mutual connections: [LinkedIn connections or professional relationships] Availability and Logistics: Start date availability: [When you can begin] Location preference: [Remote, hybrid, on-site flexibility] Salary expectations: [If you want to mention this] Relocation willingness: [If job requires relocation] Additional Information: Cover letter length: [Typically 3-4 paragraphs, 250-400 words] Tone preference: [Professional, enthusiastic, confident, etc.] Industry style: [Conservative for finance, creative for marketing, etc.] Special circumstances: [Career change, gap in employment, etc.] Writing Instructions: Write a cover letter that: Opens with a strong hook that shows knowledge of the company and enthusiasm for the role Clearly connects my experience and skills to the specific job requirements Highlights 2-3 specific achievements that demonstrate my ability to excel in this role Shows genuine interest in the company and explains why I want to work there Demonstrates cultural fit and alignment with company values Includes a confident call to action for next steps Maintains professional tone while showing personality and enthusiasm Uses specific examples and quantifiable results where possible Avoids generic language and clearly differentiates me from other candidates Follows standard business letter format with proper salutation and closing Make sure the letter tells a compelling story of why I'm the ideal candidate for this specific role at this specific company, focusing on mutual benefit and value creation.";
        break;
      case "Statement of Purpose":
        basePrompt +=
          "Write a compelling and professional statement of purpose for my graduate school application. Here are my details: Personal Information: Name: [Your name] Program applying to: [Specific program name and degree level] University/Institution: [University name] Field of study: [Your field/major] Academic Background: Current degree/status: [Your current degree, GPA if strong, graduation year] Relevant coursework: [List 3-5 most relevant courses] Academic achievements: [Honors, awards, scholarships, publications] Research experience: [Any research projects, labs, thesis work] Professional Experience: Work experience: [Relevant jobs, internships, roles with brief descriptions] Skills developed: [Technical skills, software, methodologies] Leadership roles: [Any leadership positions, responsibilities] Industry exposure: [Relevant industry experience or knowledge] Research Interests: Primary research interests: [Your main research areas/questions] Specific topics: [2-3 specific problems or areas you want to explore] Methodology preferences: [Quantitative, qualitative, mixed methods, etc.] Long-term research goals: [What you hope to contribute to the field] Program-Specific Information: Why this program: [Specific reasons this program fits your goals] Faculty of interest: [2-3 faculty members whose work aligns with yours] Program resources: [Labs, centers, opportunities that attract you] Unique program aspects: [What makes this program special] Career Goals: Short-term goals: [What you want to do immediately after graduation] Long-term career vision: [5-10 year career objectives] Impact you want to make: [How you want to contribute to field/society] Industry or sector preference: [Academic, industry, government, non-profit] Personal Story/Motivation: What sparked your interest: [The moment or experience that got you interested in this field] Challenges overcome: [Any obstacles that shaped your resilience] Unique perspective: [What makes your background/viewpoint distinctive] Personal qualities: [Your strengths relevant to graduate study] Additional Information: Word limit: [Specify word count - typically 500-1000 words] Tone preference: [Professional but personal, enthusiastic, analytical, etc.] Special circumstances: [Career change, gap in employment, etc.] Writing Instructions: Write a cohesive statement that: Opens with an engaging hook related to my interest in the field Seamlessly integrates my background, interests, and goals Demonstrates clear knowledge of and fit with the specific program Shows genuine passion and commitment to the field Concludes with a strong statement about my future contributions Uses specific examples and avoids generic language Maintains professional tone while showing authentic personality Stays within the word limit specified above Make sure the statement tells a compelling story of my academic and professional journey while clearly articulating why I'm an excellent fit for this specific program.";
        break;
      case "Visa Interview Questions":
        if (!country) {
          setGenerateContentError(
            "Please select a country (US or UK) for Visa Interview Questions."
          );
          setIsGeneratingContent(false);
          setShowGeneratedContentDialog(false);
          return;
        }
        basePrompt += `Generate a comprehensive list of visa interview questions tailored to my specific situation for a **${country}** visa. Create realistic questions that visa officers typically ask, organized by category, along with concise and ideal answers for each question. Visa Application Details: Visa type: [Student F-1, Work H-1B, Tourist B-2, Business B-1, etc.] Destination country: [${country}] Duration of stay: [How long you plan to stay] Purpose of visit: [Study, work, tourism, business, family visit, etc.] Consulate/Embassy location: [Where you're interviewing] Interview language: [English, or specify if different] Personal Background: Age: [Your age] Marital status: [Single, married, divorced, etc.] Current occupation: [Your current job/student status] Education level: [Highest degree completed] Home country: [Your country of citizenship] City of residence: [Where you currently live] Language skills: [Languages you speak and proficiency levels] Travel and Visa History: Previous visa applications: [Any previous visas applied for and outcomes] Countries visited: [List of countries you've traveled to] Visa refusals: [Any previous rejections and reasons if known] Immigration violations: [Any overstays or issues - be honest] Current valid visas: [Other country visas you currently hold] Financial Information: Income source: [Salary, business, family support, scholarships, etc.] Monthly income: [Your regular income in local currency] Bank balance: [Approximate savings amount] Financial sponsor: [If someone else is funding your trip] Employment status: [Full-time, part-time, unemployed, student, etc.] Assets owned: [Property, investments, business ownership] Purpose-Specific Details (Fill relevant section): For Student Visa: University/School: [Name of institution] Program: [Degree program and field of study] Duration: [Length of study program] Tuition fees: [Annual cost] Funding source: [How you're paying for education] Post-graduation plans: [Career plans after graduation] For Work Visa: Company name: [Employing company] Job position: [Your role/title] Salary offered: [Annual compensation] Work experience: [Years of relevant experience] Relationship to company: [How you got the job] Work location: [Where you'll be working] For Tourist/Business Visa: Travel itinerary: [Places you plan to visit] Accommodation: [Where you'll stay] Travel companions: [Who you're traveling with] Trip duration: [Exact dates of travel] Business contacts: [If business visa, who you're meeting] Return travel plans: [Your return ticket details] Ties to Home Country: Family ties: [Parents, spouse, children living in home country] Property ownership: [Real estate, business owned] Job obligations: [Employment requiring your return] Social connections: [Community involvement, responsibilities] Future commitments: [Planned events, obligations at home] Reasons to return: [Why you must/want to come back] Potential Concerns/Weaknesses: Application weak points: [Any aspects of your application that might raise questions] Employment gaps: [Any periods of unemployment] Inconsistencies: [Any discrepancies in your application] Age factors: [If very young or older applicant] Single/unmarried status: [If this might be seen as lacking ties] Previous rejections: [How to address past refusals] Specific Preparation Needs: Difficult questions to practice: [Areas you're most worried about] Document explanations needed: [Complex financial or personal situations] Language barriers: [If English isn't your first language] Nervousness factors: [What makes you most anxious about the interview] Question Generation Instructions: Generate interview questions that cover: Basic Information Questions (5-8 questions) Personal background and current situation Purpose of Visit Questions (8-12 questions) Specific to my visa type and travel purpose Financial Questions (6-10 questions) Income, expenses, funding sources, financial stability Ties to Home Country Questions (5-8 questions) Reasons to return, obligations, connections Travel History Questions (4-6 questions) Previous travel, visa history, compliance Specific Concern Questions (5-8 questions) Based on potential weaknesses in my application Tricky/Complex Questions (4-6 questions) Challenging scenarios and hypothetical situations For each question, provide: The question as typically asked by visa officers A concise and ideal answer for the question What NOT to say or avoid Additional Requirements: Include both straightforward and challenging questions Cover questions about [specific concerns you mentioned above] Provide questions in order from basic to more complex Include follow-up questions that officers might ask Add cultural/country-specific questions relevant to ${country} Include questions that test consistency with your application documents Make the questions realistic and reflect actual visa interview experiences, focusing on the most critical areas that determine visa approval for my specific situation.`;
        break;
      default:
        basePrompt += "";
    }

    const fullPrompt = `${basePrompt}\n\nResume Data:\n${JSON.stringify(
      resumeData,
      null,
      2
    )}\n\n${type}:`;

    try {
      const apiKey = import.meta.env.VITE_APP_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key is not configured.");
      }
      const apiUrl = "https://api.openai.com/v1/chat/completions";

      const payload = {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: type === "Statement of Purpose" ? 1500 : 800,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenAI API error: ${response.status} ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const result = await response.json();
      const message = result.choices?.[0]?.message?.content;

      if (message) {
        setGeneratedContent(message.trim());
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
  const handleGenerateSOP = () => generateContent("Statement of Purpose");

  const handleGenerateVisaQuestionsClick = (country) => {
    setShowCountrySelection(false);
    generateContent("Visa Interview Questions", country);
  };

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
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
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
        <ListItem disablePadding>
          <ListItemButton onClick={handleGenerateInterviewQuestions}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <QuestionAnswerIcon />{" "}
            </ListItemIcon>
            <ListItemText
              primary="Generate Interview Questions"
              primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleGenerateCoverLetter}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ArticleIcon />{" "}
            </ListItemIcon>
            <ListItemText
              primary="Generate Cover Letter"
              primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleGenerateSOP}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ArticleIcon />{" "}
            </ListItemIcon>
            <ListItemText
              primary="Generate Statement of Purpose"
              primaryTypographyProps={{ fontWeight: 500, variant: "body2" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setShowCountrySelection(true)}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <GavelIcon />{" "}
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
            onOpenResumeTips={() => setShowResumeTips(true)}
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
        <GeneratedContentDialog
          open={showGeneratedContentDialog}
          onClose={() => setShowGeneratedContentDialog(false)}
          title={generatedContentTitle}
          content={generatedContent}
          loading={isGeneratingContent}
          error={generateContentError}
        />
        <Dialog
          open={showCountrySelection}
          onClose={() => setShowCountrySelection(false)}
        >
          <DialogTitle>Select Country for Visa Questions</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Which country's visa interview questions would you like to
              generate?
            </DialogContentText>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}
            >
              <Button
                variant="contained"
                onClick={() => handleGenerateVisaQuestionsClick("US")}
              >
                US Visa
              </Button>
              <Button
                variant="contained"
                onClick={() => handleGenerateVisaQuestionsClick("UK")}
              >
                UK Visa
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
        <ResumeTipsDialog
          open={showResumeTips}
          onClose={() => setShowResumeTips(false)}
        />
        {/* End New Resume Tips Dialog */}
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
      </Box>
    </ThemeProvider>
  );
}

export default ResumeBuilderPage;
