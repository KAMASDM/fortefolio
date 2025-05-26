import { Menu, MenuItem, Typography, ListItemIcon, Radio } from "@mui/material";

export const FontMenu = ({
  fontMenu,
  handleFontMenuClose,
  changeFontFamily,
  FONTS,
  fontFamily,
}) => {
  const handleFontSelection = (font) => {
    changeFontFamily(font);
    handleFontMenuClose();
  };

  return (
    <Menu
      anchorEl={fontMenu}
      open={Boolean(fontMenu)}
      onClose={handleFontMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      PaperProps={{
        sx: {
          maxWidth: 250,
          mt: 1,
          boxShadow: 3,
        },
      }}
      MenuListProps={{
        dense: true,
      }}
    >
      <MenuItem
        onClick={() => handleFontSelection(FONTS.POPPINS)}
        selected={fontFamily === FONTS.POPPINS}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {fontFamily === FONTS.POPPINS && <Radio checked size="small" />}
        </ListItemIcon>
        <Typography sx={{ fontFamily: FONTS.POPPINS }}>Poppins</Typography>
      </MenuItem>
    </Menu>
  );
};
