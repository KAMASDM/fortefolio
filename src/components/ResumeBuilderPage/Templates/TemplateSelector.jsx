import React from "react";
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
    </Tabs>
  );
};
