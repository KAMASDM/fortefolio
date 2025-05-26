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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import jsPDF from "jspdf";

const resumeLoadingTips = [
  {
    id: 1,
    title: "The 7-Second Scan",
    description:
      "Believe it or not, the average recruiter or hiring manager initially spends only about 7 seconds scanning your resume. This means your resume needs to make an immediate, powerful impression with clear, concise information.",
  },
  {
    id: 2,
    title: "Keyword Is King (Thanks to Robots)",
    description:
      "Up to 90% of large companies use Applicant Tracking Systems (ATS) to filter resumes. If your resume isn't optimized with keywords from the job description, a human might never even see it.",
  },
  {
    id: 3,
    title: "The 'Objective' is (Mostly) Obsolete",
    description:
      "Generic objective statements like 'Seeking a challenging role...' are outdated. Most recruiters prefer a concise professional summary that highlights your key skills and experience relevant to the specific job.",
  },
  {
    id: 4,
    title: "Quantify, Quantify, Quantify",
    description:
      "Instead of just listing duties, showcase your achievements with numbers. For example, instead of 'Managed social media,' try 'Increased social media engagement by 30% over 6 months.' Statistics show a large percentage of resumes (around 81%) fail to do this effectively.",
  },
  {
    id: 5,
    title: "The Power of Action Verbs",
    description:
      "Starting your bullet points with strong action verbs (e.g., 'Orchestrated,' 'Implemented,' 'Streamlined' instead of 'Responsible for') makes your accomplishments sound more dynamic and impactful.",
  },
  {
    id: 6,
    title: "Length Matters (But It's Debatable)",
    description:
      "While the 'one-page rule' is a common belief, especially for entry-level candidates, many hiring managers (around 70%) actually prefer or expect two-page resumes for more experienced professionals. The ideal length is generally considered to be between 475 and 600 words.",
  },
  {
    id: 7,
    title: "The Cost of a Typo",
    description:
      "A startling 77% of hiring managers will immediately reject a resume with typos or bad grammar. Proofreading isn't just a suggestion; it's crucial.",
  },
  {
    id: 8,
    title: "'References Available Upon Request' is Redundant",
    description:
      "This phrase takes up valuable space and is largely assumed. Employers will ask for references when they need them.",
  },
  {
    id: 9,
    title: "Unprofessional Email Addresses Get Trashed",
    description:
      "An email like 'partyanimal2000@email.com' can get your resume instantly dismissed by around 35% of employers. Stick to a professional-sounding email, usually a variation of your name.",
  },
  {
    id: 10,
    title: "Tailoring Trumps 'One-Size-Fits-All'",
    description:
      "Submitting the same generic resume for every job is a major mistake. Over 60% of recruiters prefer resumes personalized to the specific job position, significantly increasing your chances of landing an interview.",
  },
];

const GeneratedContentDialog = ({
  open,
  onClose,
  title,
  content,
  loading,
  error,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    let tipInterval;
    if (loading && open) {
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
      }, 5000);
    } else {
      clearInterval(tipInterval);
    }
    return () => clearInterval(tipInterval);
  }, [loading, open]);

  const handleExportPdf = () => {
    if (!content) {
      alert("No content to export!");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(title, margin, y);
    y += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(content, pageWidth - 2 * margin);

    lines.forEach((line) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 7;
    });

    const filename = `${title.toLowerCase().replace(/\s+/g, "_")}.pdf`;
    doc.save(filename);
  };

  const handleCopyContent = () => {
    if (content) {
      navigator.clipboard.writeText(content).then(
        () => {
          setSnackbarOpen(true);
        },
        (err) => {
          console.error("Failed to copy content: ", err);
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
          borderBottom: `1px solid ${(theme) => theme.palette.divider}`,
        }}
      >
        {title}
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
          minHeight: 250,
          maxHeight: "70vh",
          overflowY: "auto",
          p: 3,
        }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: 200,
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
              Generating {title.toLowerCase()}...
            </Typography>
            <Fade in={showTip} timeout={500}>
              <Box sx={{ minHeight: 120, width: "100%", maxWidth: 450 }}>
                {currentTip && (
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "action.hover",
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
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {content && !loading && !error && (
          <Typography
            variant="body1"
            component="pre"
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "text.primary",
            }}
          >
            {content}
          </Typography>
        )}
        {!content && !loading && !error && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            Click a "Generate" option from the sidebar to get AI-powered{" "}
            {title.toLowerCase()} based on your resume!
          </Typography>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          borderTop: `1px solid ${(theme) => theme.palette.divider}`,
        }}
      >
        <Button
          onClick={handleCopyContent}
          color="primary"
          startIcon={<ContentCopyIcon />}
          disabled={!content || loading}
          variant="outlined"
        >
          Copy
        </Button>
        <Button
          onClick={handleExportPdf}
          color="primary"
          startIcon={<DownloadIcon />}
          disabled={!content || loading}
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
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="Content copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Dialog>
  );
};

export default GeneratedContentDialog;
