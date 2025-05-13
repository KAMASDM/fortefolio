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
    <>
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
    </>
  );
};

export default UpdateResumeName;
