import { Box, Button, Typography, Tooltip } from "@mui/material";
import {
  ArrowBack,
  FormatColorFill,
  Download,
  KeyboardArrowDown,
  AutoFixHigh as EnhanceIcon,
  TextFormat,
} from "@mui/icons-material";


const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
  accentGradient: "linear-gradient(45deg, #A190DD 30%, #7F68C9 90%)",
};

export const ResumeToolbar = ({
  onBack,
  isMobile,
  handleColorMenuOpen,
  handleFontMenuOpen,
  handleExportMenuOpen,
  onEnhanceResume,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        p: { xs: 1.5, sm: 2 },
        borderColor: "divider",
        gap: 2,
      }}
      className="no-print"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          size={isMobile ? "small" : "medium"}
          sx={{
            color: lavenderPalette.primary,
            borderColor: lavenderPalette.primary,
            "&:hover": {
              backgroundColor: lavenderPalette.light,
              borderColor: lavenderPalette.deep,
            },
          }}
        >
          {isMobile ? "Back" : "Edit Resume"}
        </Button>
        {/* <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h1"
          sx={{
            fontWeight: 600,
            color: lavenderPalette.darkText,
            display: { xs: "none", md: "block" },
          }}
        >
          Resume Preview
        </Typography> */}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          alignItems: "center",
          flexWrap: "nowrap",
        }}
      >
        {!isMobile && (
          <>
            <Button
              variant="outlined"
              startIcon={<FormatColorFill />}
              onClick={handleColorMenuOpen}
              size="medium"
              sx={{
                color: lavenderPalette.text,
                borderColor: lavenderPalette.soft,
                "&:hover": {
                  backgroundColor: lavenderPalette.light,
                  borderColor: lavenderPalette.primary,
                  color: lavenderPalette.deep,
                },
              }}
            >
              Color
            </Button>
            {/* <Button
              variant="outlined"
              startIcon={<TextFormat />}
              onClick={handleFontMenuOpen}
              size="medium"
              sx={{
                color: lavenderPalette.text,
                borderColor: lavenderPalette.soft,
                "&:hover": {
                  backgroundColor: lavenderPalette.light,
                  borderColor: lavenderPalette.primary,
                  color: lavenderPalette.deep,
                },
              }}
            >
              Font
            </Button> */}
          </>
        )}
        <Tooltip title="Get AI suggestions to improve your resume">
          <Button
            variant="contained"
            startIcon={<EnhanceIcon />}
            onClick={onEnhanceResume}
            size={isMobile ? "small" : "medium"}
            sx={{
              color: "#fff",
              background: lavenderPalette.accentGradient,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                opacity: 0.9,
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              },
            }}
          >
            {isMobile ? "Enhance" : "Enhance with AI"}
          </Button>
        </Tooltip>
        <Button
          variant="contained"
          onClick={handleExportMenuOpen}
          endIcon={<KeyboardArrowDown />}
          startIcon={<Download />}
          size={isMobile ? "small" : "medium"}
          sx={{
            bgcolor: lavenderPalette.primary,
            "&:hover": {
              bgcolor: lavenderPalette.deep,
            },
          }}
        >
          {isMobile ? "Export" : "Export / Print"}
        </Button>
      </Box>
    </Box>
  );
};