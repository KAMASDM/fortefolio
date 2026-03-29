import { Box, Paper, Stack, Typography, Chip } from "@mui/material";
import {
  Description,
  Article,
  Brush,
  Work,
  BusinessCenter,
  AccountBalance,
  Timeline,
  Palette as ElegantIcon,
} from "@mui/icons-material";

// Define the color palette for consistency
const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
};

const templateOptions = [
  {
    label: "Modern",
    subtitle: "Clean and balanced",
    icon: <Description fontSize="small" />,
    category: "Core",
  },
  {
    label: "Modern Neo",
    subtitle: "Bold gradient header",
    icon: <Description fontSize="small" />,
    category: "Modern+",
  },
  {
    label: "Modern Slate",
    subtitle: "Corporate dark accents",
    icon: <Description fontSize="small" />,
    category: "Modern+",
  },
  {
    label: "Modern Aurora",
    subtitle: "Vibrant high-contrast",
    icon: <Description fontSize="small" />,
    category: "Modern+",
  },
  {
    label: "Modern Metro",
    subtitle: "Sharp tech style",
    icon: <Description fontSize="small" />,
    category: "Modern+",
  },
  {
    label: "Modern Zen",
    subtitle: "Calm clean layout",
    icon: <Description fontSize="small" />,
    category: "Modern+",
  },
  {
    label: "Modern Nova",
    subtitle: "Warm energetic tone",
    icon: <Description fontSize="small" />,
    category: "Modern+",
  },
  {
    label: "Modern Edge",
    subtitle: "Angular premium style",
    icon: <Description fontSize="small" />,
    category: "Modern+",
  },
  {
    label: "Modern Prism",
    subtitle: "Fresh cyan palette",
    icon: <Description fontSize="small" />,
    category: "Modern+",
  },
  {
    label: "Modern Summit",
    subtitle: "Executive blue tone",
    icon: <Description fontSize="small" />,
    category: "Modern+",
  },
  {
    label: "Modern Flow",
    subtitle: "Smooth rounded layout",
    icon: <Description fontSize="small" />,
    category: "Modern+",
  },
  {
    label: "Minimal",
    subtitle: "Simple and ATS-friendly",
    icon: <Article fontSize="small" />,
    category: "Core",
  },
  {
    label: "Creative",
    subtitle: "Bold visual style",
    icon: <Brush fontSize="small" />,
    category: "Core",
  },
  {
    label: "Professional",
    subtitle: "Traditional recruiter format",
    icon: <Work fontSize="small" />,
    category: "Professional",
  },
  {
    label: "Executive",
    subtitle: "Leadership-focused",
    icon: <BusinessCenter fontSize="small" />,
    category: "Professional",
  },
  {
    label: "Classic",
    subtitle: "Elegant and formal",
    icon: <AccountBalance fontSize="small" />,
    category: "Professional",
  },
  {
    label: "Timeline",
    subtitle: "Career progression emphasis",
    icon: <Timeline fontSize="small" />,
    category: "Professional",
  },
  {
    label: "Sidebar",
    subtitle: "Split layout",
    icon: <ElegantIcon fontSize="small" />,
    category: "Professional",
  },
  {
    label: "Canada",
    subtitle: "Regional standard",
    icon: (
      <img
        src="https://flagcdn.com/ca.svg"
        alt="Canada Flag"
        width="22"
        height="15"
        style={{ borderRadius: "2px" }}
      />
    ),
    category: "Regional",
  },
  {
    label: "Europass",
    subtitle: "EU CV format",
    icon: <ElegantIcon fontSize="small" />,
    category: "Regional",
  },
  {
    label: "Europe",
    subtitle: "European market",
    icon: (
      <img
        src="https://flagcdn.com/eu.svg"
        alt="Europe Flag"
        width="22"
        height="15"
        style={{ borderRadius: "2px" }}
      />
    ),
    category: "Regional",
  },
  {
    label: "Australia",
    subtitle: "ANZ style",
    icon: (
      <img
        src="https://flagcdn.com/au.svg"
        alt="Australia Flag"
        width="22"
        height="15"
        style={{ borderRadius: "2px" }}
      />
    ),
    category: "Regional",
  },
  {
    label: "USA",
    subtitle: "US hiring preference",
    icon: (
      <img
        src="https://flagcdn.com/us.svg"
        alt="USA Flag"
        width="22"
        height="15"
        style={{ borderRadius: "2px" }}
      />
    ),
    category: "Regional",
  },
  {
    label: "India",
    subtitle: "Indian job market",
    icon: (
      <img
        src="https://flagcdn.com/in.svg"
        alt="India Flag"
        width="22"
        height="15"
        style={{ borderRadius: "2px" }}
      />
    ),
    category: "Regional",
  },
];

export const TemplateSelector = ({ activeTab, handleTemplateChange, isMobile }) => {
  const currentTemplate = templateOptions[activeTab];

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: lavenderPalette.soft,
        borderRadius: 2,
        p: { xs: 1.5, sm: 2 },
        mb: 2,
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{
          px: 0.5,
          pb: 1.5,
          borderBottom: "1px solid",
          borderColor: lavenderPalette.light,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: lavenderPalette.text, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Template Gallery
          </Typography>
          <Typography sx={{ fontSize: "0.92rem", color: lavenderPalette.text, opacity: 0.85 }}>
            Choose a layout that matches your role and market.
          </Typography>
        </Box>

        {currentTemplate && (
          <Chip
            label={`Selected: ${currentTemplate.label}`}
            size="small"
            sx={{
              bgcolor: lavenderPalette.light,
              color: lavenderPalette.darkText,
              fontWeight: 700,
            }}
          />
        )}
      </Stack>

      <Box
        sx={{
          mt: 1.5,
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, minmax(150px, 1fr))"
            : "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 1.2,
          maxHeight: isMobile ? 310 : 360,
          overflowY: "auto",
          pr: 0.5,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: lavenderPalette.soft,
            borderRadius: "999px",
          },
        }}
      >
        {templateOptions.map((option, index) => {
          const selected = activeTab === index;
          return (
            <Paper
              key={option.label}
              component="button"
              type="button"
              onClick={(event) => handleTemplateChange(event, index)}
              sx={{
                textAlign: "left",
                p: 1.4,
                borderRadius: 1.8,
                cursor: "pointer",
                border: "1px solid",
                borderColor: selected ? lavenderPalette.primary : lavenderPalette.light,
                bgcolor: selected ? lavenderPalette.light : "#fff",
                boxShadow: selected
                  ? "0 8px 20px rgba(125, 104, 201, 0.24)"
                  : "0 1px 5px rgba(45, 34, 77, 0.08)",
                transition: "all 0.22s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 16px rgba(45, 34, 77, 0.14)",
                  borderColor: lavenderPalette.medium,
                },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Box sx={{ color: selected ? lavenderPalette.deep : lavenderPalette.text }}>
                  {option.icon}
                </Box>
                <Chip
                  label={option.category}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.66rem",
                    fontWeight: 700,
                    bgcolor: selected ? "#fff" : lavenderPalette.light,
                    color: lavenderPalette.darkText,
                  }}
                />
              </Stack>
              <Typography sx={{ mt: 1, fontWeight: 700, color: lavenderPalette.darkText, fontSize: "0.94rem" }}>
                {option.label}
              </Typography>
              <Typography sx={{ mt: 0.4, fontSize: "0.78rem", color: lavenderPalette.text, opacity: 0.9 }}>
                {option.subtitle}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};