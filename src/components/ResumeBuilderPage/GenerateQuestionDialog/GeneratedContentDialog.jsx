import React from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import jsPDF from "jspdf";

const GeneratedContentDialog = ({
  open,
  onClose,
  title,
  content,
  loading,
  error,
}) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

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

    const filename = `${title.toLowerCase().replace(/\s/g, "_")}.pdf`;
    doc.save(filename);
  };

  const handleCopyContent = () => {
    if (content) {
      navigator.clipboard.writeText(content).then(() => {
        setSnackbarOpen(true);
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 600 }}>
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
        sx={{ minHeight: 200, maxHeight: "70vh", overflowY: "auto" }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: 150,
              flexDirection: "column",
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Generating {title.toLowerCase()}...
            </Typography>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
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
              lineHeight: 1.6,
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
      <DialogActions>
        <Button
          onClick={handleCopyContent}
          color="primary"
          startIcon={<ContentCopyIcon />}
          disabled={!content || loading}
        >
          Copy
        </Button>
        <Button
          onClick={handleExportPdf}
          color="primary"
          startIcon={<DownloadIcon />}
          disabled={!content || loading}
        >
          Export to PDF
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="Content copied to clipboard!"
      />
    </Dialog>
  );
};

export default GeneratedContentDialog;
