import React from "react";
import {
  Box,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  Chip,
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
} from "@mui/icons-material";

export const ProfessionalTemplate = ({
  resumeData,
  formatDate,
  colorScheme,
  fontFamily,
  isSectionEmpty,
  toggleStarSection,
  starredSections,
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
        bgcolor: "white",
        p: 4,
        maxWidth: "1000px",
        mx: "auto",
        ...pdfColorStyles
      }}
    >
      <Box
        sx={{
          borderBottom: `3px solid ${colorScheme.primary}`,
          pb: 3,
          mb: 4,
          ...pdfColorStyles
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: colorScheme.secondary,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                ...pdfColorStyles
              }}
            >
              {personalInfo.fullName || "Your Name"}
            </Typography>

            {personalInfo.jobTitle && (
              <Typography
                variant="h5"
                sx={{
                  color: colorScheme.primary,
                  fontWeight: 500,
                  mb: 2,
                  ...pdfColorStyles
                }}
              >
                {personalInfo.jobTitle}
              </Typography>
            )}

            {personalInfo.summary && (
              <Typography variant="body1" sx={{ maxWidth: "650px" }}>
                {personalInfo.summary}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: { xs: "flex-start", md: "flex-end" },
              }}
            >
              {personalInfo.email && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon
                    fontSize="small"
                    sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                  />
                  <Typography variant="body2">{personalInfo.email}</Typography>
                </Box>
              )}

              {personalInfo.phone && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon
                    fontSize="small"
                    sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                  />
                  <Typography variant="body2">{personalInfo.phone}</Typography>
                </Box>
              )}

              {personalInfo.location && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationIcon
                    fontSize="small"
                    sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                  />
                  <Typography variant="body2">
                    {personalInfo.location}
                  </Typography>
                </Box>
              )}

              {personalInfo.linkedin && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinkedInIcon
                    fontSize="small"
                    sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                  />
                  <Link
                    href={personalInfo.linkedin}
                    target="_blank"
                    variant="body2"
                    underline="hover"
                  >
                    LinkedIn
                  </Link>
                </Box>
              )}

              {personalInfo.github && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GitHubIcon
                    fontSize="small"
                    sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                  />
                  <Link
                    href={personalInfo.github}
                    target="_blank"
                    variant="body2"
                    underline="hover"
                  >
                    GitHub
                  </Link>
                </Box>
              )}

              {personalInfo.website && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LanguageIcon
                    fontSize="small"
                    sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                  />
                  <Link
                    href={personalInfo.website}
                    target="_blank"
                    variant="body2"
                    underline="hover"
                  >
                    Website
                  </Link>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {!isSectionEmpty("experience") && (
            <Box sx={{ mb: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  pb: 1,
                  borderBottom: `2px solid ${colorScheme.accent}`,
                  ...pdfColorStyles
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.primary,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    ...pdfColorStyles
                  }}
                >
                  Professional Experience
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

              {experience.map((exp, index) => (
                <Box key={exp.id || index} sx={{ mb: 4 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          mb: 0.5,
                        }}
                      >
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
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: colorScheme.primary,
                            ...pdfColorStyles
                          }}
                        >
                          {formatDate(exp.startDate) || "Start Date"} -{" "}
                          {exp.current
                            ? "Present"
                            : formatDate(exp.endDate) || "End Date"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 500 }}
                        >
                          {exp.company || "Company Name"}
                        </Typography>
                        {exp.location && (
                          <Typography variant="body2" color="text.secondary">
                            {exp.location}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

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

                  {index < experience.length - 1 && <Divider sx={{ mt: 2, ...pdfColorStyles }} />}
                </Box>
              ))}
            </Box>
          )}

          {!isSectionEmpty("projects") && (
            <Box sx={{ mb: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  pb: 1,
                  borderBottom: `2px solid ${colorScheme.accent}`,
                  ...pdfColorStyles
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.primary,
                    textTransform: "uppercase",
                    letterSpacing: 1,
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

              {projects.map((project, index) => (
                <Box key={project.id || index} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      mb: 0.5,
                    }}
                  >
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
                          View Project
                        </Link>
                      )}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: colorScheme.primary,
                        ...pdfColorStyles
                      }}
                    >
                      {formatDate(project.startDate) || "Start Date"} -{" "}
                      {project.current
                        ? "Present"
                        : formatDate(project.endDate) || "End Date"}
                    </Typography>
                  </Box>

                  {project.technologies && (
                    <Typography
                      variant="subtitle2"
                      sx={{ fontStyle: "italic", mb: 1 }}
                    >
                      {project.technologies}
                    </Typography>
                  )}

                  {project.description && (
                    <Typography variant="body2">
                      {project.description}
                    </Typography>
                  )}

                  {index < projects.length - 1 && <Divider sx={{ my: 2, ...pdfColorStyles }} />}
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {!isSectionEmpty("education") && (
            <Box sx={{ mb: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  pb: 1,
                  borderBottom: `2px solid ${colorScheme.accent}`,
                  ...pdfColorStyles
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.primary,
                    textTransform: "uppercase",
                    letterSpacing: 1,
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

              {education.map((edu, index) => (
                <Box key={edu.id || index} sx={{ mb: 3 }}>
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
                      flexWrap: "wrap",
                      mt: 0.5,
                      mb: 1,
                    }}
                  >
                    {edu.location && (
                      <Typography variant="body2" color="text.secondary">
                        {edu.location}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                    >
                      {formatDate(edu.startDate) || "Start Date"} -{" "}
                      {formatDate(edu.endDate) || "End Date"}
                    </Typography>
                  </Box>

                  {edu.description && (
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      {edu.description}
                    </Typography>
                  )}

                  {index < education.length - 1 && <Divider sx={{ my: 2, ...pdfColorStyles }} />}
                </Box>
              ))}
            </Box>
          )}

          {!isSectionEmpty("skills") && (
            <Box sx={{ mb: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  pb: 1,
                  borderBottom: `2px solid ${colorScheme.accent}`,
                  ...pdfColorStyles
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.primary,
                    textTransform: "uppercase",
                    letterSpacing: 1,
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

              <Stack spacing={2}>
                {skills.map((category, index) => (
                  <Box key={category.id || index}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: colorScheme.secondary,
                        mb: 1,
                        ...pdfColorStyles
                      }}
                    >
                      {category.name || "Skill Category"}
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                      {Array.isArray(category.skills) &&
                        category.skills.map(
                          (skill, idx) =>
                            skill.trim() && (
                              <Chip
                                key={idx}
                                label={skill.trim()}
                                size="small"
                                sx={{
                                  bgcolor: colorScheme.accent,
                                  color: colorScheme.secondary,
                                  fontWeight: 500,
                                  ...pdfColorStyles
                                }}
                              />
                            )
                        )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfessionalTemplate;