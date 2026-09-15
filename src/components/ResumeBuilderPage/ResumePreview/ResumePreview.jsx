import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import ShareResumeDialog from "../ShareResumeDialog";
import { documentData } from "../../../services/resumeDocument";
import { SECTION_LABELS } from "../../../services/resumeInsights";
import { useRef, useState } from "react";
import {
  Box,
  Paper,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Grid,
  Divider,
  Slider,
  Tooltip,
  IconButton,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ResumeTemplateContent } from "../DisplayResume/ResumeTemplateContent";
import { constants } from "./constants";

import { PDFGenerator } from "../utils/PDFGenerator";
import { openTemplatePrintPreview } from "../utils/advancedPDFGenerator";
import { ExportMenu } from "../ExportMenu/ExportMenu";
import { ColorMenu } from "../ColorMenu/ColorMenu";
import { ResumeToolbar } from "../ResumeToolBar/ResumeToolbar";
import { TemplateSelector } from "../TemplateSelector/TemplateSelector";
import PreviewWrapper from "../Templates/PreviewWrapper";
import { useAuth } from "../../../context/AuthContext";

const { TEMPLATES, FONTS, COLOR_SCHEMES } = constants;

const ResumePreview = ({
  resumeData,
  onBack,
  sectionOrder = [],
  presentation,
  onPresentationChange,
  onBeforePublish,
  onUpdateResumeData,
  onEnhanceResume,
  metadata,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const resumeRef = useRef(null);

  const activeTemplate = presentation?.template || TEMPLATES.MODERN;
  const activeTab = Math.max(
    0,
    Object.values(TEMPLATES).indexOf(activeTemplate),
  );
  const fontFamily = presentation?.fontFamily || FONTS.POPPINS;
  const colorSchemeKey = String(
    presentation?.colorScheme || "blue",
  ).toUpperCase();
  const colorScheme = COLOR_SCHEMES[colorSchemeKey] || COLOR_SCHEMES.BLUE;
  const fontSize = presentation?.fontSize || 10;
  const [loading, setLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [colorMenu, setColorMenu] = useState(null);
  const [exportMenu, setExportMenu] = useState(null);
  const starredSections = presentation?.starredSections || [];
  const [, setIsPrinting] = useState(false);

  const { personalInfo = {} } = resumeData;
  const { currentUser } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleTabChange = (event, newValue) => {
    const newTemplate =
      {
        0: TEMPLATES.MODERN,
        1: TEMPLATES.MODERN_NEO,
        2: TEMPLATES.MODERN_SLATE,
        3: TEMPLATES.MODERN_AURORA,
        4: TEMPLATES.MODERN_METRO,
        5: TEMPLATES.MODERN_ZEN,
        6: TEMPLATES.MODERN_NOVA,
        7: TEMPLATES.MODERN_EDGE,
        8: TEMPLATES.MODERN_PRISM,
        9: TEMPLATES.MODERN_SUMMIT,
        10: TEMPLATES.MODERN_FLOW,
        11: TEMPLATES.MINIMAL,
        12: TEMPLATES.CREATIVE,
        13: TEMPLATES.PROFESSIONAL,
        14: TEMPLATES.EXECUTIVE,
        15: TEMPLATES.CLASSIC,
        16: TEMPLATES.TIMELINE,
        17: TEMPLATES.SIDEBAR,
        18: TEMPLATES.CANADA,
        19: TEMPLATES.EUROPASS,
        20: TEMPLATES.EUROPE,
        21: TEMPLATES.AUSTRALIA,
        22: TEMPLATES.USA,
        23: TEMPLATES.INDIA,
      }[newValue] || TEMPLATES.MODERN;
    onPresentationChange({ template: newTemplate });
  };

  const toggleStarSection = (section) => {
    onPresentationChange({
      starredSections: starredSections.includes(section)
        ? starredSections.filter((item) => item !== section)
        : [...starredSections, section],
    });
  };

  const handleColorMenuOpen = (event) => setColorMenu(event.currentTarget);
  const handleColorMenuClose = () => setColorMenu(null);
  const handleExportMenuOpen = (event) => setExportMenu(event.currentTarget);
  const handleExportMenuClose = () => setExportMenu(null);

  const handleDisplayresume = () => {
    handleExportMenuClose();
    setShareOpen(true);
  };

  const changeColorScheme = (scheme) => {
    const entry = Object.entries(COLOR_SCHEMES).find(
      ([, candidate]) => candidate === scheme,
    );
    onPresentationChange({
      colorScheme: (entry?.[0] || "BLUE").toLowerCase(),
    });
    handleColorMenuClose();
  };

  const onEditPersonalInfo = (field, value) => {
    onUpdateResumeData?.("personalInfo", {
      ...resumeData.personalInfo,
      [field]: value,
      ...(["website", "portfolio"].includes(field)
        ? { website: value, portfolio: value }
        : {}),
    });
  };

  const onEditListItem = (sectionKey, index, field, value) => {
    const list = resumeData[sectionKey] || [];
    const nextList = list.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onUpdateResumeData?.(sectionKey, nextList);
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const isSectionEmpty = (section) => {
    const data = resumeData[section];
    if (!data) return true;
    if (Array.isArray(data)) return data.length === 0;
    if (typeof data === "object") return Object.keys(data).length === 0;
    return false;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const pdfGenerator = PDFGenerator({
    resumeRef,
    loading,
    setLoading,
    personalInfo,
    resumeData: documentData(resumeData, presentation),
    colorScheme,
    presentation,
    onSuccess: (message) => {
      setSnackbar({ open: true, message, severity: "success" });
      handleExportMenuClose();
    },
    onError: (message) => {
      setSnackbar({ open: true, message, severity: "error" });
    },
  });

  const downloadDocx = async () => {
    setLoading(true);
    try {
      const { exportToDocx } = await import("../utils/exportUtils");
      const success = await exportToDocx(
        resumeData,
        `${resumeData.personalInfo.fullName || "Resume"}.docx`,
        presentation,
      );
      if (!success)
        throw new Error(
          "Could not create your Word document. Please try again.",
        );
      setSnackbar({
        open: true,
        message: "DOCX downloaded",
        severity: "success",
      });
      handleExportMenuClose();
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const printResume = async () => {
    if (!resumeRef.current) {
      setSnackbar({
        open: true,
        message: "Resume reference not found. Please try again.",
        severity: "error",
      });
      return;
    }

    setIsPrinting(true);
    try {
      const result = await openTemplatePrintPreview(
        resumeRef.current,
        personalInfo,
      );

      if (result.success) {
        setSnackbar({
          open: true,
          message: "Print dialog opened.",
          severity: "success",
        });
      }
      handleExportMenuClose();
    } catch (error) {
      console.error("Print generation failed:", error);
      setSnackbar({
        open: true,
        message: "Could not open print preview. Please try again.",
        severity: "error",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const renderTemplate = () => {
    const commonProps = {
      resumeData,
      formatDate,
      colorScheme,
      fontFamily,
      isSectionEmpty,
      toggleStarSection,
      starredSections,
      getInitials,
      isMobile: false,
      isSmallMobile: false,
      sectionOrder,
      hiddenSections: presentation.hiddenSections,
      fontSize,
      editMode: true,
      onEditPersonalInfo,
      onEditListItem,
    };

    return (
      <ResumeTemplateContent {...commonProps} activeTemplate={activeTemplate} />
    );
  };

  return (
    <Stack
      spacing={0}
      sx={{ width: "100%", height: "100%", overflow: "hidden" }}
    >
      <ResumeToolbar
        onBack={onBack}
        isMobile={isMobile}
        handleColorMenuOpen={handleColorMenuOpen}
        handleExportMenuOpen={handleExportMenuOpen}
        onEnhanceResume={onEnhanceResume}
      />
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: "flex" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Accordion
              defaultExpanded={!isMobile}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <AccordionSummary>
                <Typography fontWeight={600}>
                  Customize your resume ▾
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TemplateSelector
                  activeTab={activeTab}
                  handleTemplateChange={handleTabChange}
                  isMobile={isMobile}
                />
                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <InputLabel id="resume-font-label">Font</InputLabel>
                  <Select
                    labelId="resume-font-label"
                    label="Font"
                    value={fontFamily}
                    onChange={(e) =>
                      onPresentationChange({ fontFamily: e.target.value })
                    }
                  >
                    {Object.entries(FONTS).map(([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {key.replaceAll("_", " ")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography sx={{ mt: 2 }}>
                  Font size · {fontSize} pt
                </Typography>
                <Slider
                  aria-label="Resume font size"
                  value={fontSize}
                  min={8}
                  max={16}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={(_, value) =>
                    onPresentationChange({ fontSize: value })
                  }
                />
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2">Visible sections</Typography>
                {Object.entries(SECTION_LABELS).map(([key, label]) => (
                  <FormControlLabel
                    key={key}
                    sx={{ display: "flex" }}
                    label={label}
                    control={
                      <Checkbox
                        size="small"
                        checked={
                          !(presentation.hiddenSections || []).includes(key)
                        }
                        onChange={(e) =>
                          onPresentationChange({
                            hiddenSections: e.target.checked
                              ? (presentation.hiddenSections || []).filter(
                                  (item) => item !== key,
                                )
                              : [...(presentation.hiddenSections || []), key],
                          })
                        }
                      />
                    }
                  />
                ))}
                <Typography variant="caption" color="text.secondary">
                  Hidden sections stay saved. They are excluded from previews,
                  exports and new public copies.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2">Section order</Typography>
                <Typography variant="caption" color="text.secondary">
                  Applies to Minimal, Standard PDF and DOCX. Other layouts keep
                  their designed order.
                </Typography>
                {sectionOrder.map((key, index) => (
                  <Stack key={key} direction="row" alignItems="center">
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {SECTION_LABELS[key]}
                    </Typography>
                    {[-1, 1].map((direction) => (
                      <IconButton
                        key={direction}
                        size="small"
                        aria-label={`Move ${SECTION_LABELS[key]} ${direction < 0 ? "up" : "down"}`}
                        disabled={
                          index + direction < 0 ||
                          index + direction >= sectionOrder.length
                        }
                        onClick={() => {
                          const order = [...sectionOrder];
                          [order[index], order[index + direction]] = [
                            order[index + direction],
                            order[index],
                          ];
                          onPresentationChange({ sectionOrder: order });
                        }}
                      >
                        {direction < 0 ? (
                          <ArrowUpward fontSize="small" />
                        ) : (
                          <ArrowDownward fontSize="small" />
                        )}
                      </IconButton>
                    ))}
                  </Stack>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} md={9}>
            <Paper
              elevation={3}
              sx={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "grey.200",
                  overflow: "auto",
                  flexGrow: 1,
                }}
              >
                <Box
                  className="resume-preview-shell"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <PreviewWrapper>
                    <Box
                      ref={resumeRef}
                      id="print-resume-root"
                      className="resume-container"
                      sx={{
                        width: "794px",
                        minWidth: "794px",
                        margin: "0 auto",
                        backgroundColor: "#fff",
                      }}
                    >
                      {renderTemplate()}
                    </Box>
                  </PreviewWrapper>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <ShareResumeDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        userId={currentUser?.uid}
        resumeId={resumeData.id}
        metadata={metadata}
        onSave={onBeforePublish}
      />
      <ExportMenu
        exportMenu={exportMenu}
        handleExportMenuClose={handleExportMenuClose}
        downloadPDF={pdfGenerator.downloadPDF}
        downloadDocx={downloadDocx}
        printResume={printResume}
        loading={loading}
        handleDisplayresume={handleDisplayresume}
      />
      <ColorMenu
        colorMenu={colorMenu}
        handleColorMenuClose={handleColorMenuClose}
        changeColorScheme={changeColorScheme}
        COLOR_SCHEMES={COLOR_SCHEMES}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default ResumePreview;
