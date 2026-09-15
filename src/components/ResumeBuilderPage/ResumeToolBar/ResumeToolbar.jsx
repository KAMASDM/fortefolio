import { Box, Button, Typography, Tooltip } from "@mui/material";
import {
  ArrowBack,
  FormatColorFill,
  Download,
  KeyboardArrowDown,
  AutoFixHigh as EnhanceIcon,
} from "@mui/icons-material";
import { lavenderPalette } from "../lavenderPalette";


export const ResumeToolbar = ({
  onBack,
  isMobile,
  handleColorMenuOpen,
  handleExportMenuOpen,
  onEnhanceResume,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
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
          flexWrap: "wrap",
          justifyContent: { xs: "space-between", sm: "flex-end" },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FormatColorFill />}
          onClick={handleColorMenuOpen}
          size={isMobile ? "small" : "medium"}
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