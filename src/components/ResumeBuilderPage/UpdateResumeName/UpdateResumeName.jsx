import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const UpdateResumeName = ({
  open,
  onClose,
  currentTitle,
  setCurrentTitle,
  resumeTitle,
  setResumeMetadata,
  setUnsavedChanges,
  setNotification,
  notification,
  handleCloseNotification,
  isMobile,
  showLeaveConfirmation,
  setShowLeaveConfirmation,
  handleConfirmedNavigation,
}) => {
  const lavenderPalette = {
    light: "#EAE4F7",
    soft: "#D8CCF0",
    medium: "#B9A5E3",
    primary: "#9D88D9",
    deep: "#7F68C9",
    text: "#4A3B77",
    darkText: "#2E2152",
    accentGradient: "linear-gradient(45deg, #A190DD 30%, #7F68C9 90%)",
  };


  const theme = createTheme({
    palette: {
      primary: {
        main: lavenderPalette.primary,
        light: lavenderPalette.light,
        dark: lavenderPalette.deep,
        contrastText: "#FFFFFF",
      },
      text: {
        primary: lavenderPalette.darkText,
        secondary: lavenderPalette.text,
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },

          containedPrimary: {
            backgroundColor: lavenderPalette.primary,
            color: "#fff",
            "&:hover": {
              backgroundColor: lavenderPalette.deep,
            },
          },

          textInherit: {
            color: lavenderPalette.text,
            "&:hover": {
              backgroundColor: lavenderPalette.soft,
              color: lavenderPalette.darkText,
            },
          },

          outlinedPrimary: {
            color: lavenderPalette.primary,
            borderColor: lavenderPalette.primary,
            "&:hover": {
              backgroundColor: lavenderPalette.light,
              borderColor: lavenderPalette.deep,
            },
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            color: lavenderPalette.darkText,
          },
        },
      },
      MuiDialogContentText: {
        styleOverrides: {
          root: {
            color: lavenderPalette.text,
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          filledInfo: {
            backgroundColor: lavenderPalette.medium,
            color: lavenderPalette.darkText,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: lavenderPalette.text,
            "&:hover": {
              backgroundColor: lavenderPalette.light,
            },
          },
        },
      },
    },
  });

  const handleSaveTitle = () => {
    const newTitle = currentTitle.trim();
    if (!newTitle || newTitle === resumeTitle) {
      onClose();
      return;
    }
    setResumeMetadata((prev) => ({ ...prev, title: newTitle }));
    setUnsavedChanges(true);
    onClose();
    setNotification({
      open: true,
      message: "Title updated. Save changes to finalize.",
      severity: "info",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      {" "}
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Rename Resume</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter a new name for this resume.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="resumeTitle"
            label="Resume Name"
            type="text"
            fullWidth
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSaveTitle()}
            InputProps={{
              endAdornment: currentTitle ? (
                <IconButton
                  size="small"
                  onClick={() => setCurrentTitle("")}
                  edge="end"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveTitle}
            variant="contained"
            disabled={!currentTitle.trim()}
          >
            Update Name
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: { xs: isMobile ? 70 : 24, md: 24 } }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={showLeaveConfirmation}
        onClose={() => setShowLeaveConfirmation(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to save your changes before leaving this page?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => handleConfirmedNavigation(false)}
            color="inherit"
          >
            Discard
          </Button>
          <Button
            onClick={() => handleConfirmedNavigation(true)}
            variant="contained"
            color="primary"
          >
            Save & Leave
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default UpdateResumeName;
