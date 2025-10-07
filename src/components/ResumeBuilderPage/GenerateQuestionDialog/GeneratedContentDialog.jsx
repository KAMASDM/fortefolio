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

const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
};

const resumeLoadingTips = [
  {
    id: 1,
    title: "The 7-Second Scan",
    description:
      "Believe it or not, the average recruiter or hiring manager initially spends only about 7 seconds scanning your resume...",
  },
  {
    id: 2,
    title: "Keyword Is King (Thanks to Robots)",
    description:
      "Up to 90% of large companies use Applicant Tracking Systems (ATS)...",
  },
  {
    id: 3,
    title: "The 'Objective' is (Mostly) Obsolete",
    description:
      "Generic objective statements like 'Seeking a challenging role...' are outdated...",
  },
  {
    id: 4,
    title: "Quantify, Quantify, Quantify",
    description:
      "Instead of just listing duties, showcase your achievements with numbers...",
  },
  {
    id: 5,
    title: "The Power of Action Verbs",
    description:
      "Starting your bullet points with strong action verbs makes your accomplishments more dynamic...",
  },
  {
    id: 6,
    title: "Length Matters (But It's Debatable)",
    description:
      "While the 'one-page rule' is a common belief, many hiring managers prefer two-page resumes...",
  },
  {
    id: 7,
    title: "The Cost of a Typo",
    description:
      "A startling 77% of hiring managers will immediately reject a resume with typos...",
  },
  {
    id: 8,
    title: "'References Available Upon Request' is Redundant",
    description:
      "This phrase takes up valuable space and is largely assumed...",
  },
  {
    id: 9,
    title: "Unprofessional Email Addresses Get Trashed",
    description:
      "Stick to a professional-sounding email, usually a variation of your name...",
  },
  {
    id: 10,
    title: "Tailoring Trumps 'One-Size-Fits-All'",
    description:
      "Over 60% of recruiters prefer resumes personalized to the specific job...",
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
      setCurrentTipIndex(Math.floor(Math.random() * resumeLoadingTips.length));
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
    }
    return () => clearInterval(tipInterval);
  }, [loading, open]);

  const handleDownloadPDF = () => {
    // Create a simple print dialog for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <pre style="white-space: pre-wrap; font-family: inherit;">${content}</pre>
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
    navigator.clipboard.writeText(content || "");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const currentTip = resumeLoadingTips[currentTipIndex];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${lavenderPalette.soft}`,
          bgcolor: '#FBFAFF',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          fontWeight: 600,
          color: lavenderPalette.darkText,
          borderBottom: `1px solid ${lavenderPalette.soft}`,
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
            color: lavenderPalette.text,
            "&:hover": { color: lavenderPalette.deep },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ p: 3, borderColor: lavenderPalette.soft, overflow: "hidden" }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
              textAlign: "center",
            }}
          >
            <CircularProgress
              sx={{ mb: 3, color: lavenderPalette.primary }}
              size={50}
              thickness={4}
            />
            <Typography
              variant="h6"
              color={lavenderPalette.text}
              sx={{ mb: 3, fontWeight: 500 }}
            >
              Generating {title.toLowerCase()}...
            </Typography>
            <Fade in={showTip} timeout={500}>
              <Box sx={{ minHeight: 120, width: "100%", maxWidth: 450 }}>
                {currentTip && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: lavenderPalette.light,
                      border: `1px solid ${lavenderPalette.soft}`,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LightbulbIcon sx={{ color: "warning.main", mr: 1 }} />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: lavenderPalette.darkText }}
                      >
                        Tip: {currentTip.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color={lavenderPalette.text}
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
              color: lavenderPalette.darkText,
            }}
          >
            {content}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${lavenderPalette.soft}` }}>
        <Button
          onClick={handleCopyContent}
          startIcon={<ContentCopyIcon />}
          disabled={!content || loading}
          variant="outlined"
          sx={{
            color: lavenderPalette.primary,
            borderColor: lavenderPalette.primary,
            "&:hover": {
              backgroundColor: lavenderPalette.light,
              borderColor: lavenderPalette.deep,
            },
          }}
        >
          Copy
        </Button>
        <Button
          onClick={handleDownloadPDF}
          startIcon={<DownloadIcon />}
          disabled={!content || loading}
          variant="outlined"
          sx={{
            color: lavenderPalette.primary,
            borderColor: lavenderPalette.primary,
            "&:hover": {
              backgroundColor: lavenderPalette.light,
              borderColor: lavenderPalette.deep,
            },
          }}
        >
          Export PDF
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: lavenderPalette.primary,
            "&:hover": { bgcolor: lavenderPalette.deep },
          }}
        >
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
