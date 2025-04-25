import React from "react";
import {
  Box,
  Typography,
  Grid,
  Link,
  IconButton,
  Avatar,
  Chip,
  Paper,
  Tooltip,
  Stack
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  Visibility as ViewIcon
} from "@mui/icons-material";

export const CreativeTemplate = ({
  resumeData,
  formatDate,
  colorScheme,
  fontFamily,
  isSectionEmpty,
  toggleStarSection,
  starredSections,
  getInitials
}) => {
  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
  } = resumeData;

  const pdfColorStyles = {
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact',
    colorAdjust: 'exact'
  };

  return (
    <Box
      sx={{
        fontFamily: fontFamily,
        color: colorScheme.text,
        bgcolor: colorScheme.background,
        p: 2,
        maxWidth: "1000px",
        mx: "auto",
        position: "relative",
        ":before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "150px",
          bgcolor: colorScheme.primary,
          zIndex: 0,
        },
        ...pdfColorStyles
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-end" },
          mb: 3,
          gap: 3,
          ...pdfColorStyles
        }}
      >
        <Avatar
          sx={{
            width: { xs: 100, md: 120 },
            height: { xs: 100, md: 120 },
            bgcolor: colorScheme.secondary,
            color: "white",
            fontSize: "3rem",
            fontWeight: "bold",
            border: "4px solid white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            ...pdfColorStyles
          }}
        >
          {personalInfo.fullName ? getInitials(personalInfo.fullName) : "N"}
        </Avatar>

        <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 600,
              color: "white",
              mb: 0.5,
              fontSize: { xs: "2rem", md: "2.5rem" },
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              ...pdfColorStyles
            }}
          >
            {personalInfo.fullName || "Your Name"}
          </Typography>

          {personalInfo.jobTitle && (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                color: "white",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                opacity: 0.9,
                ...pdfColorStyles
              }}
            >
              {personalInfo.jobTitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            ml: { xs: 0, md: "auto" },
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          {personalInfo.email && (
            <Tooltip title={personalInfo.email}>
              <IconButton sx={{ color: "white", ...pdfColorStyles }}>
                <EmailIcon />
              </IconButton>
            </Tooltip>
          )}

          {personalInfo.phone && (
            <Tooltip title={personalInfo.phone}>
              <IconButton sx={{ color: "white", ...pdfColorStyles }}>
                <PhoneIcon />
              </IconButton>
            </Tooltip>
          )}

          {personalInfo.location && (
            <Tooltip title={personalInfo.location}>
              <IconButton sx={{ color: "white", ...pdfColorStyles }}>
                <LocationIcon />
              </IconButton>
            </Tooltip>
          )}

          {personalInfo.linkedin && (
            <Tooltip title="LinkedIn Profile">
              <IconButton
                component="a"
                href={personalInfo.linkedin}
                target="_blank"
                sx={{ color: "white", ...pdfColorStyles }}
              >
                <LinkedInIcon />
              </IconButton>
            </Tooltip>
          )}

          {personalInfo.github && (
            <Tooltip title="GitHub Profile">
              <IconButton
                component="a"
                href={personalInfo.github}
                target="_blank"
                sx={{ color: "white", ...pdfColorStyles }}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          )}

          {personalInfo.website && (
            <Tooltip title="Website">
              <IconButton
                component="a"
                href={personalInfo.website}
                target="_blank"
                sx={{ color: "white", ...pdfColorStyles }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          )}

          {personalInfo.portfolio && (
            <Tooltip title="Portfolio Website">
              <IconButton
                component="a"
                href={personalInfo.portfolio}
                target="_blank"
                sx={{ color: "white", ...pdfColorStyles }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {personalInfo.summary && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 4,
            position: "relative",
            "&:before": {
              content: '""',
              position: "absolute",
              top: -15,
              left: 20,
              width: 30,
              height: 30,
              bgcolor: colorScheme.primary,
              transform: "rotate(45deg)",
              zIndex: -1,
            },
            ...pdfColorStyles
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                color: colorScheme.primary,
                ...pdfColorStyles
              }}
            >
              About Me
            </Typography>
            <IconButton
              size="small"
              onClick={() => toggleStarSection("summary")}
              sx={{ ml: 1 }}
            >
              {starredSections.includes("summary") ? (
                <StarIcon
                  fontSize="small"
                  sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                />
              ) : (
                <StarBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
          <Typography variant="body1">{personalInfo.summary}</Typography>
        </Paper>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {!isSectionEmpty("experience") && (
            <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 3, ...pdfColorStyles }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: colorScheme.primary, mr: 2, ...pdfColorStyles }}>
                  <WorkIcon />
                </Avatar>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.primary,
                    ...pdfColorStyles
                  }}
                >
                  Work Experience
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => toggleStarSection("experience")}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes("experience") ? (
                    <StarIcon
                      fontSize="small"
                      sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                    />
                  ) : (
                    <StarBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>

              <Box
                sx={{
                  position: "relative",
                  ml: 3,
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: -20,
                    width: 2,
                    height: "100%",
                    bgcolor: colorScheme.accent,
                  },
                  ...pdfColorStyles
                }}
              >
                {experience.map((exp, index) => (
                  <Box
                    key={exp.id || index}
                    sx={{
                      mb: 2,
                      position: "relative",
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        top: 6,
                        left: -23,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: colorScheme.primary,
                      },
                      ...pdfColorStyles
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: colorScheme.secondary,
                          ...pdfColorStyles
                        }}
                      >
                        {exp.position || "Position Title"}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 500 }}
                        >
                          {exp.company || "Company Name"}
                          {exp.location && ` • ${exp.location}`}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          {formatDate(exp.startDate) || "Start Date"} -{" "}
                          {exp.current
                            ? "Present"
                            : formatDate(exp.endDate) || "End Date"}
                        </Typography>
                      </Box>
                    </Box>

                    {exp.description && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {exp.description}
                      </Typography>
                    )}

                    {typeof exp.responsibilities === "string" &&
                      exp.responsibilities.trim() && (
                        <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                          {exp.responsibilities.split("\n").map(
                            (responsibility, idx) =>
                              responsibility.trim() && (
                                <Typography
                                  component="li"
                                  variant="body2"
                                  key={idx}
                                  sx={{ mb: 0.5 }}
                                >
                                  {responsibility}
                                </Typography>
                              )
                          )}
                        </Box>
                      )}
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          {!isSectionEmpty("projects") && (
            <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 3, ...pdfColorStyles }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: colorScheme.primary, mr: 2, ...pdfColorStyles }}>
                  <CodeIcon />
                </Avatar>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.primary,
                    ...pdfColorStyles
                  }}
                >
                  Projects
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => toggleStarSection("projects")}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes("projects") ? (
                    <StarIcon
                      fontSize="small"
                      sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                    />
                  ) : (
                    <StarBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                {projects.map((project, index) => (
                  <Grid item xs={12} key={project.id || index}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderLeft: "4px solid",
                        borderColor: colorScheme.primary,
                        borderRadius: 1,
                        ...pdfColorStyles
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: colorScheme.secondary,
                              ...pdfColorStyles
                            }}
                          >
                            {project.title || "Project Title"}
                            {project.link && (
                              <Link
                                href={project.link}
                                target="_blank"
                                underline="hover"
                                sx={{
                                  ml: 1,
                                  fontSize: "0.8rem",
                                  color: colorScheme.primary,
                                  ...pdfColorStyles
                                }}
                              >
                                <ViewIcon
                                  fontSize="small"
                                  sx={{ verticalAlign: "middle", mr: 0.5 }}
                                />
                                View
                              </Link>
                            )}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 1,
                              mt: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              {formatDate(project.startDate) || "Start Date"} -{" "}
                              {project.current
                                ? "Present"
                                : formatDate(project.endDate) || "End Date"}
                            </Typography>

                            {project.technologies && (
                              <Chip
                                label={project.technologies}
                                size="small"
                                sx={{
                                  bgcolor: colorScheme.accent,
                                  color: colorScheme.secondary,
                                  fontSize: "0.75rem",
                                  ...pdfColorStyles
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>

                      {project.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {project.description}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          {!isSectionEmpty("education") && (
            <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 3, ...pdfColorStyles }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: colorScheme.primary, mr: 2, ...pdfColorStyles }}>
                  <SchoolIcon />
                </Avatar>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.primary,
                    ...pdfColorStyles
                  }}
                >
                  Education
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => toggleStarSection("education")}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes("education") ? (
                    <StarIcon
                      fontSize="small"
                      sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                    />
                  ) : (
                    <StarBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>

              <Stack spacing={2}>
                {education.map((edu, index) => (
                  <Paper
                    key={edu.id || index}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderColor: colorScheme.accent,
                      ...pdfColorStyles
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: colorScheme.secondary,
                        fontSize: "1rem",
                        ...pdfColorStyles
                      }}
                    >
                      {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {edu.institution || "Institution Name"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      {edu.location && (
                        <Typography variant="body2" color="text.secondary">
                          {edu.location}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(edu.startDate) || "Start Date"} -{" "}
                        {formatDate(edu.endDate) || "End Date"}
                      </Typography>
                    </Box>
                    {edu.description && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontSize: "0.875rem" }}
                      >
                        {edu.description}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Paper>
          )}

          {!isSectionEmpty("skills") && (
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, ...pdfColorStyles }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: colorScheme.primary, mr: 2, ...pdfColorStyles }}>
                  <PsychologyIcon />
                </Avatar>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.primary,
                    ...pdfColorStyles
                  }}
                >
                  Skills
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => toggleStarSection("skills")}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes("skills") ? (
                    <StarIcon
                      fontSize="small"
                      sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                    />
                  ) : (
                    <StarBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {skills.map((category, index) => (
                  <Box key={category.id || index}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: colorScheme.secondary,
                        mb: 1,
                        backgroundColor: colorScheme.accent,
                        p: 1,
                        borderRadius: 1,
                        ...pdfColorStyles
                      }}
                    >
                      {category.name || "Skill Category"}
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {Array.isArray(category.skills) &&
                        category.skills.map(
                          (skill, idx) =>
                            skill.trim() && (
                              <Chip
                                key={idx}
                                label={skill.trim()}
                                size="small"
                                sx={{
                                  bgcolor: "white",
                                  border: "1px solid",
                                  borderColor: colorScheme.primary,
                                  color: colorScheme.secondary,
                                  "&:hover": {
                                    bgcolor: colorScheme.primary,
                                    color: "white",
                                  },
                                  ...pdfColorStyles
                                }}
                              />
                            )
                        )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreativeTemplate;