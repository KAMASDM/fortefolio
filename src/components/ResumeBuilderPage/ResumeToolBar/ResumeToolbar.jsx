import { Box, Button, Typography } from "@mui/material";
import {
  ArrowBack,
  FormatColorFill,
  TextFormat,
  Download,
  KeyboardArrowDown,
} from "@mui/icons-material";

export const ResumeToolbar = ({
  onBack,
  isMobile,
  handleColorMenuOpen,
  handleFontMenuOpen,
  handleExportMenuOpen,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        mb: 3,
        gap: 2,
      }}
      className="no-print"
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Edit Resume
        </Button>
        <Typography
          variant="h5"
          component="h2"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          Resume Preview
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: { xs: "flex-end", sm: "flex-end" },
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
              Color Scheme
            </Button>
            <Button
              variant="outlined"
              startIcon={<TextFormat />}
              onClick={handleFontMenuOpen}
              size="small"
            >
              Font
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExportMenuOpen}
              endIcon={<KeyboardArrowDown />}
              startIcon={<Download />}
            >
              Export / Print
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
