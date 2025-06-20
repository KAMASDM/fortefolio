import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { PictureAsPdf, Print } from "@mui/icons-material";
import ShareIcon from "@mui/icons-material/Share";
const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
};

export const ExportMenu = ({
  exportMenu,
  handleExportMenuClose,
  downloadPDF,
  printResume,
  loading,
  handleDisplayresume,
}) => {
  return (
    <Menu
      anchorEl={exportMenu}
      open={Boolean(exportMenu)}
      onClose={handleExportMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "12px",
          border: `1px solid ${lavenderPalette.soft}`,
          boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
          minWidth: "180px",
          p: 1,
        },
        "& .MuiMenuItem-root": {
          borderRadius: "8px",
          padding: "10px 12px",
          "& .MuiListItemIcon-root": {
            color: lavenderPalette.primary,
          },
          "& .MuiListItemText-primary": {
            color: lavenderPalette.text,
            fontWeight: 500,
          },
          "&:hover": {
            backgroundColor: lavenderPalette.light,
            "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
              color: lavenderPalette.deep,
            },
          },
        },
      }}
    >
      <MenuItem onClick={printResume}>
        <ListItemIcon>
          <Print />
        </ListItemIcon>
        <ListItemText>Print</ListItemText>
      </MenuItem>
      <MenuItem onClick={downloadPDF} disabled={loading}>
        <ListItemIcon>
          {loading ? (
            <CircularProgress size={24} sx={{ color: lavenderPalette.primary }} />
          ) : (
            <PictureAsPdf />
          )}
        </ListItemIcon>
        <ListItemText>Download PDF</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleDisplayresume}>
        <ListItemIcon>
          <ShareIcon />
        </ListItemIcon>
        <ListItemText>Display Resume</ListItemText>
      </MenuItem>
    </Menu>
  );
};
