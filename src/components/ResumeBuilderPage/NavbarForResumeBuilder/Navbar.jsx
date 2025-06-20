import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Tooltip,
  CircularProgress,
  Button,
  Chip,
  Slide,
  useScrollTrigger,
  Grow,

} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const ProgressContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 6,
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.15),
  overflow: "hidden",
}));

const ProgressBar = styled(Box)(({ theme, value }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: `${value}%`,
  borderRadius: theme.shape.borderRadius,
  background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  transition: "width 0.4s ease-out",
}));

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = ({
  darkMode,
  toggleDarkMode,
  unsavedChanges,
  isSaving,
  completionProgress,
  isPreviewMode,
  handleManualSave,
  handleNavItemClick,
  previewStepId,
  handleDrawerToggle,
  onOpenResumeTips,
  currentStep,
}) => {
  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        sx={{
          // bgcolor: darkMode ? "grey.900" : "grey.100",
          color: darkMode ? "grey.100" : "grey.900",
          boxShadow: 1,
        }}
        className="no-print"
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, sm: 70 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "transparent"
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1.5, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "22px" }}>
            {currentStep == 1 && "Personal Info"}
            {currentStep == 2 && "Education"}
            {currentStep == 3 && "Experience"}
            {currentStep == 4 && "Skills"}
            {currentStep == 5 && "Projects"}
            {currentStep == 6 && "References"}
            {isPreviewMode && "Resume Preview"}
          </Typography> */}

            {unsavedChanges && !isSaving && (
              <Grow in={unsavedChanges}>
                <Chip
                  label="Unsaved Changes"
                  color="warning"
                  size="small"
                  variant="filled"
                  sx={{ mx: 1.5, display: { xs: "none", sm: "flex" } }}
                />
              </Grow>
            )}

            {isSaving && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 1.5,
                  color: "text.secondary",
                }}
              >
                <CircularProgress size={18} sx={{ mr: 1 }} color="inherit" />
                <Typography
                  variant="caption"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Saving...
                </Typography>
              </Box>
            )}


          </Box>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Progress Bar */}
            <Box
              sx={{
                width: { xs: 60, sm: 80 },
                mr: 1.5,
                display: { xs: "none", sm: "block" },
              }}
            >
              <Tooltip title={`${Math.round(completionProgress)}% Complete`}>
                <ProgressContainer>
                  <ProgressBar value={completionProgress}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#9D88D9', // background track color
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#9D88D9', // progress color
                      },
                    }}
                  />
                </ProgressContainer>
              </Tooltip>
            </Box>

            {/* Tips */}
            <Tooltip title="Resume Building Tips">
              <IconButton onClick={onOpenResumeTips} color="inherit" sx={{ mr: 0.5 }}>
                <Typography variant="body2" sx={{ mr: 0.5 }}>
                  Tips
                </Typography>
                <LightbulbIcon />
              </IconButton>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton onClick={toggleDarkMode} color="inherit" sx={{ mr: 0.5 }}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Preview Button */}
            {!isPreviewMode && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleNavItemClick(previewStepId)}
                startIcon={<VisibilityIcon />}
                sx={{ display: { xs: "none", md: "inline-flex" }, mr: 1 }}
              >
                Preview
              </Button>
            )}

            
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll >
  );
};

export default Navbar;
