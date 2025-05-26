import { Box, Button, Typography, Tooltip } from "@mui/material";
import {
  ArrowBack,
  FormatColorFill,
  TextFormat,
  Download,
  KeyboardArrowDown,
  AutoFixHigh as EnhanceIcon,
} from "@mui/icons-material";

export const ResumeToolbar = ({
  onBack,
  isMobile,
  handleColorMenuOpen,
  handleFontMenuOpen,
  handleExportMenuOpen,
  onEnhanceResume,
  completionProgress,
}) => {
  const isResumeComplete = completionProgress === 100;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        mb: 3,
        gap: 2,
        p: { xs: 1, sm: 2 },
        borderBottom: { xs: "1px solid divider", md: "none" },
      }}
      className="no-print"
    >
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ mr: { xs: 1, sm: 2 } }}
          size={isMobile ? "small" : "medium"}
        >
          Edit Resume
        </Button>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h2"
          sx={{ display: { xs: "none", sm: "block" }, fontWeight: 600 }}
        >
          Resume Preview
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: { xs: "space-between", sm: "flex-end" },
          alignItems: "center",
        }}
      >
        {!isMobile && (
          <>
            <Button
              variant="outlined"
              startIcon={<FormatColorFill />}
              onClick={handleColorMenuOpen}
              size="small"
            >
              Color
            </Button>
            <Button
              variant="outlined"
              startIcon={<TextFormat />}
              onClick={handleFontMenuOpen}
              size="small"
            >
              Font
            </Button>
          </>
        )}
        {!isResumeComplete && (
          <Tooltip title="Get AI suggestions to improve your resume">
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<EnhanceIcon />}
              onClick={onEnhanceResume}
              size="small"
            >
              Enhance Resume
            </Button>
          </Tooltip>
        )}{" "}
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportMenuOpen}
          endIcon={<KeyboardArrowDown />}
          startIcon={<Download />}
          size={isMobile ? "small" : "medium"}
        >
          Export / Print
        </Button>
      </Box>
    </Box>
  );
};
