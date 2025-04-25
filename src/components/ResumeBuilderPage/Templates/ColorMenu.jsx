import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Box } from "@mui/material";

export const ColorMenu = ({ 
  colorMenu, 
  handleColorMenuClose, 
  changeColorScheme, 
  COLOR_SCHEMES 
}) => {
  return (
    <Menu
      anchorEl={colorMenu}
      open={Boolean(colorMenu)}
      onClose={handleColorMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
        <MenuItem key={key} onClick={() => changeColorScheme(scheme)}>
          <ListItemIcon>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: scheme.primary,
              }}
            />
          </ListItemIcon>
          <ListItemText>{scheme.title}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};
