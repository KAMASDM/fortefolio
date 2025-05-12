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
      <MenuItem
        onClick={() => handleFontSelection(FONTS.ROBOTO)}
        selected={fontFamily === FONTS.ROBOTO}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {fontFamily === FONTS.ROBOTO && <Radio checked size="small" />}
        </ListItemIcon>
        <Typography sx={{ fontFamily: FONTS.ROBOTO }}>Roboto</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => handleFontSelection(FONTS.OPEN_SANS)}
        selected={fontFamily === FONTS.OPEN_SANS}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {fontFamily === FONTS.OPEN_SANS && <Radio checked size="small" />}
        </ListItemIcon>
        <Typography sx={{ fontFamily: FONTS.OPEN_SANS }}>Open Sans</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => handleFontSelection(FONTS.MONTSERRAT)}
        selected={fontFamily === FONTS.MONTSERRAT}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {fontFamily === FONTS.MONTSERRAT && <Radio checked size="small" />}
        </ListItemIcon>
        <Typography sx={{ fontFamily: FONTS.MONTSERRAT }}>
          Montserrat
        </Typography>
      </MenuItem>
      <MenuItem
        onClick={() => handleFontSelection(FONTS.RALEWAY)}
        selected={fontFamily === FONTS.RALEWAY}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {fontFamily === FONTS.RALEWAY && <Radio checked size="small" />}
        </ListItemIcon>
        <Typography sx={{ fontFamily: FONTS.RALEWAY }}>Raleway</Typography>
      </MenuItem>
    </Menu>
  );
};
