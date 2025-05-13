import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { PictureAsPdf, Print } from "@mui/icons-material";
import ShareIcon from "@mui/icons-material/Share";

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
    >
      <MenuItem onClick={printResume}>
        <ListItemIcon>
          <Print />
        </ListItemIcon>
        <ListItemText>Print</ListItemText>
      </MenuItem>
      {/* <MenuItem>
        <ListItemIcon>
          <ShareIcon />
        </ListItemIcon>
        <ListItemText>Share</ListItemText>
      </MenuItem> */}
      <MenuItem onClick={downloadPDF} disabled={loading}>
        <ListItemIcon>
          {loading ? <CircularProgress size={20} /> : <PictureAsPdf />}
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
