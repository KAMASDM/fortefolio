// components/ExportMenu.js
import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress } from "@mui/material";
import { PictureAsPdf, Print } from "@mui/icons-material";

export const ExportMenu = ({ 
  exportMenu, 
  handleExportMenuClose, 
  downloadPDF, 
  printResume, 
  loading 
}) => {
  return (
    <Menu
      anchorEl={exportMenu}
      open={Boolean(exportMenu)}
      onClose={handleExportMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={downloadPDF} disabled={loading}>
        <ListItemIcon>
          {loading ? <CircularProgress size={20} /> : <PictureAsPdf />}
        </ListItemIcon>
        <ListItemText>Download PDF</ListItemText>
      </MenuItem>
      <MenuItem onClick={printResume}>
        <ListItemIcon>
          <Print />
        </ListItemIcon>
        <ListItemText>Print</ListItemText>
      </MenuItem>
    </Menu>
  );
};