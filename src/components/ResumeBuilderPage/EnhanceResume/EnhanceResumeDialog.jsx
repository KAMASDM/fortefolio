/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
  IconButton,
  Snackbar,
  Fade,
  Paper,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { callOpenAI } from "../../../utils/openai";

const resumeLoadingTips = [
  {
    id: 1,
    title: "Focus on Impact",
    description:
      "When enhancing, ensure each point demonstrates clear impact using metrics and action verbs. Quantify achievements whenever possible.",
  },
  {
    id: 2,
    title: "ATS Optimization",
    description:
      "AI can help identify relevant keywords from job descriptions. Ensure your enhanced resume incorporates these naturally.",
  },
  {
    id: 3,
    title: "Clarity and Conciseness",
    description:
      "Enhancements should make your resume easier to read and understand quickly. Remove jargon and be direct.",
  },
  {
    id: 4,
    title: "Tailor to the Role",
    description:
      "Even with AI suggestions, always tailor the final enhancements to the specific job you're applying for.",
  },
  {
    id: 5,
    title: "Professional Summary Power-Up",
    description:
      "Your summary is prime real estate. AI can help craft a compelling summary that hooks the reader.",
  },
  {
    id: 6,
    title: "Actionable Bullet Points",
    description:
      "Look for suggestions that turn passive statements into active, achievement-oriented bullet points.",
  },
  {
    id: 7,
    title: "Skill Section Relevance",
    description:
      "Ensure your skills section is not just a list, but highlights skills most relevant to your target roles. AI can help identify these.",
  },
  {
    id: 8,
    title: "Consistent Formatting",
    description:
      "While AI focuses on content, double-check that any suggested changes maintain consistent formatting and style.",
  },
  {
    id: 9,
    title: "Storytelling",
    description:
      "A great resume tells a story of your career progression and achievements. Enhancements should contribute to this narrative.",
  },
  {
    id: 10,
    title: "Proofread (Again!)",
    description:
      "After incorporating AI suggestions, always proofread the entire resume thoroughly for any errors or awkward phrasing.",
  },
];

const EnhanceResumeDialog = ({ open, onClose, resumeData }) => {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState("");
  const [enhanceError, setEnhanceError] = useState("");

  useEffect(() => {
    let tipInterval;
    if (isEnhancing && open) {
      setCurrentTipIndex(0);
      setShowTip(true);
      tipInterval = setInterval(() => {
        setShowTip(false);
        setTimeout(() => {
          setCurrentTipIndex(
            (prevIndex) => (prevIndex + 1) % resumeLoadingTips.length
          );
          setShowTip(true);
        }, 500);
      }, 4000);
    } else {
      clearInterval(tipInterval);
    }
    return () => clearInterval(tipInterval);
  }, [isEnhancing, open]);

  useEffect(() => {
    if (open && resumeData && Object.keys(resumeData).length > 0) {
      handleEnhanceResume();
    }
  }, [open, resumeData]);

  const handleEnhanceResume = async () => {
    if (!resumeData) {
      setEnhanceError("No resume data available to enhance.");
      return;
    }
    setIsEnhancing(true);
    setEnhancedContent("");
    setEnhanceError("");

    const sectionsToInclude = [
      "personalInfo.summary",
      "experience",
      "skills",
      "projects",
      "education",
    ];

    let prompt =
      "Please analyze the following resume data and provide specific, actionable suggestions to enhance its content for clarity, impact, and ATS-friendliness. For each relevant section (Summary, Experience, Skills, Projects, Education), offer 2-3 concrete suggestions. Focus on:\n";
    prompt += "- Strengthening action verbs.\n";
    prompt +=
      "- Quantifying achievements where possible (suggest placeholders if exact numbers are missing).\n";
    prompt += "- Improving conciseness and removing jargon.\n";
    prompt +=
      "- Optimizing for keywords relevant to common job roles (e.g., software engineer, project manager, marketing specialist - infer from content if possible, otherwise provide general advice).\n";
    prompt += "- Enhancing the overall narrative and professional appeal.\n\n";
    prompt +=
      "Format your suggestions clearly, grouped by resume section. For experience and project entries, refer to them by title or company if possible.\n\n";
    prompt += "Here is the resume data:\n";

    sectionsToInclude.forEach((sectionKeyPath) => {
      const keys = sectionKeyPath.split(".");
      let currentData = resumeData;
      for (const key of keys) {
        if (
          currentData &&
          typeof currentData === "object" &&
          key in currentData
        ) {
          currentData = currentData[key];
        } else {
          currentData = null;
          break;
        }
      }

      if (
        currentData &&
        (typeof currentData !== "object" ||
          Object.keys(currentData).length > 0 ||
          (Array.isArray(currentData) && currentData.length > 0))
      ) {
        prompt += `\n--- ${keys.join(" ")} ---\n`;
        prompt += `${JSON.stringify(currentData, null, 2)}\n`;
      }
    });

    prompt += "\nProvide enhancement suggestions below:\n";

    try {
      // Use secure Firebase Function instead of direct API call
      const messages = [{ role: "user", content: prompt }];

      const message = await callOpenAI(messages, {
        model: "gpt-4",
        temperature: 0.7,
        maxTokens: 1500,
      });

      if (message) {
        setEnhancedContent(message.trim());
      } else {
        setEnhanceError(
          "No enhancement suggestions received. Please try again."
        );
      }
    } catch (err) {
      console.error("Error enhancing resume:", err);
      setEnhanceError(
        `Failed to get enhancement suggestions: ${err.message}. Please try again later.`
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleExportPdf = () => {
    if (!enhancedContent) {
      alert("No content to export!");
      return;
    }

    // Create a simple print dialog for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume Enhancement Suggestions</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              line-height: 1.6; 
              color: #333;
            }
            h1 {
              color: #2c3e50;
              border-bottom: 2px solid #3498db;
              padding-bottom: 10px;
            }
            @media print { 
              body { margin: 20px; }
              h1 { color: #000; border-bottom: 1px solid #000; }
            }
          </style>
        </head>
        <body>
          <h1>Resume Enhancement Suggestions</h1>
          <pre style="white-space: pre-wrap; font-family: inherit;">${enhancedContent}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleCopyContent = () => {
    if (enhancedContent) {
      navigator.clipboard.writeText(enhancedContent).then(
        () => {
          setSnackbarMessage("Suggestions copied to clipboard!");
          setSnackbarOpen(true);
        },
        (err) => {
          console.error("Failed to copy suggestions: ", err);
          setSnackbarMessage("Failed to copy suggestions.");
          setSnackbarOpen(true);
        }
      );
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const currentTip = resumeLoadingTips[currentTipIndex];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          fontWeight: 600,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <AutoFixHighIcon sx={{ mr: 1, color: "primary.main" }} />
        Resume Enhancement Suggestions
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          minHeight: 300,
          maxHeight: "70vh",
          overflowY: "auto",
          p: 3,
        }}
      >
        {isEnhancing && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: 250,
              textAlign: "center",
            }}
          >
            <CircularProgress
              sx={{ mb: 3, color: "primary.main" }}
              size={50}
              thickness={4}
            />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 3, fontWeight: 500 }}
            >
              Enhancing your resume with AI...
            </Typography>
            <Fade in={showTip} timeout={500}>
              <Box sx={{ minHeight: 120, width: "100%", maxWidth: 450 }}>
                {currentTip && (
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor:
                        theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LightbulbIcon sx={{ color: "warning.main", mr: 1 }} />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                      >
                        Tip: {currentTip.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "left" }}
                    >
                      {currentTip.description}
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Fade>
          </Box>
        )}
        {enhanceError && !isEnhancing && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {enhanceError}
          </Alert>
        )}
        {enhancedContent && !isEnhancing && !enhanceError && (
          <Typography
            variant="body1"
            component="pre"
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "text.primary",
              borderRadius: 2,
            }}
          >
            {enhancedContent}
          </Typography>
        )}
        {!enhancedContent && !isEnhancing && !enhanceError && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            Click "Enhance Resume" to get AI-powered suggestions.
          </Typography>
        )}
      </DialogContent>
      <DialogActions
        sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}
      >
        <Button
          onClick={handleCopyContent}
          color="primary"
          startIcon={<ContentCopyIcon />}
          disabled={!enhancedContent || isEnhancing}
          variant="outlined"
        >
          Copy Suggestions
        </Button>
        <Button
          onClick={handleExportPdf}
          color="primary"
          startIcon={<DownloadIcon />}
          disabled={!enhancedContent || isEnhancing}
          variant="outlined"
        >
          Export PDF
        </Button>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Dialog>
  );
};

export default EnhanceResumeDialog;
