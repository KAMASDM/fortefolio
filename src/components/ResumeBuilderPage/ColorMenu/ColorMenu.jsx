import { Menu, MenuItem, ListItemIcon, ListItemText, Box } from "@mui/material";

const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
};

export const ColorMenu = ({
  colorMenu,
  handleColorMenuClose,
  changeColorScheme,
  COLOR_SCHEMES,
}) => {
  return (
    <Menu
      anchorEl={colorMenu}
      open={Boolean(colorMenu)}
      onClose={handleColorMenuClose}
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
          "& .MuiListItemText-primary": {
            color: lavenderPalette.text,
            fontWeight: 500,
          },
          "&:hover": {
            backgroundColor: lavenderPalette.light,
            "& .MuiListItemText-primary": {
              color: lavenderPalette.deep,
            },
          },
        },
      }}
    >
      {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
        <MenuItem key={key} onClick={() => changeColorScheme(scheme)}>
          <ListItemIcon>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: scheme.primary,
                border: "2px solid rgba(0,0,0,0.1)",
              }}
            />
          </ListItemIcon>
          <ListItemText>{scheme.title}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};
