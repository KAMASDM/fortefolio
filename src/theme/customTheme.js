// src/theme/customTheme.js
import { createTheme, alpha } from "@mui/material/styles";
import theme from "../theme";

export const getCustomTheme = (prefersDarkMode) => {
  return createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      primary: {
        main: "#4361ee",
        light: "#738efc",
        dark: "#2d41a7",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#6c63ff",
        light: "#9d97ff",
        dark: "#4a44b3",
        contrastText: "#ffffff",
      },
      background: {
        default: prefersDarkMode ? "#121212" : "#f7f8fc",
        paper: prefersDarkMode ? "#1e1e1e" : "#ffffff",
      },
      success: {
        main: "#00b894",
        light: "#55efc4",
        dark: "#00838f",
        contrastText: "#ffffff",
      },
      warning: {
        main: "#fdcb6e",
        light: "#ffeaa7",
        dark: "#e0b057",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
      error: {
        main: "#e74c3c",
        light: "#ff7675",
        dark: "#c0392b",
        contrastText: "#ffffff",
      },
      info: {
        main: "#0984e3",
        light: "#74b9ff",
        dark: "#0864b1",
        contrastText: "#ffffff",
      },
      divider: prefersDarkMode
        ? alpha("#ffffff", 0.12)
        : alpha("#000000", 0.08),
      text: prefersDarkMode
        ? {
            primary: "#e0e0e0",
            secondary: "#b0bec5",
            disabled: "#757575",
          }
        : {
            primary: "#212121",
            secondary: "#757575",
            disabled: "#bdbdbd",
          },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: "2.5rem" },
      h2: { fontWeight: 700, fontSize: "2rem" },
      h3: { fontWeight: 600, fontSize: "1.75rem" },
      h4: { fontWeight: 600, fontSize: "1.5rem" },
      h5: { fontWeight: 600, fontSize: "1.25rem" },
      h6: { fontWeight: 600, fontSize: "1.1rem" },
      button: {
        fontWeight: 600,
        textTransform: "none",
        letterSpacing: "0.5px",
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: Array(25)
      .fill("none")
      .map((_, index) =>
        index === 0
          ? "none"
          : `0px ${index * 2}px ${index * 4}px rgba(0,0,0,${Math.min(
              0.04 + index * 0.005,
              0.1
            )})`
      ),
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            borderRadius: 8,
            padding: "8px 20px",
            boxShadow:
              ownerState.variant === "contained"
                ? "0px 4px 12px rgba(0,0,0,0.08)"
                : "none",
            transition: "all 0.25s ease-in-out",
            "&:hover": {
              boxShadow:
                ownerState.variant === "contained"
                  ? "0px 6px 16px rgba(0,0,0,0.12)"
                  : "none",
              transform: "translateY(-1px)",
            },
          }),
          containedPrimary: ({ theme }) => ({
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }),
          containedWarning: ({ theme }) => ({
            color: theme.palette.getContrastText(theme.palette.warning.main),
          }),
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 1,
        },
        styleOverrides: {
          root: ({ theme, elevation = 1 }) => ({
            borderRadius: theme.shape.borderRadius,
            backgroundImage: "none",
            boxShadow: theme.shadows[elevation] || theme.shadows[1],
          }),
        },
      },
      MuiFab: {
        styleOverrides: {
          root: ({ theme }) => ({
            boxShadow: theme.shadows[6],
            "&:hover": {
              boxShadow: theme.shadows[10],
              transform: "scale(1.03)",
            },
            transition: "all 0.25s ease-in-out",
          }),
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          size: "small",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              transition: "all 0.2s ease-in-out",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha("#000000", 0.23),
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundImage: "none",
            boxShadow: "none",
          }),
        },
      },
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.background.paper, 0.85),
            backdropFilter: "blur(8px)",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 8,
          },
          filledWarning: ({ theme }) => ({
            color: theme.palette.getContrastText(theme.palette.warning.main),
          }),
          outlinedWarning: ({ theme }) => ({
            borderColor: alpha(theme.palette.warning.main, 0.7),
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            margin: "4px 10px",
            padding: "8px 16px",
            transition: "background-color 0.2s ease-out",
            "&.Mui-selected": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
              "& .MuiListItemIcon-root": {
                color: theme.palette.primary.main,
              },
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
              },
            },
            "&:hover": {
              backgroundColor: alpha(theme.palette.action.hover, 0.04),
            },
          }),
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(5px)",
            height: 65,
          }),
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.secondary,
            transition: "color 0.2s",
            "&.Mui-selected": {
              color: theme.palette.primary.main,
            },
          }),
          label: {
            transition: "font-weight 0.2s",
            "&.Mui-selected": {
              fontWeight: 600,
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[2],
          }),
          standardWarning: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.warning.light, 0.2),
            color: theme.palette.warning.dark,
          }),
          filledWarning: ({ theme }) => ({
            color: theme.palette.getContrastText(theme.palette.warning.main),
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius * 1.5,
            boxShadow: theme.shadows[10],
            padding: theme.spacing(1),
          }),
        },
      },
      MuiStepper: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(2, 0),
          }),
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          label: ({ theme, ownerState }) => ({
            fontWeight: ownerState.active ? 600 : 400,
            color: ownerState.active
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
            transition: "all 0.3s ease",
          }),
          iconContainer: {
            paddingRight: theme.spacing(1),
          },
        },
      },
    },
  });
};
