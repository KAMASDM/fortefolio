import { Tabs, Tab, Box } from "@mui/material";
import {
  Description,
  Article,
  Brush,
  Work,
  Palette as ElegantIcon, // Using a more distinct icon for Elegant
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

export const TemplateSelector = ({
  activeTab,
  handleTemplateChange,
  isMobile,
}) => {
  return (
    <Box
      sx={{
        borderBottom: "1px solid",
        borderColor: lavenderPalette.soft, // Use themed border color
        bgcolor: "background.paper",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTemplateChange}
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons="auto"
        centered={!isMobile}

        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: lavenderPalette.primary,
            height: "3px",
            borderRadius: "3px 3px 0 0",
          },
          "& .MuiTab-root": {
            color: lavenderPalette.text,
            fontWeight: 500,
            opacity: 0.8,
            textTransform: "capitalize",
            fontSize: "0.9rem",
            minHeight: "auto",
            padding: "12px 20px",
            "&:hover": {
              backgroundColor: lavenderPalette.light,
              opacity: 1,
            },
            "&.Mui-selected": {
              color: lavenderPalette.deep,
              fontWeight: 700,
              opacity: 1,
            },
          },
        }}
      >
        <Tab label="Modern" icon={<Description />} iconPosition="start" />
        <Tab label="Minimal" icon={<Article />} iconPosition="start" />
        <Tab label="Creative" icon={<Brush />} iconPosition="start" />
        <Tab label="Professional" icon={<Work />} iconPosition="start" />
        <Tab label="Elegant" icon={<ElegantIcon />} iconPosition="start" />
        <Tab
          label="Canada"
          icon={
            <img
              src="https://flagcdn.com/ca.svg"
              alt="Canada Flag"
              width="24"
              height="16"
              style={{ borderRadius: "2px" }}
            />
          }
          iconPosition="start"
        />
        <Tab
          label="Europe"
          icon={
            <img
              src="https://flagcdn.com/eu.svg"
              alt="Europe Flag"
              width="24"
              height="16"
              style={{ borderRadius: "2px" }}
            />
          }
          iconPosition="start"
        />
        <Tab
          label="Australia"
          icon={
            <img
              src="https://flagcdn.com/au.svg"
              alt="Australia Flag"
              width="24"
              height="16"
              style={{ borderRadius: "2px" }}
            />
          }
          iconPosition="start"
        />
        <Tab
          label="USA"
          icon={
            <img
              src="https://flagcdn.com/us.svg"
              alt="USA Flag"
              width="24"
              height="16"
              style={{ borderRadius: "2px" }}
            />
          }
          iconPosition="start"
        />
        <Tab
          label="India"
          icon={
            <img
              src="https://flagcdn.com/in.svg"
              alt="India Flag"
              width="24"
              height="16"
              style={{ borderRadius: "2px" }}
            />
          }
          iconPosition="start"
        />
      </Tabs>
    </Box>
  );
};