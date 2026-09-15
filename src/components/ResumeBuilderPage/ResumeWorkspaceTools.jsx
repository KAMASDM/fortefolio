import JobSearch from "../JobSearch/JobSearch";
import { useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AutoAwesome,
  CheckCircleOutline,
  ExpandMore,
  FileUploadOutlined,
  DownloadOutlined,
  Undo,
  Redo,
  Close,
  ArrowForward,
} from "@mui/icons-material";
import { saveAs } from "file-saver";
import {
  getResumeInsights,
  matchJobDescription,
  SECTION_LABELS,
} from "../../services/resumeInsights";
import {
  createResumeBackup,
  parseResumeBackup,
  sanitizeImportedResume,
} from "../../services/resumeTransfer";
import { runResumeTask } from "../../utils/openai";

export default function ResumeWorkspaceTools({
  resumeData,
  metadata,
  presentation,
  onImport,
  onUpdate,
  onSection,
  canUndo,
  canRedo,
  undo,
  redo,
  isSaving,
  isOnline,
  unsavedChanges,
  saveError,
}) {
  const insights = useMemo(() => getResumeInsights(resumeData), [resumeData]);
  const [dialog, setDialog] = useState(false);
  const [source, setSource] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [job, setJob] = useState("");
  const [summary, setSummary] = useState(null);
  const [summaryBusy, setSummaryBusy] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const summaryOriginal = useRef("");
  const match = useMemo(
    () => matchJobDescription(resumeData, job),
    [resumeData, job],
  );
  const readBackup = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      if (file.size > 1000000)
        throw new Error("Choose a backup smaller than 1 MB.");
      const result = parseResumeBackup(await file.text());
      setCandidate({
        data: result.resumeData,
        presentation: result.metadata.presentation,
        title: result.metadata.title,
      });
    } catch (e) {
      setError(e.message);
    }
    event.target.value = "";
  };
  const extract = async () => {
    setBusy(true);
    setError("");
    try {
      setCandidate({
        data: sanitizeImportedResume(await runResumeTask("import", source)),
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const writeSummary = async () => {
    setSummaryBusy(true);
    setSummaryError("");
    setSummary(null);
    summaryOriginal.current = resumeData.personalInfo?.summary || "";
    try {
      const result = await runResumeTask(
        "summary",
        JSON.stringify({ resume: resumeData, targetJob: job }),
      );
      if (typeof result.text !== "string" || !result.text.trim())
        throw new Error("No summary was returned. Please try again.");
      setSummary(result.text);
    } catch (e) {
      setSummaryError(e.message);
    } finally {
      setSummaryBusy(false);
    }
  };
  const closeImport = () => {
    if (!busy) {
      setDialog(false);
      setCandidate(null);
      setError("");
    }
  };
  return (
    <Box sx={{ mb: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
        sx={{
          py: 1,
          px: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Box role="status" aria-live="polite">
            <Chip
              size="small"
              variant="outlined"
              color={
                !isOnline || saveError
                  ? "warning"
                  : unsavedChanges || isSaving
                    ? "default"
                    : "success"
              }
              label={
                !isOnline
                  ? "Offline · edits kept in this tab"
                  : isSaving
                    ? "Saving…"
                    : saveError
                      ? "Save needs attention"
                      : unsavedChanges
                        ? "Saving soon…"
                        : "All changes saved"
              }
            />
          </Box>
          <Tooltip title="Undo last edit">
            <span>
              <IconButton
                aria-label="Undo last edit"
                onClick={undo}
                disabled={!canUndo}
                size="small"
              >
                <Undo />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo last edit">
            <span>
              <IconButton
                aria-label="Redo last edit"
                onClick={redo}
                disabled={!canRedo}
                size="small"
              >
                <Redo />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        <Stack direction="row" gap={1}>
          <Button
            size="small"
            startIcon={<FileUploadOutlined />}
            onClick={() => setDialog(true)}
          >
            Import resume
          </Button>
          <Tooltip title="Download an editable backup to restore later">
            <Button
              size="small"
              startIcon={<DownloadOutlined />}
              onClick={() =>
                saveAs(
                  new Blob(
                    [createResumeBackup(resumeData, metadata, presentation)],
                    { type: "application/json" },
                  ),
                  "resume-backup.json",
                )
              }
            >
              Backup
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
      {saveError && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          {saveError}
        </Alert>
      )}
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          mt: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px !important",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            sx={{ width: "100%", pr: 2 }}
          >
            <AutoAwesome color="primary" />
            <Typography fontWeight={600}>Resume coach</Typography>
            <Box sx={{ flex: 1 }} />
            <Chip
              size="small"
              label={`${insights.checks.filter((c) => c.done).length}/${insights.checks.length} essentials`}
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Your next best step
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                A writing checklist, not an ATS score. References and projects
                are optional.
              </Typography>
              <LinearProgress
                variant="determinate"
                value={insights.score}
                sx={{ mb: 2, height: 6, borderRadius: 3 }}
              />
              {insights.checks.map((check) => (
                <Button
                  key={check.label}
                  fullWidth
                  color={check.done ? "success" : "inherit"}
                  startIcon={
                    check.done ? <CheckCircleOutline /> : <ArrowForward />
                  }
                  onClick={() => onSection(check.section)}
                  sx={{
                    justifyContent: "flex-start",
                    textAlign: "left",
                    mb: 0.5,
                  }}
                >
                  {check.label}
                </Button>
              ))}
              {insights.suggestions.map((item) => (
                <Alert
                  key={item.label}
                  severity="info"
                  sx={{ mt: 1 }}
                  action={
                    <Button onClick={() => onSection(item.section)}>
                      Edit
                    </Button>
                  }
                >
                  {item.label}
                </Alert>
              ))}
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Tailor to an opportunity
              </Typography>
              <TextField
                label="Target job description"
                multiline
                minRows={4}
                maxRows={8}
                fullWidth
                value={job}
                onChange={(e) => {
                  setJob(e.target.value);
                  setSummary(null);
                }}
                inputProps={{ maxLength: 15000 }}
                helperText="Keyword comparison stays in your browser. A summary request sends your resume and this description to the writing assistant."
              />
              {job.trim() && (
                <Box sx={{ my: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {match.matched.length} of {match.total} extracted terms
                    appear in your resume
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {match.matched.map((word) => (
                      <Chip
                        key={word}
                        size="small"
                        color="success"
                        variant="outlined"
                        label={word}
                      />
                    ))}
                    {match.missing.map((word) => (
                      <Chip
                        key={word}
                        size="small"
                        variant="outlined"
                        label={word}
                      />
                    ))}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Green terms are present. Consider other terms only when they
                    reflect your experience; this is a simple text comparison,
                    not a hiring prediction.
                  </Typography>
                </Box>
              )}
              <Button
                sx={{ mt: 2 }}
                variant="outlined"
                startIcon={
                  summaryBusy ? <CircularProgress size={16} /> : <AutoAwesome />
                }
                disabled={
                  summaryBusy || !isOnline || !resumeData.personalInfo?.fullName
                }
                onClick={writeSummary}
              >
                Draft a professional summary
              </Button>
              {summaryError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {summaryError}
                </Alert>
              )}
              {summary !== null && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Review and edit your suggested summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    multiline
                    minRows={4}
                    fullWidth
                  />
                  <Typography variant="caption" color="text.secondary">
                    Review every claim before applying. Your current summary is
                    preserved until you apply.
                  </Typography>
                  <Stack direction="row" gap={1} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      disabled={!summary.trim()}
                      onClick={() => {
                        if (
                          (resumeData.personalInfo.summary || "") !==
                          summaryOriginal.current
                        ) {
                          setSummaryError(
                            "Your summary changed while this suggestion was open. Copy any text you want to keep, then generate a new suggestion.",
                          );
                          return;
                        }
                        onUpdate("personalInfo", {
                          ...resumeData.personalInfo,
                          summary,
                        });
                        setSummary(null);
                      }}
                    >
                      Apply summary
                    </Button>
                    <Button onClick={() => setSummary(null)}>Discard</Button>
                  </Stack>
                </Box>
              )}
              <JobSearch resumeData={resumeData} />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Dialog
        open={dialog}
        onClose={closeImport}
        fullWidth
        maxWidth="md"
        aria-labelledby="import-title"
      >
        <DialogTitle id="import-title">
          Start with what you already have
          <IconButton
            aria-label="Close import"
            disabled={busy}
            onClick={closeImport}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Paste text from an existing resume, or restore a ForteFolio backup.
            Review the result before replacing this resume.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {!candidate ? (
            <>
              <Button
                component="label"
                startIcon={<FileUploadOutlined />}
                disabled={busy}
              >
                Choose JSON backup
                <input
                  hidden
                  type="file"
                  accept=".json,application/json"
                  onChange={readBackup}
                />
              </Button>
              <Divider sx={{ my: 2 }}>or paste resume text</Divider>
              <TextField
                label="Your existing resume"
                multiline
                minRows={9}
                maxRows={16}
                fullWidth
                value={source}
                onChange={(e) => setSource(e.target.value)}
                inputProps={{ maxLength: 30000 }}
                helperText={`${source.length.toLocaleString()} / 30,000 characters · Parsing sends this text to the writing assistant.`}
                disabled={busy}
              />
            </>
          ) : (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Applying replaces the six resume sections. You can undo this
                change.
              </Alert>
              <Typography variant="h6">
                {candidate.data.personalInfo.fullName || "Name not found"}
              </Typography>
              <Typography color="text.secondary">
                {candidate.data.personalInfo.jobTitle}
              </Typography>
              <Typography sx={{ my: 2, whiteSpace: "pre-wrap" }}>
                {candidate.data.personalInfo.summary || "No summary found"}
              </Typography>
              {Object.entries(SECTION_LABELS).map(([key, label]) => (
                <Accordion key={key} disableGutters elevation={0}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    {label} · {candidate.data[key].length} entries
                  </AccordionSummary>
                  <AccordionDetails>
                    {candidate.data[key].length ? (
                      candidate.data[key].map((row, i) => (
                        <Box key={i} sx={{ mb: 2 }}>
                          {Object.entries(row)
                            .filter(
                              ([k, v]) =>
                                k !== "id" &&
                                v &&
                                (Array.isArray(v) ? v.length : true),
                            )
                            .map(([k, v]) => (
                              <Typography key={k} variant="body2">
                                <strong>{k}: </strong>
                                {Array.isArray(v) ? v.join(" · ") : String(v)}
                              </Typography>
                            ))}
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2">No entries found</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
              <Typography variant="body2" sx={{ mt: 2 }}>
                Contact:{" "}
                {[
                  candidate.data.personalInfo.email,
                  candidate.data.personalInfo.phone,
                  candidate.data.personalInfo.location,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Not found"}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeImport} disabled={busy}>
            Cancel
          </Button>
          {candidate ? (
            <>
              <Button onClick={() => setCandidate(null)}>Start over</Button>
              <Button
                variant="contained"
                onClick={() => {
                  onImport(
                    candidate.data,
                    candidate.presentation,
                    candidate.title,
                  );
                  closeImport();
                }}
              >
                Use this resume
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              disabled={busy || source.trim().length < 40 || !isOnline}
              onClick={extract}
              startIcon={
                busy ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <AutoAwesome />
                )
              }
            >
              {busy ? "Organizing your resume…" : "Organize with AI"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
