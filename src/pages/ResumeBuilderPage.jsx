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
import VisaInterviewFormDialog from "../components/ResumeBuilderPage/GenerateQuestionDialog/VisaInterviewFormDialog";

import { getCustomTheme } from "../theme/customTheme";
import SOPFormDialog from "../components/ResumeBuilderPage/GenerateQuestionDialog/SOPFormDialog";

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
  const [showVisaFormDialog, setShowVisaFormDialog] = useState(false);
  const [showResumeTips, setShowResumeTips] = useState(false);
  const [showSOPFormDialog, setShowSOPFormDialog] = useState(false);

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

    if (type === "Statement of Purpose" && additionalData) {
      fullPrompt = `As a seasoned content writer with nearly 10 years of experience crafting compelling Statements of Purpose that have helped hundreds of students secure admissions to their dream universities, I will create a 100% original, impactful, and engaging SOP tailored specifically to your academic journey and aspirations.
      Required Information from You:
      1. Resume/CV: ${JSON.stringify(resumeData, null, 2)}
      2. Application Details:
      Target Country for Application: ${additionalData.targetCountry}
      College/University Name: ${additionalData.universityName}
      Campus Location: ${additionalData.campusLocation}
      Course Level: ${additionalData.courseLevel}
      Specific Course/Program Name: ${additionalData.courseName}
      3. Additional Accomplishments: ${
        additionalData.additionalAccomplishments || "None provided."
      }
      My SOP Writing Approach:
      Opening Hook Strategy
      I will craft a compelling opening that immediately captures the admissions committee's attention using one of these proven techniques:
      A transformative moment that sparked your academic passion
      A thought-provoking question related to your field
      A vivid scene that demonstrates your commitment
      An unexpected connection that led to your chosen path
      Narrative Architecture
      Your SOP will follow a strategic three-act structure:
      Act 1: Foundation & Inspiration - What initially drew you to this field, defining moments that shaped your academic direction, and early experiences that built your foundational knowledge.
      Act 2: Development & Growth - Academic achievements and how they prepared you, professional experiences and their impact on your goals, challenges overcome and lessons learned, research projects, internships, or significant coursework.
      Act 3: Future Vision & Fit - Clear articulation of your career objectives, why this specific program aligns with your goals, how you'll contribute to the university community, and your potential impact in the field post-graduation.
      Key Elements I Will Incorporate:
      ✓ Authentic Voice: Your unique personality and perspective will shine through every paragraph
      ✓ Specific Examples: Concrete achievements and experiences rather than generic statements
      ✓ Program Research: Deep understanding of why this particular program fits your goals (without mentioning the website)
      ✓ Cultural Awareness: Sensitivity to the academic culture of your target country
      ✓ Forward-Looking Vision: Clear connection between past experiences, current goals, and future aspirations
      ✓ Quantifiable Impact: Specific metrics and outcomes where applicable
      Quality Assurance:
      100% Original Content: Every word will be crafted specifically for your application
      Plagiarism-Free Guarantee: Original thinking and expression throughout
      Admissions Committee Perspective: Written with deep understanding of what evaluators seek
      Optimal Length: Typically 800-1000 words unless specified otherwise
      Professional Tone: Academic yet engaging, formal yet personal
      What Makes This SOP Stand Out:
      Storytelling Excellence: Your journey will be presented as a compelling narrative, not a list of achievements
      Strategic Positioning: Every paragraph will strategically build your case for admission
      Emotional Resonance: The SOP will connect with readers on both intellectual and emotional levels
      Future-Focused: Clear demonstration of how this program fits into your larger life vision
      Memorable Conclusion: A powerful ending that leaves a lasting impression
      Industry Insights I Bring:
      Having analyzed thousands of successful SOPs and worked with students across diverse fields—from STEM to liberal arts, from undergraduate to doctoral programs—I understand the nuanced differences in what each program values. I know how to highlight technical expertise for engineering programs, demonstrate research potential for graduate school, and showcase leadership qualities for MBA applications.

      Now, write the Statement of Purpose based on all the provided details.`;
    } else {
      let basePrompt = "";
      if (type === "Visa Interview Questions") {
        if (!additionalData) {
          setGenerateContentError(
            "Required visa application details are missing."
          );
          setIsGeneratingContent(false);
          setShowGeneratedContentDialog(false);
          return;
        }
        fullPrompt = `As a seasoned Embassy Visa Officer with nearly 10 years of experience conducting thousands of visa interviews across multiple visa categories, I will conduct a comprehensive and challenging interview that mirrors real embassy conditions. My role is to thoroughly assess your genuine intentions, financial stability, ties to your home country, and overall credibility as a visa applicant.

Required Documentation/Information from Applicant:
1. Complete Resume/CV:
${JSON.stringify(resumeData, null, 2)}

2. Visa Application Details:
- Type of Visa: Student Visa
- Destination Country: ${additionalData.country}
- Purpose of Travel: To pursue higher education.

3. Academic Information (if applicable):
- University/Institution Name: ${additionalData.universityName}
- Course/Program Name: ${additionalData.courseName}

4. Financial Sponsor Details:
- Sponsor Name: ${additionalData.sponsorName}
- Relationship to Applicant: Sponsor
- Sponsor's Designation/Job Title: ${additionalData.sponsorDesignation}
- Annual Salary/Income: ${additionalData.sponsorSalary}

Interview Methodology:
Pre-Interview Assessment
I will first analyze your documentation to identify potential red flags, inconsistencies, or areas requiring deeper investigation before conducting the interview.
Interview Structure: Multi-Layered Questioning

ROUND 1: BASIC ELIBILITY & INTENT
Opening Questions:
- What is the specific purpose of your visit to ${additionalData.country}?
- How long do you intend to stay?
- Have you ever been denied a visa to any country? If yes, explain why.
Probing Questions:
- Why did you choose this particular country over others?
- What specific research did you do before deciding on this destination?
- How does this program align with your long-term goals?

ROUND 2: FINANCIAL SCRUTINY (Most Critical)
Direct Financial Questions:
- What is the total cost of your studies?
- Provide a detailed breakdown of your expected expenses.
- How exactly will you fund this amount?
Sponsor Investigation (if applicable):
- How long has your sponsor been employed in their current position?
- What is their exact monthly take-home salary after taxes?
- Why is your sponsor willing to fund this significant expense for you?
- What is your sponsor's annual income for the last 3 years?
- Does your sponsor have other financial dependents?
Deep Financial Probing:
- If your sponsor earns ${
          additionalData.sponsorSalary
        }, how can they afford your expenses while maintaining their lifestyle?
- Show me evidence of your sponsor's savings specifically allocated for your education.
- What happens if your sponsor loses their job during your stay abroad?
- Have you or your sponsor taken any loans for this purpose?

ROUND 3: TIES TO HOME COUNTRY (Critical for Assessment)
Employment/Career Ties:
- What is your current employment status?
- If employed: Will your job be held for you during your absence?
- If unemployed: What are your immediate job prospects upon return?
- How will this experience benefit your career in your home country?
Family & Social Ties:
- Describe your immediate family members and their dependence on you.
- What significant responsibilities do you have in your home country?
- Why wouldn't you want to remain in ${additionalData.country} permanently?
Property & Asset Ties:
- Do you own any property, business, or significant assets in your home country?
- What valuable possessions would you be leaving behind?

ROUND 4: ACADEMIC/PROFESSIONAL SCRUTINY (if applicable)
Educational Background:
- Explain the gap(s) in your education/career, if any.
- Why didn't you pursue this course in your home country?
- How is this program different from what's available locally?
Institution-Specific Questions:
- Why this specific university, ${additionalData.universityName}?
- What other institutions did you apply to? What were the results?
- How did you learn about this institution?
- Who influenced your decision to choose this particular program?
Post-Study/Program Plans:
- What exactly will you do immediately after completing this program?
- How will you use this qualification/experience in your home country?
- What is your 5-year career plan?

ROUND 5: CHALLENGING SCENARIO-BASED QUESTIONS
Hypothetical Situations:
- If you were offered a job in ${
          additionalData.country
        } during your stay, what would you do?
What if your family faced a financial emergency while you're abroad?
If your sponsor died or became unable to support you, how would you manage?
What if you fail your course or your program is terminated?
Pressure Questions:
- You seem nervous. Is there something you're not telling me?
- Your financial situation doesn't seem adequate for this trip. Convince me otherwise.
- I'm not convinced about your intention to return. Change my mind.
- This appears to be an attempt to immigrate permanently. Respond to this concern.

ROUND 6: DETAILED VERIFICATION
Cross-Reference Questions:
- Repeat some earlier questions to check for consistency
- Ask for specific details about dates, amounts, timelines
- Request clarification on any contradictory information
Document Verification:
- Can you explain this discrepancy in your financial documents?
- This letter from your sponsor seems generic. Can you provide more personalized proof?
- Your academic transcripts show inconsistent performance. Explain.

Now, based on all the provided information, conduct the interview by generating a series of realistic and challenging questions based on the outlined methodology. The questions should be tough and directly challenge the applicant's profile.
`;
      } else {
        basePrompt = `Based on the following resume data, please generate a ${type}. `;
        switch (type) {
          case "Interview Questions":
            basePrompt +=
              "Focus on questions that would assess the candidate's skills, experience, personality, and suitability for roles related to their profile. **For each question, also provide a concise and ideal answer.** Format the output as a numbered list of 'Question: [question]\\nAnswer: [answer]'.";
            break;
          case "Cover Letter":
            basePrompt +=
              "Write a professional and compelling cover letter for my job application. Here are my details: Job Application Information: Position title: [Exact job title from posting] Company name: [Company name] Department/Team: [If specified in job posting] Job posting source: [Where you found the job - LinkedIn, company website, etc.] Application deadline: [If mentioned] Company Research: Company mission/values: [What the company stands for] Recent company news: [Recent achievements, expansions, products, or initiatives] Company culture: [What you know about their work environment] Industry position: [Their role in the industry, competitors, market position] Why you want to work there: [Specific reasons beyond just the job] Job Requirements Analysis: Key qualifications required: [Top 5-6 requirements from job posting] Preferred qualifications: [Additional skills/experience they want] Specific skills mentioned: [Technical skills, software, methodologies listed] Experience level required: [Years of experience, seniority level] Education requirements: [Degree requirements, certifications needed] Your Background: Current position/status: [Your current job title and company] Years of relevant experience: [Total experience in this field/role] Education: [Highest degree, relevant certifications, graduation year] Industry experience: [Industries you've worked in] Career progression: [Brief overview of your career growth] Relevant Experience: Most relevant role: [Job title, company, duration, key responsibilities] Relevant project 1: [Specific project that matches job requirements] Relevant project 2: [Another project showcasing required skills] Leadership experience: [Any management, team lead, or project lead roles] Cross-functional collaboration: [Experience working with different teams] Key Achievements: Quantifiable achievement 1: [Specific result with numbers/percentages] Quantifiable achievement 2: [Another measurable accomplishment] Award or recognition: [Any awards, recognition, or special acknowledgments] Problem-solving example: [A challenge you solved and the impact] Innovation/improvement: [Process improvements or innovations you've made] Skills Match: Technical skills: [Skills that directly match job requirements] Soft skills: [Communication, leadership, analytical skills, etc.] Industry knowledge: [Specific industry expertise relevant to role] Tools/software: [Specific tools mentioned in job posting that you know] Certifications: [Relevant certifications you hold] Personal Motivation: Why this role interests you: [Specific aspects of the job that excite you] Career goals alignment: [How this role fits your career trajectory] What you hope to contribute: [How you plan to add value to the team] Growth opportunities: [What you hope to learn/develop in this role] Connection/Referral: Referral source: [If someone referred you, mention their name and role] Networking connection: [If you met someone from the company] Previous interaction: [Any prior contact with the company] Mutual connections: [LinkedIn connections or professional relationships] Availability and Logistics: Start date availability: [When you can begin] Location preference: [Remote, hybrid, on-site flexibility] Salary expectations: [If you want to mention this] Relocation willingness: [If job requires relocation] Additional Information: Cover letter length: [Typically 3-4 paragraphs, 250-400 words] Tone preference: [Professional, enthusiastic, confident, etc.] Industry style: [Conservative for finance, creative for marketing, etc.] Special circumstances: [Career change, gap in employment, etc.] Writing Instructions: Write a cover letter that: Opens with a strong hook that shows knowledge of the company and enthusiasm for the role Clearly connects my experience and skills to the specific job requirements Highlights 2-3 specific achievements that demonstrate my ability to excel in this role Shows genuine interest in the company and explains why I want to work there Demonstrates cultural fit and alignment with company values Includes a confident call to action for next steps Maintains professional tone while showing personality and enthusiasm Uses specific examples and quantifiable results where possible Avoids generic language and clearly differentiates me from other candidates Follows standard business letter format with proper salutation and closing Make sure the letter tells a compelling story of why I'm the ideal candidate for this specific role at this specific company, focusing on mutual benefit and value creation.";
            break;
          default:
            basePrompt += "";
        }
        fullPrompt = `${basePrompt}\n\nResume Data:\n${JSON.stringify(
          resumeData,
          null,
          2
        )}\n\n${type}:`;
      }
    }

    try {
      const apiKey = import.meta.env.VITE_APP_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key is not configured.");
      }
      const apiUrl = "https://api.openai.com/v1/chat/completions";

      const payload = {
        model: "gpt-4",
        messages: [{ role: "user", content: fullPrompt }],
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
      let message = result.choices?.[0]?.message?.content;

      if (message) {
        // MODIFICATION STARTS HERE
        if (type === "Visa Interview Questions") {
          const redFlagTips = `\n\n---\n\n RED FLAG INDICATORS I'M WATCHING FOR:\n\n🚩 Financial Red Flags:\n- The sponsor's income doesn't justify the expense\n- Recent large deposits in bank accounts\n- Inconsistent financial documentation\n- Vague explanations about funding sources\n\n🚩 Intent Red Flags:\n- Weak ties to the home country\n- Strong connections in the destination country\n- Evasive answers about return plans\n- Inconsistent story about the purpose of travel\n\n🚩 Credibility Red Flags:**\n- Contradictory statements\n- Nervous behavior beyond normal interview anxiety\n- Rehearsed or coached answers\n- Unable to provide specific details about plans`;
          message += redFlagTips;
        }
        // MODIFICATION ENDS HERE
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
          <ListItemButton onClick={() => setShowSOPFormDialog(true)}>
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
          <ListItemButton onClick={() => setShowVisaFormDialog(true)}>
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
