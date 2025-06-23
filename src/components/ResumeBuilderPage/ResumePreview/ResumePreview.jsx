import { useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  useTheme,
  useMediaQuery,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Snackbar,
  Alert,
  Container,
  Zoom,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  Download,
  FormatColorFill,
  TextFormat,
  Print,
} from "@mui/icons-material";
import IndiaTemplate from '../Templates/IndiaTemplate';
import { TemplateSelector } from "../TemplateSelector/TemplateSelector";
import { ResumeToolbar } from "../ResumeToolBar/ResumeToolbar";
import { ExportMenu } from "../ExportMenu/ExportMenu";
import { ColorMenu } from "../ColorMenu/ColorMenu";
import { FontMenu } from "../FontMenu/FontMenu";
import { ModernTemplate } from "../Templates/ModernTemplate";
import { MinimalTemplate } from "../Templates/MinimalTemplate";
import { CreativeTemplate } from "../Templates/CreativeTemplate";
import { ProfessionalTemplate } from "../Templates/ProfessionalTemplate";
// import { SidebarTemplate } from "../Templates/SidebarTemplate";
import { CanadaTemplate } from "../Templates/CanadaTemplate";
import { EuropenUnionTemplate } from "../Templates/EuropenUnionTemplate";
import { EuropassTemplate } from "../Templates/NewTemplate";
import { AustraliaTemplate } from "../Templates/AustraliaTemplate";
import { UsaTemplate } from "../Templates/UsaTemplate";
import { PDFGenerator } from "../utils/PDFGenerator";
import { constants } from "./constants";
import { injectPrintStyles } from "../utils/pdfUtils";
import { useNavigate } from "react-router-dom";
import EnhanceResumeDialog from "../EnhanceResume/EnhanceResumeDialog";

const { TEMPLATES, FONTS, COLOR_SCHEMES } = constants;

const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
};

const ResumePreview = ({ resumeData, onBack }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isExtraSmallMobile = useMediaQuery("(max-width:400px)");
  const resumeRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES.MODERN);
  const [fontFamily, setFontFamily] = useState(FONTS.POPPINS);
  const [colorScheme, setColorScheme] = useState(COLOR_SCHEMES.BLUE);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [colorMenu, setColorMenu] = useState(null);
  const [fontMenu, setFontMenu] = useState(null);
  const [exportMenu, setExportMenu] = useState(null);
  const [starredSections, setStarredSections] = useState([]);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showEnhanceDialog, setShowEnhanceDialog] = useState(false);
  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
  } = resumeData;

  useEffect(() => {
    const cleanup = injectPrintStyles();
    return cleanup;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isPrinting) return;
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 360) setScale(0.5);
      else if (viewportWidth < 600) setScale(1.0);
      else if (viewportWidth < 900) setScale(0.8);
      else if (viewportWidth < 1200) setScale(0.9);
      else setScale(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPrinting]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const newTemplate =
      {
        0: TEMPLATES.MODERN,
        1: TEMPLATES.MINIMAL,
        2: TEMPLATES.CREATIVE,
        3: TEMPLATES.PROFESSIONAL,
        // 4: TEMPLATES.SIDEBAR,
        4: TEMPLATES.EUROPASS,
        5: TEMPLATES.CANADA,
        6: TEMPLATES.EUROPE,
        7: TEMPLATES.AUSTRALIA,
        8: TEMPLATES.USA,
        9: TEMPLATES.INDIA
      }[newValue] || TEMPLATES.MODERN;
    setActiveTemplate(newTemplate);
  };

  const handleDropdownChange = (event) => {
    const selectedTemplate = event.target.value;
    const tabIndex = Object.values(TEMPLATES).indexOf(selectedTemplate);
    setActiveTab(tabIndex >= 0 ? tabIndex : 0);
    setActiveTemplate(selectedTemplate);
  };

  const toggleStarSection = (section) => {
    setStarredSections(
      starredSections.includes(section)
        ? starredSections.filter((s) => s !== section)
        : [...starredSections, section]
    );
  };

  const handleColorMenuOpen = (event) => setColorMenu(event.currentTarget);
  const handleColorMenuClose = () => setColorMenu(null);
  const handleFontMenuOpen = (event) => setFontMenu(event.currentTarget);
  const handleFontMenuClose = () => setFontMenu(null);
  const handleExportMenuOpen = (event) => setExportMenu(event.currentTarget);
  const handleExportMenuClose = () => setExportMenu(null);

  const handleDisplayresume = () => {
    handleExportMenuClose();
    navigate("/preview-only", {
      state: {
        resumeData,
        activeTemplate,
        fontFamily,
        colorScheme,
      },
    });
  };

  const changeColorScheme = (scheme) => {
    setColorScheme(scheme);
    handleColorMenuClose();
  };

  const changeFontFamily = (font) => {
    setFontFamily(font);
    handleFontMenuClose();
  };

  const handleOpenEnhanceDialog = () => {
    setShowEnhanceDialog(true);
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const isSectionEmpty = (section) => {
    switch (section) {
      case "personalInfo":
        return !personalInfo || Object.keys(personalInfo).length === 0;
      case "education":
        return !education || education.length === 0;
      case "experience":
        return !experience || experience.length === 0;
      case "skills":
        return !skills || skills.length === 0;
      case "projects":
        return !projects || projects.length === 0;
      default:
        return true;
    }
  };

  const pdfGenerator = PDFGenerator({
    resumeRef,
    loading,
    setLoading,
    personalInfo,
    onSuccess: (message) => {
      setSnackbar({ open: true, message, severity: "success" });
      handleExportMenuClose();
    },
    onError: (message) => {
      setSnackbar({ open: true, message, severity: "error" });
    },
  });

  const downloadPDF = () => pdfGenerator.downloadPDF();

  const printResume = () => {
    setIsPrinting(true);

    setTimeout(() => {
      if (resumeRef.current) {
        resumeRef.current.scrollIntoView({ behavior: "auto", block: "start" });
        resumeRef.current.focus();
      }

      setTimeout(() => {
        window.print();
        setIsPrinting(false);
        handleExportMenuClose();
      }, 250);
    }, 200);
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
      isMobile,
      isSmallMobile,
    };
    const TemplateComponent =
      {
        [TEMPLATES.MODERN]: ModernTemplate,
        [TEMPLATES.MINIMAL]: MinimalTemplate,
        [TEMPLATES.CREATIVE]: CreativeTemplate,
        [TEMPLATES.PROFESSIONAL]: ProfessionalTemplate,
        // [TEMPLATES.SIDEBAR]: SidebarTemplate,
        [TEMPLATES.EUROPASS]: EuropassTemplate,
        [TEMPLATES.CANADA]: CanadaTemplate,
        [TEMPLATES.EUROPE]: EuropenUnionTemplate,
        [TEMPLATES.AUSTRALIA]: AustraliaTemplate,
        [TEMPLATES.USA]: UsaTemplate,
        [TEMPLATES.INDIA]: IndiaTemplate
      }[activeTemplate] || ModernTemplate;
    return <TemplateComponent {...commonProps} />;
  };

  const speedDialActions = [
    { icon: <Download />, name: "Download PDF", action: downloadPDF },
    { icon: <Print />, name: "Print", action: printResume },
    {
      icon: <FormatColorFill />,
      name: "Change Colors",
      action: handleColorMenuOpen,
    },
    { icon: <TextFormat />, name: "Change Font", action: handleFontMenuOpen },
  ];

  return (
    <Stack
      spacing={0}
      sx={{
        width: "100%",
        height: isPrinting ? "auto" : "100%",
        overflowX: isPrinting ? "visible" : "hidden",
        overflowY: isPrinting ? "visible" : "auto",
      }}
      className={isPrinting ? "print-mode" : ""}
    >
      <ResumeToolbar
        onBack={onBack}
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
        handleColorMenuOpen={handleColorMenuOpen}
        handleFontMenuOpen={handleFontMenuOpen}
        handleExportMenuOpen={handleExportMenuOpen}
        onEnhanceResume={handleOpenEnhanceDialog}
        sx={{
          display: isPrinting ? "none" : undefined,
          width: "100%",
          mb: { xs: 1, sm: 2 },
          flexShrink: 0,
          py: { xs: 1, sm: 1.5 },
          px: { xs: 1, sm: 2 },
        }}
        className="no-print"
      />

      <Container
        disableGutters={isExtraSmallMobile || isPrinting}
        maxWidth={isPrinting ? false : "lg"}
        sx={{
          px: isPrinting ? 0 : { xs: 1, sm: 2, md: 3 },
          pb: isPrinting ? 0 : { xs: 8, md: 4 },
          flexGrow: 1,
          display: "flex",
          width: isPrinting ? "100%" : "100%",
          background: isPrinting ? "#fff" : undefined,
          margin: isPrinting ? "0 !important" : undefined,
          padding: isPrinting ? "0 !important" : undefined,
        }}
      >
        <Paper
          elevation={isPrinting ? 0 : 2}
          sx={{
            width: "100%",
            borderRadius: isPrinting ? 0 : { xs: 1, sm: 2 },
            overflow: isPrinting ? "visible" : "hidden",
            display: "flex",
            flexDirection: "column",
            // height: "auto",
            height: isPrinting
              ? "auto"
              : {
                xs: "calc(100vh - 136px)",
                sm: "calc(100vh - 120px)",
                md: "calc(100vh - 120px)",
              },
            boxShadow: isPrinting ? "none !important" : undefined,
            background: isPrinting ? "transparent !important" : undefined,
            margin: isPrinting ? "0 !important" : undefined,
            padding: isPrinting ? "0 !important" : undefined,
          }}
        >

          {/* Template Selector For Mobile*/}
          {isMobile && !isPrinting && (
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: 1,
                borderColor: "divider",
                flexShrink: 0,
              }}
              className="no-print"
            >
              <FormControl fullWidth size="small"
                sx={{
                  "& .MuiInputLabel-root": { color: lavenderPalette.text },
                  "& .MuiOutlinedInput-root": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: lavenderPalette.soft,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: lavenderPalette.medium,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: lavenderPalette.primary,
                      borderWidth: '2px',
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: lavenderPalette.primary,
                  },
                }}
              >
                <InputLabel id="template-select-label">Template</InputLabel>
                <Select
                  labelId="template-select-label"
                  id="template-select"
                  value={activeTemplate}
                  onChange={handleDropdownChange}
                  label="Template"
                  className="no-print"
                >
                  <MenuItem value={TEMPLATES.INDIA}>INDIA</MenuItem>
                  <MenuItem value={TEMPLATES.MODERN}>Modern</MenuItem>
                  <MenuItem value={TEMPLATES.MINIMAL}>Minimal</MenuItem>
                  <MenuItem value={TEMPLATES.CREATIVE}>Creative</MenuItem>
                  <MenuItem value={TEMPLATES.PROFESSIONAL}>
                    Professional
                  </MenuItem>
                  <MenuItem value={TEMPLATES.EUROPASS}>Elegant</MenuItem>
                  <MenuItem value={TEMPLATES.CANADA}>Canada Template</MenuItem>
                  <MenuItem value={TEMPLATES.EUROPE}>
                    Europen Union Template
                  </MenuItem>
                  <MenuItem value={TEMPLATES.AUSTRALIA}>
                    Australia Template
                  </MenuItem>
                  <MenuItem value={TEMPLATES.USA}>USA Template</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}


          {!isMobile && !isPrinting && (
            <TemplateSelector
              activeTab={activeTab}
              handleTemplateChange={handleTabChange}
              isMobile={isMobile}
              sx={{ flexShrink: 0 }}
            />
          )}

          <Box
            sx={{
              flexGrow: 1,
              overflow: isPrinting ? "visible" : "auto",
              "&::-webkit-scrollbar": {
                width: isPrinting ? "0px" : "6px",
                height: isPrinting ? "0px" : "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: isPrinting
                  ? "transparent"
                  : lavenderPalette.light,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: isPrinting
                  ? "transparent"
                  : colorScheme.primary,
                borderRadius: "4px",
              },
              display: isPrinting ? "block" : "flex",
              justifyContent: isPrinting ? undefined : "center",
              alignItems: isPrinting ? undefined : "flex-start",
              width: isPrinting ? "auto" : "100%",
              height: isPrinting ? "auto" : undefined,
              // height: "100%",
            }}
          >
            <Box
              sx={{
                width: isPrinting ? "auto" : "100%",
                display: isPrinting ? "block" : "flex",
                justifyContent: isPrinting ? undefined : "center",
              }}
            >
              <Box
                ref={resumeRef}
                className="resume-content resume-container"
                tabIndex={-1}
                sx={{
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                  colorAdjust: "exact",
                  transform: isPrinting ? "none" : `scale(${scale})`,
                  // width: "794px",
                  // height: "1123px",
                  transformOrigin: isPrinting ? "top left" : "top center",
                  margin: isPrinting ? "0 auto" : "0 auto",
                  boxShadow: isPrinting ? "none" : undefined,
                  transition: isPrinting ? "none" : "transform 0.2s ease",
                  pageBreakInside: "auto",
                  pageBreakBefore: "auto",
                  pageBreakAfter: "auto",
                }}
                data-pdf-container="true"
              >
                {renderTemplate()}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Zoom in={isMobile && !isPrinting}>
        <SpeedDial
          ariaLabel="Resume actions"
          sx={{
            display: isPrinting ? "none" : undefined,
            position: "fixed",
            bottom: { xs: 70, sm: 16 },
            right: 16,
            zIndex: 1000,
          }}
          icon={<SpeedDialIcon />}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
          direction={isExtraSmallMobile ? "up" : "left"}
          FabProps={{
            sx: {
              bgcolor: lavenderPalette.primary,
              "&:hover": { bgcolor: lavenderPalette.deep },
            },
          }}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen={isExtraSmallMobile}
              onClick={action.action}
            />
          ))}
        </SpeedDial>
      </Zoom>

      {
        !isPrinting && (
          <>
            <ColorMenu
              colorMenu={colorMenu}
              handleColorMenuClose={handleColorMenuClose}
              changeColorScheme={changeColorScheme}
              COLOR_SCHEMES={COLOR_SCHEMES}
              isMobile={isMobile}
              className="no-print"
            />
            <FontMenu
              fontMenu={fontMenu}
              handleFontMenuClose={handleFontMenuClose}
              changeFontFamily={changeFontFamily}
              FONTS={FONTS}
              isMobile={isMobile}
              className="no-print"
            />
            <ExportMenu
              exportMenu={exportMenu}
              handleExportMenuClose={handleExportMenuClose}
              downloadPDF={downloadPDF}
              printResume={printResume}
              loading={loading}
              isMobile={isMobile}
              handleDisplayresume={handleDisplayresume}
              className="no-print"
            />
          </>
        )
      }

      <EnhanceResumeDialog
        open={showEnhanceDialog}
        onClose={() => setShowEnhanceDialog(false)}
        resumeData={resumeData}
      />

      <Snackbar
        open={snackbar.open && !isPrinting}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isSmallMobile ? "center" : "left",
        }}
        sx={{
          display: isPrinting ? "none" : undefined,
          bottom: { xs: 76, sm: 24 },
        }}
        className="no-print"
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%", boxShadow: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack >
  );
};

export default ResumePreview;