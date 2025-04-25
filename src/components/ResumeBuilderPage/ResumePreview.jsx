// ResumePreview.js
import React, { useRef, useState, useEffect } from "react";
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
  Stack
} from "@mui/material";
import { Download, FormatColorFill, TextFormat, Print } from "@mui/icons-material";

// Import smaller components
import { TemplateSelector } from "./Templates/TemplateSelector";
import { ResumeToolbar } from "./Templates/ResumeToolbar";
import { ExportMenu } from "./Templates/ExportMenu";
import { ColorMenu } from "./Templates/ColorMenu";
import { FontMenu } from "./Templates/FontMenu";
import { ModernTemplate } from "./Templates/ModernTemplate";
import { MinimalTemplate } from "./Templates/MinimalTemplate";
import { CreativeTemplate } from "./Templates/CreativeTemplate";
import { ProfessionalTemplate } from "./Templates/ProfessionalTemplate";
import { PDFGenerator } from "./Templates/PDFGenerator";
import { constants } from "./Templates/constants";
import { injectPrintStyles } from "./utils/pdfUtils";

// Extract the constant values
const { TEMPLATES, FONTS, COLOR_SCHEMES } = constants;

const ResumePreview = ({ resumeData, onBack }) => {
  const theme = useTheme();
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

  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
  } = resumeData;

  // Add print styles to the document when component mounts
  useEffect(() => {
    const cleanup = injectPrintStyles();
    return cleanup;
  }, []);

  // Handle responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      
      if (viewportWidth < 360) {
        setScale(0.5); // Extra small devices
      } else if (viewportWidth < 600) {
        setScale(1.0); // Small mobile
      } else if (viewportWidth < 900) {
        setScale(0.8); // Larger mobile/small tablet
      } else if (viewportWidth < 1200) {
        setScale(0.9); // Tablet/small desktop
      } else {
        setScale(1); // Desktop
      }
    };

    // Initial calculation
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Enhanced handleTemplateChange to work with both tabs and dropdown
  const handleTemplateChange = (event, newValue) => {
    // For dropdown menu on mobile, the value comes directly from event.target.value
    if (event && event.target && event.target.value !== undefined) {
      const selectedTemplate = event.target.value;
      // Find the corresponding tab index based on template value
      let tabIndex = 0;
      switch (selectedTemplate) {
        case TEMPLATES.MODERN:
          tabIndex = 0;
          break;
        case TEMPLATES.MINIMAL:
          tabIndex = 1;
          break;
        case TEMPLATES.CREATIVE:
          tabIndex = 2;
          break;
        case TEMPLATES.PROFESSIONAL:
          tabIndex = 3;
          break;
        default:
          tabIndex = 0;
      }
      setActiveTab(tabIndex);
      setActiveTemplate(selectedTemplate);
    } 
    // For tab-based selection on desktop
    else if (newValue !== undefined) {
      setActiveTab(newValue);
      switch (newValue) {
        case 0:
          setActiveTemplate(TEMPLATES.MODERN);
          break;
        case 1:
          setActiveTemplate(TEMPLATES.MINIMAL);
          break;
        case 2:
          setActiveTemplate(TEMPLATES.CREATIVE);
          break;
        case 3:
          setActiveTemplate(TEMPLATES.PROFESSIONAL);
          break;
        default:
          setActiveTemplate(TEMPLATES.MODERN);
      }
    }
  };

  const toggleStarSection = (section) => {
    if (starredSections.includes(section)) {
      setStarredSections(starredSections.filter((s) => s !== section));
    } else {
      setStarredSections([...starredSections, section]);
    }
  };

  const handleColorMenuOpen = (event) => {
    setColorMenu(event.currentTarget);
  };

  const handleColorMenuClose = () => {
    setColorMenu(null);
  };

  const handleFontMenuOpen = (event) => {
    setFontMenu(event.currentTarget);
  };

  const handleFontMenuClose = () => {
    setFontMenu(null);
  };

  const handleExportMenuOpen = (event) => {
    setExportMenu(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenu(null);
  };

  const changeColorScheme = (scheme) => {
    setColorScheme(scheme);
    handleColorMenuClose();
  };

  const changeFontFamily = (font) => {
    setFontFamily(font);
    handleFontMenuClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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

  // Setup PDF generator component with enhanced PDF generation
  const pdfGenerator = PDFGenerator({
    resumeRef,
    loading,
    setLoading,
    personalInfo,
    onSuccess: (message) => {
      setSnackbar({
        open: true,
        message: message,
        severity: "success",
      });
      handleExportMenuClose();
    },
    onError: (message) => {
      setSnackbar({
        open: true,
        message: message,
        severity: "error",
      });
    }
  });

  // Improved PDF download function that uses our enhanced PDF generator
  const downloadPDF = () => {
    pdfGenerator.downloadPDF();
  };

  const printResume = () => {
    window.print();
    handleExportMenuClose();
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
      isSmallMobile
    };

    switch (activeTemplate) {
      case TEMPLATES.MODERN:
        return <ModernTemplate {...commonProps} />;
      case TEMPLATES.MINIMAL:
        return <MinimalTemplate {...commonProps} />;
      case TEMPLATES.CREATIVE:
        return <CreativeTemplate {...commonProps} />;
      case TEMPLATES.PROFESSIONAL:
        return <ProfessionalTemplate {...commonProps} />;
      default:
        return <ModernTemplate {...commonProps} />;
    }
  };

  const speedDialActions = [
    { icon: <Download />, name: "Download PDF", action: downloadPDF },
    { icon: <Print />, name: "Print", action: printResume },
    { icon: <FormatColorFill />, name: "Change Colors", action: handleColorMenuOpen },
    { icon: <TextFormat />, name: "Change Font", action: handleFontMenuOpen },
  ];

  return (
    <Stack 
      spacing={0} 
      sx={{ 
        width: '100%', 
        height: '100%',
        overflowX: 'hidden',
        bgcolor: 'background.default'
      }}
    >
      <ResumeToolbar
        onBack={onBack}
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
        handleColorMenuOpen={handleColorMenuOpen}
        handleFontMenuOpen={handleFontMenuOpen}
        handleExportMenuOpen={handleExportMenuOpen}
        sx={{ 
          width: "100%", 
          mb: { xs: 1, sm: 2 }, 
          flexShrink: 0,
          py: { xs: 1, sm: 1.5 },
          px: { xs: 1, sm: 2 }
        }}
      />

      <Container 
        disableGutters={isExtraSmallMobile}
        maxWidth="lg"
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 8, md: 4 },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: '100%',
            borderRadius: { xs: 1, sm: 2 },
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 'calc(100vh - 136px)', sm: 'calc(100vh - 120px)', md: 'calc(100vh - 120px)' }
          }}
        >
          {/* Template Selection - Conditional Rendering */}
          {isMobile ? (
            <Box sx={{ 
              px: 2, 
              py: 1.5, 
              borderBottom: 1, 
              borderColor: 'divider',
              flexShrink: 0 
            }}>
              <FormControl fullWidth size="small">
                <InputLabel id="template-select-label">Template</InputLabel>
                <Select
                  labelId="template-select-label"
                  id="template-select"
                  value={activeTemplate}
                  onChange={handleTemplateChange}
                  label="Template"
                >
                  <MenuItem value={TEMPLATES.MODERN}>Modern</MenuItem>
                  <MenuItem value={TEMPLATES.MINIMAL}>Minimal</MenuItem>
                  <MenuItem value={TEMPLATES.CREATIVE}>Creative</MenuItem>
                  <MenuItem value={TEMPLATES.PROFESSIONAL}>Professional</MenuItem>
                </Select>
              </FormControl>
            </Box>
          ) : (
            <TemplateSelector
              activeTab={activeTab}
              handleTemplateChange={handleTemplateChange}
              isMobile={isMobile}
              sx={{ flexShrink: 0 }}
            />
          )}

          {/* Resume Content Scroll Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              "&::-webkit-scrollbar": {
                width: "6px",
                height: "6px"
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0,0,0,0.05)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: colorScheme.primary,
                borderRadius: "4px",
              },
              p: { xs: 1, sm: 2, md: 3 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box
                ref={resumeRef}
                className="resume-content resume-container"
                sx={{
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                  colorAdjust: 'exact',
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  width: scale < 1 ? `${100/scale}%` : '100%',
                  maxWidth: scale < 1 ? undefined : '830px',
                  transition: 'transform 0.2s ease',
                  height: 'auto',
                  margin: '0 auto'
                }}
                data-pdf-container="true"
              >
                {renderTemplate()}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Fixed Mobile Actions */}
      <Zoom in={isMobile}>
        <SpeedDial
          ariaLabel="Resume actions"
          sx={{
            position: "fixed",
            bottom: { xs: 70, sm: 16 }, // Give space for bottom navigation on mobile
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
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              }
            }
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

      {/* Supporting Menu Components */}
      <ColorMenu
        colorMenu={colorMenu}
        handleColorMenuClose={handleColorMenuClose}
        changeColorScheme={changeColorScheme}
        COLOR_SCHEMES={COLOR_SCHEMES}
        isMobile={isMobile}
      />

      <FontMenu
        fontMenu={fontMenu}
        handleFontMenuClose={handleFontMenuClose}
        changeFontFamily={changeFontFamily}
        FONTS={FONTS}
        isMobile={isMobile}
      />

      <ExportMenu
        exportMenu={exportMenu}
        handleExportMenuClose={handleExportMenuClose}
        downloadPDF={downloadPDF}
        printResume={printResume}
        loading={loading}
        isMobile={isMobile}
      />

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isSmallMobile ? 'center' : 'left'
        }}
        sx={{
          bottom: { xs: 76, sm: 24 } // Adjust for bottom navigation
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ 
            width: "100%",
            boxShadow: 2
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default ResumePreview;