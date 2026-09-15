import { useEffect, useRef, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ContentCopy, Share, Print } from "@mui/icons-material";
import { ResumeTemplateContent } from "./ResumeTemplateContent";
import PreviewWrapper from "../Templates/PreviewWrapper";
import { constants } from "../ResumePreview/constants";
import { formatDate, getInitials, isSectionEmpty } from "../utils/resumeUtils";
import { openTemplatePrintPreview } from "../utils/advancedPDFGenerator";
import { getPublishedResume } from "../../../services/resumeService";
import {
  normalizePresentation,
  normalizeResumeData,
} from "../../../services/resumeModel";

export default function ResumeOnlyView() {
  const { userId, resumeId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  const resumeRef = useRef(null);
  const url = `${window.location.origin}/preview-only/${userId}/${resumeId}`;
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setRecord(null);
    getPublishedResume(userId, resumeId)
      .then((result) => {
        if (!active) return;
        if (result)
          setRecord({
            ...result,
            resumeData: normalizeResumeData(result.resumeData),
            presentation: normalizePresentation({
              presentation: result.presentation,
            }),
          });
        else
          setError(
            "This resume isn't public. The owner may have disabled or replaced the link.",
          );
      })
      .catch(() => {
        if (active)
          setError(
            "We couldn't load this resume. Check your connection and try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId, resumeId]);
  useEffect(() => {
    const previous = document.title;
    if (record)
      document.title = `${record.resumeData.personalInfo.fullName || record.title} · Resume`;
    return () => {
      document.title = previous;
    };
  }, [record]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Link copied");
    } catch {
      setManualCopy(true);
      setNotice("Select and copy the link below.");
    }
  };
  if (loading)
    return (
      <Stack alignItems="center" gap={2} sx={{ py: 10 }}>
        <CircularProgress />
        <Typography>Loading resume…</Typography>
      </Stack>
    );
  if (error)
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Alert severity="info">{error}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => window.location.reload()}>
          Try again
        </Button>
        <Button component={RouterLink} to="/">
          Create your own resume
        </Button>
      </Container>
    );
  if (!record) return null;
  const { resumeData, presentation } = record;
  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        sx={{ mb: 2 }}
        className="no-print"
      >
        <Box>
          <Typography variant="h6">
            {resumeData.personalInfo.fullName || record.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Published resume
          </Typography>
        </Box>
        <Stack direction="row" gap={0.5}>
          <Button startIcon={<ContentCopy />} onClick={copy}>
            Copy link
          </Button>
          <Button
            startIcon={<Share />}
            onClick={async () => {
              try {
                if (navigator.share)
                  await navigator.share({ title: record.title, url });
                else await copy();
              } catch (e) {
                if (e.name !== "AbortError")
                  setNotice("Sharing is unavailable. Use Copy link.");
              }
            }}
          >
            Share
          </Button>
          <Button
            startIcon={<Print />}
            onClick={async () => {
              try {
                await openTemplatePrintPreview(
                  resumeRef.current,
                  resumeData.personalInfo,
                );
              } catch (e) {
                setNotice(e.message);
              }
            }}
          >
            Print
          </Button>
        </Stack>
      </Stack>
      {notice && (
        <Alert onClose={() => setNotice("")} sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}
      {manualCopy && (
        <TextField
          fullWidth
          value={url}
          label="Public link"
          InputProps={{ readOnly: true }}
          onFocus={(e) => e.target.select()}
          sx={{ mb: 2 }}
        />
      )}
      <Paper variant="outlined" sx={{ overflow: "hidden", bgcolor: "white" }}>
        <PreviewWrapper>
          <div ref={resumeRef} id="print-resume-root" style={{ width: 794 }}>
            <ResumeTemplateContent
              resumeData={resumeData}
              activeTemplate={presentation.template}
              fontFamily={presentation.fontFamily}
              fontSize={presentation.fontSize}
              colorScheme={
                constants.COLOR_SCHEMES[
                  presentation.colorScheme.toUpperCase()
                ] || constants.COLOR_SCHEMES.BLUE
              }
              hiddenSections={presentation.hiddenSections}
              sectionOrder={presentation.sectionOrder}
              starredSections={presentation.starredSections}
              isSectionEmpty={(section) => isSectionEmpty(section, resumeData)}
              formatDate={formatDate}
              getInitials={getInitials}
              isMobile={false}
              isSmallMobile={false}
            />
          </div>
        </PreviewWrapper>
      </Paper>
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button component={RouterLink} to="/">
          Create your resume with ForteFolio
        </Button>
      </Box>
    </Container>
  );
}
