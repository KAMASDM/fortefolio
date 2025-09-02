import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Divider,
} from "@mui/material";
import { PictureAsPdf, Print, Article as DocxIcon } from "@mui/icons-material";
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
  downloadDocx,
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
          minWidth: "200px",
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
      <MenuItem onClick={downloadDocx} disabled={loading}>
        <ListItemIcon>
          {loading ? (
            <CircularProgress size={24} sx={{ color: lavenderPalette.primary }} />
          ) : (
            <DocxIcon />
          )}
        </ListItemIcon>
        <ListItemText>Download DOCX</ListItemText>
      </MenuItem>
      <Divider sx={{ my: 1 }} />
      <MenuItem onClick={handleDisplayresume}>
        <ListItemIcon>
          <ShareIcon />
        </ListItemIcon>
        <ListItemText>Share Public Link</ListItemText>
      </MenuItem>
    </Menu>
  );
};