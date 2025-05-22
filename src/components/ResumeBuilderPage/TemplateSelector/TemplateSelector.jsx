import { Tabs, Tab } from "@mui/material";
import { Description, Article, Brush, Work } from "@mui/icons-material";

export const TemplateSelector = ({
  activeTab,
  handleTemplateChange,
  isMobile,
}) => {
  return (
    <Tabs
      value={activeTab}
      onChange={handleTemplateChange}
      variant={isMobile ? "scrollable" : "standard"}
      scrollButtons="auto"
      centered={!isMobile}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Tab label="Modern" icon={<Description />} iconPosition="start" />
      <Tab label="Minimal" icon={<Article />} iconPosition="start" />
      <Tab label="Creative" icon={<Brush />} iconPosition="start" />
      <Tab label="Professional" icon={<Work />} iconPosition="start" />
      <Tab label="Elegant" icon={<Brush />} iconPosition="start" />

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
    </Tabs>
  );
};
