import React from "react";
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
}) => {
  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        sx={{
          width: { md: "calc(100% - 280px)" },
          ml: { md: "280px" },
          bgcolor: darkMode ? "grey.900" : "grey.100",
          color: darkMode ? "grey.100" : "grey.900",
        }}
        className="no-print"
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1.5, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
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
          <Box
            sx={{
              width: { xs: 60, sm: 80 },
              mr: 1.5,
              display: { xs: "none", sm: "block" },
            }}
          >
            <Tooltip title={`${Math.round(completionProgress)}% Complete`}>
              <ProgressContainer>
                <ProgressBar value={completionProgress} />
              </ProgressContainer>
            </Tooltip>
          </Box>
          <Tooltip
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <IconButton
              onClick={toggleDarkMode}
              color="inherit"
              sx={{ mr: 0.5 }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
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
          <Button
            variant={unsavedChanges ? "contained" : "outlined"}
            color={unsavedChanges ? "warning" : "primary"}
            onClick={handleManualSave}
            startIcon={
              isSaving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            disabled={isSaving || !unsavedChanges}
            sx={{
              display: { xs: "none", md: "inline-flex" },
              minWidth: 100,
              ...(unsavedChanges && {
                animation: "pulse 1.5s infinite ease-in-out",
              }),
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.05)" },
              },
            }}
          >
            {isSaving ? "Saving" : unsavedChanges ? "Save" : "Saved"}
          </Button>
          <Box sx={{ display: { xs: "flex", md: "none" }, ml: 1 }}>
            {unsavedChanges && !isSaving && (
              <Tooltip title="Save Changes">
                <IconButton
                  color="warning"
                  onClick={handleManualSave}
                  disabled={isSaving}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            )}
            {isSaving && (
              <IconButton disabled color="inherit">
                <CircularProgress size={24} color="inherit" />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
