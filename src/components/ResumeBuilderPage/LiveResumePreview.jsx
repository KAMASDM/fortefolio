import { Box, Paper, Typography } from "@mui/material";
import { ResumeTemplateContent } from "./DisplayResume/ResumeTemplateContent";
import PreviewWrapper from "./Templates/PreviewWrapper";
import { constants } from "./ResumePreview/constants";
import { formatDate, getInitials, isSectionEmpty } from "./utils/resumeUtils";
export default function LiveResumePreview({ resumeData, presentation }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        position: "sticky",
        top: 20,
        alignSelf: "start",
        bgcolor: "#eef0f5",
        maxHeight: "85vh",
        overflow: "auto",
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: "#4b5563", display: "block", mb: 1 }}
      >
        Live preview
      </Typography>
      <PreviewWrapper>
        <ResumeTemplateContent
          resumeData={resumeData}
          activeTemplate={presentation.template}
          fontFamily={presentation.fontFamily}
          fontSize={presentation.fontSize}
          colorScheme={
            constants.COLOR_SCHEMES[
              String(presentation.colorScheme).toUpperCase()
            ] || constants.COLOR_SCHEMES.BLUE
          }
          hiddenSections={presentation.hiddenSections}
          sectionOrder={presentation.sectionOrder}
          starredSections={presentation.starredSections}
          isSectionEmpty={(section) => isSectionEmpty(section, resumeData)}
          formatDate={formatDate}
          getInitials={getInitials}
          isMobile={false}
          isSmallMobile={false}
        />
      </PreviewWrapper>
    </Paper>
  );
}
