import { useState } from "react";
import { useBlocker } from "react-router-dom";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
export default function ResumeNavigationGuard({
  shouldBlock,
  onSave,
  onDiscard,
}) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname && shouldBlock(),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  return (
    <Dialog
      open={blocker.state === "blocked"}
      onClose={saving ? undefined : () => blocker.reset?.()}
    >
      <DialogTitle>Keep your latest changes?</DialogTitle>
      <DialogContent>
        Your resume has changes that haven't reached the cloud yet.
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={() => blocker.reset()}>
          Keep editing
        </Button>
        <Button
          disabled={saving}
          color="error"
          onClick={() => {
            onDiscard();
            blocker.proceed();
          }}
        >
          Discard and leave
        </Button>
        <Button
          disabled={saving}
          variant="contained"
          onClick={async () => {
            setSaving(true);
            setError("");
            if (await onSave()) blocker.proceed();
            else
              setError("Couldn't save. Check your connection or keep editing.");
            setSaving(false);
          }}
        >
          {saving ? "Saving…" : "Save and leave"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
