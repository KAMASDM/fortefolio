import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Close as CloseIcon,
  Lightbulb as LightbulbIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from "@mui/icons-material";

const resumeTips = [
  {
    id: 1,
    title: "The 7-Second Scan",
    description:
      "The average recruiter or hiring manager initially spends only about 7 seconds scanning your resume. Your resume needs to make an immediate, powerful impression.",
  },
  {
    id: 2,
    title: "Keyword Is King (Thanks to Robots)",
    description:
      "Up to 90% of large companies use Applicant Tracking Systems (ATS). If your resume isn't optimized with keywords from the job description, a human might never see it.",
  },
  {
    id: 3,
    title: "The 'Objective' is (Mostly) Obsolete",
    description:
      "Generic objective statements are outdated. Most recruiters prefer a concise professional summary that highlights your key skills and experience relevant to the specific job.",
  },
  {
    id: 4,
    title: "Quantify, Quantify, Quantify",
    description:
      "Showcase your achievements with numbers. E.g., 'Increased social media engagement by 30% over 6 months.' Statistics show around 81% of resumes fail to do this effectively.",
  },
  {
    id: 5,
    title: "The Power of Action Verbs",
    description:
      "Start your bullet points with strong action verbs (e.g., 'Orchestrated,' 'Implemented,' 'Streamlined') to make accomplishments sound more dynamic and impactful.",
  },
  {
    id: 6,
    title: "Length Matters (But It's Debatable)",
    description:
      "While the 'one-page rule' is common for entry-level, many hiring managers (around 70%) prefer two-page resumes for experienced professionals. Ideal length is 475-600 words.",
  },
  {
    id: 7,
    title: "The Cost of a Typo",
    description:
      "A startling 77% of hiring managers will immediately reject a resume with typos or bad grammar. Proofreading isn't just a suggestion; it's crucial.",
  },
  {
    id: 8,
    title: "'References Available Upon Request' is Redundant",
    description:
      "This phrase takes up valuable space and is largely assumed. Employers will ask for references when they need them.",
  },
  {
    id: 9,
    title: "Unprofessional Email Addresses Get Trashed",
    description:
      "An email like 'partyanimal2000@email.com' can get your resume instantly dismissed by around 35% of employers. Stick to a professional-sounding email.",
  },
  {
    id: 10,
    title: "Tailoring Trumps 'One-Size-Fits-All'",
    description:
      "Submitting the same generic resume for every job is a major mistake. Over 60% of recruiters prefer resumes personalized to the specific job position.",
  },
];

const ResumeTipsDialog = ({ open, onClose }) => {
  const theme = useTheme();

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxHeight: "80vh",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LightbulbIcon sx={{ color: "#9D88D9" }} />
            <Typography variant="h6" fontWeight={600}>
              Resume Building Tips
            </Typography>
          </Box>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 3, overflowY: "auto" }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Here are some essential tips to help you craft an outstanding resume:
        </Typography>
        <List disablePadding>
          {resumeTips.map((tip) => (
            <ListItem
              key={tip.id}
              disablePadding
              sx={{
                alignItems: "flex-start",
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha("#9D88D9", 0.05),
                border: `1px solid ${alpha("#9D88D9", 0.1)}`,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                <CheckCircleOutlineIcon sx={{ color: "#9D88D9" }} /> 
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={600}>
                    {tip.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {tip.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: 8,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#9D88D9",
            "&:hover": {
              bgcolor: "#8c74cc",
            },
          }}
        >
          Got it
        </Button>
      </Box>
    </Drawer>
  );
};

export default ResumeTipsDialog;
