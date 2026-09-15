import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ContentCopy, OpenInNew } from "@mui/icons-material";
import { publishResume, unpublishResume } from "../../services/resumeService";

export default function ShareResumeDialog({
  open,
  onClose,
  userId,
  resumeId,
  metadata,
  onSave,
}) {
  const [sharing, setSharing] = useState({
    email: true,
    phone: false,
    location: true,
    references: false,
  });
  const [published, setPublished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const url = `${window.location.origin}/preview-only/${userId}/${resumeId}`;
  useEffect(() => {
    if (open) {
      setSharing({
        email: true,
        phone: false,
        location: true,
        references: false,
        ...metadata?.sharing,
      });
      setPublished(Boolean(metadata?.shared));
      setMessage(null);
    }
  }, [open, metadata?.shared, metadata?.sharing]);
  const publish = async () => {
    setBusy(true);
    setMessage(null);
    try {
      if (!(await onSave()))
        throw new Error("Save your resume successfully before publishing.");
      await publishResume(userId, resumeId, sharing);
      setPublished(true);
      setMessage({
        severity: "success",
        text: "Your public copy is ready. Copy the link below to share it.",
      });
    } catch (e) {
      setMessage({
        severity: "error",
        text: e.message || "Could not publish. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };
  const disable = async () => {
    setBusy(true);
    try {
      await unpublishResume(userId, resumeId);
      setPublished(false);
      setMessage({
        severity: "success",
        text: "Public link disabled. Your private resume is saved.",
      });
    } catch {
      setMessage({
        severity: "error",
        text: "Could not disable the link. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="share-title"
    >
      <DialogTitle id="share-title">Share your resume</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Publish a copy that anyone with the link can view. Future edits stay
          private until you update the public copy.
        </Typography>
        <Typography fontWeight={600}>Include in your public copy</Typography>
        <Stack>
          {[
            ["email", "Email address"],
            ["phone", "Phone number"],
            ["location", "Location"],
            ["references", "References and their contact details"],
          ].map(([key, label]) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={sharing[key]}
                  disabled={busy}
                  onChange={(e) =>
                    setSharing((value) => ({
                      ...value,
                      [key]: e.target.checked,
                    }))
                  }
                />
              }
              label={label}
            />
          ))}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          These controls hide dedicated fields. Check your summary and
          descriptions for any contact details you also wrote there.
        </Typography>
        {message && (
          <Alert severity={message.severity} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}
        {published && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Public resume link"
              value={url}
              InputProps={{ readOnly: true }}
              onFocus={(e) => e.target.select()}
            />
            <Stack direction="row" gap={1} sx={{ mt: 1 }}>
              <Button
                startIcon={<ContentCopy />}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(url);
                    setMessage({ severity: "success", text: "Link copied" });
                  } catch {
                    setMessage({
                      severity: "info",
                      text: "Select and copy the link above.",
                    });
                  }
                }}
              >
                Copy link
              </Button>
              <Button
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNew />}
              >
                Open public copy
              </Button>
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, flexWrap: "wrap", gap: 1 }}>
        {published && (
          <Button color="error" onClick={disable} disabled={busy}>
            Disable link
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} disabled={busy}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={publish}
          disabled={busy}
          startIcon={
            busy ? <CircularProgress size={16} color="inherit" /> : undefined
          }
        >
          {published ? "Update public copy" : "Publish resume"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
