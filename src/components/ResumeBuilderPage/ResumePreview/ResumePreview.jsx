import { useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  useTheme,
  useMediaQuery,
  SpeedDial,
  SpeedDialAction,
  Snackbar,
  Alert,
  Container,
  Zoom,
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
} from "@mui/material";
import {
  Download,
  FormatColorFill,
  TextFormat,
  Print,
} from "@mui/icons-material";
import { ResumeTemplateContent } from "../DisplayResume/ResumeTemplateContent";
import { constants } from "./constants";
import { exportToDocx } from "../utils/exportUtils";
import { PDFGenerator } from "../utils/PDFGenerator";
import { ExportMenu } from "../ExportMenu/ExportMenu";
import { ColorMenu } from "../ColorMenu/ColorMenu";
import { FontMenu } from "../FontMenu/FontMenu";
import { ResumeToolbar } from "../ResumeToolBar/ResumeToolbar";
import { TemplateSelector } from "../TemplateSelector/TemplateSelector";
import EnhanceResumeDialog from "../EnhanceResume/EnhanceResumeDialog";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { TEMPLATES, FONTS, COLOR_SCHEMES } = constants;

const ResumePreview = ({ resumeData, onBack, sectionOrder = [], setSectionOrder }) => {
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
  const [fontSize, setFontSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [colorMenu, setColorMenu] = useState(null);
  const [fontMenu, setFontMenu] = useState(null);
  const [exportMenu, setExportMenu] = useState(null);
  const [starredSections, setStarredSections] = useState([]);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showEnhanceDialog, setShowEnhanceDialog] = useState(false);

  const { personalInfo = {} } = resumeData;
  const { currentUser } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch (e) {
      return dateString;
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const newTemplate = {
        0: TEMPLATES.MODERN,
        1: TEMPLATES.MINIMAL,
        2: TEMPLATES.CREATIVE,
        3: TEMPLATES.PROFESSIONAL,
        4: TEMPLATES.SIDEBAR,
        5: TEMPLATES.CANADA,
        6: TEMPLATES.EUROPASS,
        7: TEMPLATES.EUROPE,
        8: TEMPLATES.AUSTRALIA,
        9: TEMPLATES.USA,
        10: TEMPLATES.INDIA,
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
    navigate(`/preview-only/${currentUser.uid}/${resumeData.id}`);
  };

  const changeColorScheme = (scheme) => {
    setColorScheme(scheme);
    handleColorMenuClose();
  };

  const changeFontFamily = (font) => {
    setFontFamily(font);
    handleFontMenuClose();
  };

  const handleOpenEnhanceDialog = () => setShowEnhanceDialog(true);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const isSectionEmpty = (section) => {
    const data = resumeData[section];
    if (!data) return true;
    if (Array.isArray(data)) return data.length === 0;
    if (typeof data === 'object') return Object.keys(data).length === 0;
    return false;
  };
  
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);
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

   const downloadDocx = async () => {
    // This is the only function that needs to be changed in this file
    const success = await exportToDocx(resumeData, `${resumeData.personalInfo.fullName || 'Resume'}.docx`);
    setSnackbar({ open: true, message: success ? "DOCX downloaded!" : "Failed to download DOCX.", severity: success ? "success" : "error" });
    handleExportMenuClose();
  };

  const printResume = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

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
      sectionOrder,
      fontSize
    };
    
    return <ResumeTemplateContent {...commonProps} activeTemplate={activeTemplate} />;
  };

  const speedDialActions = [
    { icon: <Download />, name: "Download PDF", action: pdfGenerator.downloadPDF },
    { icon: <Print />, name: "Print", action: printResume },
    { icon: <FormatColorFill />, name: "Change Colors", action: handleColorMenuOpen },
    { icon: <TextFormat />, name: "Change Font", action: handleFontMenuOpen },
  ];

  return (
    <Stack spacing={0} sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <ResumeToolbar
        onBack={onBack}
        isMobile={isMobile}
        handleColorMenuOpen={handleColorMenuOpen}
        handleFontMenuOpen={handleFontMenuOpen}
        handleExportMenuOpen={handleExportMenuOpen}
        onEnhanceResume={handleOpenEnhanceDialog}
      />
      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex' }}>
        <Grid container spacing={3}>
            {!isMobile && (
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, position: 'sticky', top: '20px' }}>
                        <Typography variant="h6" gutterBottom>Customize</Typography>
                        <Divider sx={{ my: 2 }}/>
                        <Box sx={{ my: 2 }}>
                            <Typography gutterBottom>Font Size ({fontSize}pt)</Typography>
                            <Slider 
                              value={fontSize} 
                              onChange={(e, val) => setFontSize(val)} 
                              min={8} 
                              max={16} 
                              step={1} 
                              valueLabelDisplay="auto"
                              marks={[
                                { value: 8, label: '8' },
                                { value: 10, label: '10' },
                                { value: 12, label: '12' },
                                { value: 14, label: '14' },
                                { value: 16, label: '16' },
                              ]}
                            />
                        </Box>
                        <Divider sx={{ my: 2 }}/>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', mt: 2 }}>
                          💡 Tip: Adjust font size to fit more content or improve readability
                        </Typography>
                    </Paper>
                </Grid>
            )}
            <Grid item xs={12} md={isMobile ? 12 : 9}>
              <Paper elevation={3} sx={{ overflow: "hidden", display: 'flex', flexDirection: 'column', height: '100%' }}>
                <TemplateSelector activeTab={activeTab} handleTemplateChange={handleTabChange} isMobile={isMobile}/>
                <Box sx={{ p: 2, bgcolor: "grey.200", overflow: "auto", flexGrow: 1 }}>
                  <Box 
                    ref={resumeRef}
                    sx={{
                      '& p, & span, & div:not([class*="MuiBox"]):not([class*="MuiPaper"])': {
                        fontSize: `${fontSize}pt`,
                      },
                      '& h1': {
                        fontSize: `${fontSize * 2.5}pt`,
                      },
                      '& h2': {
                        fontSize: `${fontSize * 2}pt`,
                      },
                      '& h3, & h4': {
                        fontSize: `${fontSize * 1.5}pt`,
                      },
                      '& h5': {
                        fontSize: `${fontSize * 1.3}pt`,
                      },
                      '& h6': {
                        fontSize: `${fontSize * 1.1}pt`,
                      },
                    }}
                  >
                    {renderTemplate()}
                  </Box>
                </Box>
              </Paper>
            </Grid>
        </Grid>
      </Container>
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
      <FontMenu
        fontMenu={fontMenu}
        handleFontMenuClose={handleFontMenuClose}
        changeFontFamily={changeFontFamily}
        FONTS={FONTS}
        fontFamily={fontFamily}
      />
      <EnhanceResumeDialog open={showEnhanceDialog} onClose={() => setShowEnhanceDialog(false)} resumeData={resumeData} />
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default ResumePreview;