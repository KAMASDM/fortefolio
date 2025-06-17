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

/**
 * ULTRA-HUMANIZED SOP GENERATION SYSTEM
 *
 * This enhanced system uses multiple layers of humanization:
 * 1. Randomized writing personalities and quirks
 * 2. Natural conversation patterns and imperfections
 * 3. Aggressive formal-to-casual language conversion
 * 4. Multiple post-processing layers for authentic voice
 * 5. Maximum API creativity settings (temperature: 1.0)
 * 6. Heavy repetition penalties and presence bonuses
 *
 * Expected AI Detection: <10% (down from 44%)
 *
 * The system creates content that includes:
 * - Natural hesitations and self-corrections
 * - Conversational elements and contractions
 * - Realistic thought patterns and digressions
 * - Personal quirks and imperfections
 * - Authentic voice and personality
 */

// Ultra-Enhanced Anti-AI Detection SOP Generation
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
  const writingPersonalities = [
    "slightly anxious but determined storyteller",
    "quietly confident with moments of vulnerability",
    "enthusiastic but occasionally self-deprecating",
    "thoughtful with bursts of excitement",
    "methodical but emotionally expressive",
  ];

  const personalQuirks = [
    "tends to use parenthetical asides",
    "occasionally starts sentences with 'And' or 'But'",
    "likes to use specific examples from daily life",
    "has a habit of connecting unrelated experiences",
    "often uses phrases like 'I guess' or 'I suppose'",
  ];

  const narrativeStyles = [
    "Tell your story like you're explaining to a close friend",
    "Write as if you're journaling about your journey",
    "Narrate like you're having coffee with the admissions officer",
    "Share your story as if talking to a mentor",
    "Write like you're recording a voice memo to yourself",
  ];

  const randomPersonality =
    writingPersonalities[
      Math.floor(Math.random() * writingPersonalities.length)
    ];
  const randomQuirk =
    personalQuirks[Math.floor(Math.random() * personalQuirks.length)];
  const randomNarrative =
    narrativeStyles[Math.floor(Math.random() * narrativeStyles.length)];

  const personalContext = {
    culturalBackground:
      additionalData.culturalBackground || "diverse background",
    personalValues: additionalData.personalValues || "innovation and impact",
    uniqueExperiences:
      additionalData.uniqueExperiences || "varied life experiences",
    specificChallenges:
      additionalData.specificChallenges ||
      "academic and personal growth challenges",
  };

  return `You are writing as a real person - not an AI. ${randomNarrative}. Your writing personality: ${randomPersonality} who ${randomQuirk}.

ULTRA-HUMANIZATION REQUIREMENTS:
- Write with natural imperfections and realistic thought patterns
- Include conversational elements like "Well,", "So,", "Actually,", "I mean,"
- Use incomplete thoughts that get clarified later
- Add realistic hesitations: "I'm not sure how to put this, but..."
- Include specific, mundane details that only a real person would remember
- Show thought evolution: "Initially I thought X, but then I realized Y"
- Use informal transitions: "Anyway,", "Moving on,", "That said,"
- Include self-corrections: "Actually, that's not quite right..."
- Add genuine uncertainty: "I think", "I believe", "If I'm being honest"
- Use colloquial expressions naturally integrated

HUMAN WRITING SIMULATION:
- Start some sentences with "And", "But", "So", "Well" (like real people do)
- Use fragments occasionally: "Which is interesting." "Not ideal, I know."
- Include realistic filler words: "basically", "pretty much", "kind of", "sort of"
- Add personal interjections: "honestly", "to be fair", "looking back"
- Use conversational qualifiers: "I guess", "I suppose", "I'd say"
- Include natural redundancies and clarifications real people make
- Add genuine emotional reactions: "I was thrilled", "it was terrifying", "honestly, I panicked"
- Use specific time references: "last Tuesday", "around 3 PM", "during finals week"
- Include sensory details: "the smell of coffee", "bright fluorescent lights"
- Add realistic digressions that connect back to the main point

CONTENT PERSONALIZATION DATA:
Resume/Background: ${JSON.stringify(resumeData, null, 2)}

Application Specifics:
- Target Destination: ${additionalData.targetCountry}
- Institution: ${additionalData.universityName}
- Location: ${additionalData.campusLocation}
- Academic Level: ${additionalData.courseLevel}
- Program: ${additionalData.courseName}
- Cultural Context: ${personalContext.culturalBackground}
- Core Values: ${personalContext.personalValues}
- Unique Experiences: ${personalContext.uniqueExperiences}
- Personal Challenges: ${personalContext.specificChallenges}

Additional Achievements: ${
    additionalData.additionalAccomplishments || "None specified."
  }

WRITING APPROACH - NATURAL STORYTELLING:

Opening Strategy: Start with something unexpected - maybe a mistake you made, a random conversation, something you noticed while waiting in line, or a moment when you felt completely lost. Real people don't always have dramatic epiphanies. Sometimes it's just... gradual realization.

Narrative Flow (but don't make it obvious):
1. Personal Foundation (200-250 words):
   - Start with that random/unexpected moment
   - Let your thoughts wander a bit (like real people do)
   - Include a small confession or vulnerability
   - Mention something specific about your environment/context
   - Show how your mind actually works, not how you think it should work

2. Academic & Professional Evolution (300-350 words):
   - Talk about specific moments, not just accomplishments
   - Include what you were thinking at the time (even if silly)
   - Mention people by their role: "my advisor", "this guy in my study group"
   - Include small failures or awkward moments
   - Show real decision-making process with doubts and changes
   - Add specific tools, places, times that feel real

3. Future Vision & Program Alignment (200-250 words):
   - Be honest about uncertainties: "I'm not entirely sure, but..."
   - Include backup thoughts: "If that doesn't work, I'll probably..."
   - Mention specific professors or courses you've researched
   - Show you've actually thought about practical details
   - End with something personal, not dramatic

NATURAL LANGUAGE PATTERNS:
- "I remember thinking..." "It hit me that..." "I found myself..."
- "Actually, now that I think about it..." "I suppose what I mean is..."
- "To be honest..." "If I'm being completely honest..." "I'll admit..."
- "I'm not sure how to explain this, but..." "It's hard to put into words..."
- "Looking back..." "At the time..." "Now I realize..."
- "I guess what really struck me..." "The thing is..." "What I found interesting..."
- Include natural corrections: "Well, not exactly, but..." "Actually, that's not quite right..."

ORIGINALITY SAFEGUARDS:
- Every example must be tied to the specific resume data provided
- Create unique analogies or metaphors for this person's journey
- Reference current, specific developments in their field of study
- Include location-specific details when relevant
- Mention personal interests/hobbies that connect to academic goals
- Use field-specific terminology naturally and correctly
- Create original insights about the connection between past experiences and future goals

ANTI-DETECTION STRATEGIES:
- Vary sentence beginnings (avoid starting multiple sentences with "I")
- Include industry-specific knowledge and current trends
- Use natural speech patterns and rhythms
- Include subtle regional language variations if applicable
- Embed domain expertise naturally through word choice
- Use contemporary references appropriate to the field
- Include realistic timeframes and progression
- Show authentic personality quirks through writing style

LENGTH: Target 850-950 words with natural paragraph breaks

FINAL CHECKS:
- Does this sound like a real person telling their story?
- Are there specific, verifiable details throughout?
- Does the writing flow naturally when read aloud?
- Is the language appropriately sophisticated but not artificially complex?
- Would an admissions officer remember this applicant after reading?

Now write the Statement of Purpose following these guidelines, ensuring every sentence feels authentic and personally crafted.`;
};

const postProcessSOP = (sopContent) => {
  let processedContent = sopContent;

  // AGGRESSIVE formal-to-casual replacements
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

  // Add human imperfections and natural flow
  processedContent = addHumanImperfections(processedContent);
  processedContent = addNaturalVariations(processedContent);
  processedContent = addConversationalElements(processedContent);

  return processedContent;
};

const addHumanImperfections = (text) => {
  let sentences = text.match(/[^\.!?]+[\.!?]+/g) || [];

  sentences = sentences.map((sentence, index) => {
    const random = Math.random();

    // Add conversational starters (20% chance)
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

    // Add qualifiers (15% chance)
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
      // Insert after first few words
      const words = sentence.split(" ");
      if (words.length > 3) {
        words.splice(2, 0, qualifier + ",");
        sentence = words.join(" ");
      }
    }

    // Add contractions more aggressively
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

  // Add more natural sentence starters
  finalText = finalText.replace(/^([A-Z])/gm, (match, firstChar, offset) => {
    if (offset === 0) return match; // Don't change the very first character

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

  // Add more contractions and casual language
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
      // Apply most changes
      finalText = finalText.replace(regex, casual);
    }
  });

  // Add occasional fragments (like humans write)
  finalText = finalText.replace(
    /\. (Which|That|Something that|This|It)/g,
    (match, word) => {
      if (Math.random() < 0.4) {
        return `. ${word}`;
      }
      return match;
    }
  );

  // Add more realistic transitions
  finalText = finalText.replace(
    /\. (I think|I believe|I feel|I know)/g,
    ". I mean, $1"
  );

  // Occasionally add emphasis dashes
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

  // Add parenthetical asides (human quirk)
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

  // Add self-corrections
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
    // Randomly add natural connectors (but less formal ones)
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

    // Occasionally start with "And" or "But" (like humans do)
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

  // Enhanced generateContent function with humanization for SOP
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
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 800,
    };

    if (type === "Statement of Purpose" && additionalData) {
      // Use enhanced humanized prompt for SOP
      fullPrompt = generateHumanizedSOPPrompt(resumeData, additionalData);

      // ULTRA-Enhanced API parameters for maximum human-like content
      apiPayload = {
        model: "gpt-4",
        temperature: 1.0, // Maximum creativity and randomness
        max_tokens: 1500,
        top_p: 0.9, // More focused but still creative
        frequency_penalty: 0.8, // Heavily reduce repetition
        presence_penalty: 0.7, // Strongly encourage new ideas and topics
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
      let basePrompt = `Based on the following resume data, please generate a ${type}. `;
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

    try {
      const apiKey = import.meta.env.VITE_APP_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key is not configured.");
      }
      const apiUrl = "https://api.openai.com/v1/chat/completions";

      const payload = {
        ...apiPayload,
        messages: [
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
        ],
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
        // Ultra-aggressive post-processing for maximum humanization
        if (type === "Statement of Purpose") {
          message = postProcessSOP(message);
          message = addFinalHumanTouches(message);
        }

        // Add visa interview red flags if applicable
        if (type === "Visa Interview Questions") {
          const redFlagTips = `\n\n---\n\n RED FLAG INDICATORS I'M WATCHING FOR:\n\n🚩 Financial Red Flags:\n- The sponsor's income doesn't justify the expense\n- Recent large deposits in bank accounts\n- Inconsistent financial documentation\n- Vague explanations about funding sources\n\n🚩 Intent Red Flags:\n- Weak ties to the home country\n- Strong connections in the destination country\n- Evasive answers about return plans\n- Inconsistent story about the purpose of travel\n\n🚩 Credibility Red Flags:**\n- Contradictory statements\n- Nervous behavior beyond normal interview anxiety\n- Rehearsed or coached answers\n- Unable to provide specific details about plans`;
          message += redFlagTips;
        }

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
