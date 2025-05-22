import { Box, Typography, Grid, Link, IconButton, Chip } from "@mui/material";
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

export const ModernTemplate = ({
  resumeData,
  formatDate,
  colorScheme,
  isSectionEmpty,
  toggleStarSection,
  starredSections,
  fontFamily,
}) => {
  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
    references = [],
  } = resumeData;

  const pdfColorStyles = {
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
    colorAdjust: "exact",
  };

  return (
    <Box
      sx={{
        fontFamily: fontFamily,
        color: "#2d3748",
        bgcolor: "#f8fafc",
        p: { xs: 1, sm: 2 },
        maxWidth: "1000px",
        mx: "auto",
        borderRadius: 2,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        ...pdfColorStyles,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          pb: 2,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "4px",
            borderRadius: "2px",
            bgcolor: colorScheme.primary,
          },
          ...pdfColorStyles,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            color: colorScheme.primary,
            mb: 1,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            letterSpacing: "-0.025em",
            ...pdfColorStyles,
          }}
        >
          {personalInfo.fullName || "Your Name"}
        </Typography>

        {personalInfo.jobTitle && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              color: colorScheme.secondary,
              mb: 3,
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              letterSpacing: "0.02em",
              ...pdfColorStyles,
            }}
          >
            {personalInfo.jobTitle}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 2, sm: 3 },
            mt: 3,
          }}
        >
          {personalInfo.email && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <EmailIcon
                fontSize="small"
                sx={{ mr: 0.8, color: colorScheme.primary, ...pdfColorStyles }}
              />
              <Typography
                variant="body2"
                sx={{ fontSize: "0.9rem", fontWeight: 500 }}
              >
                {personalInfo.email}
              </Typography>
            </Box>
          )}
          {personalInfo.phone && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <PhoneIcon
                fontSize="small"
                sx={{ mr: 0.8, color: colorScheme.primary, ...pdfColorStyles }}
              />
              <Typography
                variant="body2"
                sx={{ fontSize: "0.9rem", fontWeight: 500 }}
              >
                {personalInfo.phone}
              </Typography>
            </Box>
          )}
          {personalInfo.location && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <LocationIcon
                fontSize="small"
                sx={{ mr: 0.8, color: colorScheme.primary, ...pdfColorStyles }}
              />
              <Typography
                variant="body2"
                sx={{ fontSize: "0.9rem", fontWeight: 500 }}
              >
                {personalInfo.location}
              </Typography>
            </Box>
          )}
          {personalInfo.linkedin && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <LinkedInIcon
                fontSize="small"
                sx={{ mr: 0.8, color: colorScheme.primary, ...pdfColorStyles }}
              />
              <Link
                href={personalInfo.linkedin}
                target="_blank"
                variant="body2"
                underline="hover"
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: colorScheme.text,
                  "&:hover": { color: colorScheme.primary },
                }}
              >
                LinkedIn
              </Link>
            </Box>
          )}
          {personalInfo.github && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <GitHubIcon
                fontSize="small"
                sx={{ mr: 0.8, color: colorScheme.primary, ...pdfColorStyles }}
              />
              <Link
                href={personalInfo.github}
                target="_blank"
                variant="body2"
                underline="hover"
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: colorScheme.text,
                  "&:hover": { color: colorScheme.primary },
                }}
              >
                GitHub
              </Link>
            </Box>
          )}
          {personalInfo.website && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <LanguageIcon
                fontSize="small"
                sx={{ mr: 0.8, color: colorScheme.primary, ...pdfColorStyles }}
              />
              <Link
                href={personalInfo.website}
                target="_blank"
                variant="body2"
                underline="hover"
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: colorScheme.text,
                  "&:hover": { color: colorScheme.primary },
                }}
              >
                Website
              </Link>
            </Box>
          )}
        </Box>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
          {personalInfo.summary && (
            <Box
              sx={{
                mb: 5,
                p: 3,
                bgcolor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  bgcolor: colorScheme.primary,
                  borderTopLeftRadius: 2,
                  borderBottomLeftRadius: 2,
                },
                ...pdfColorStyles,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: colorScheme.primary,
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    ...pdfColorStyles,
                  }}
                >
                  Profile
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
              <Typography
                variant="body1"
                sx={{
                  textAlign: "justify",
                  lineHeight: 1.7,
                  fontSize: "1rem",
                  color: "rgba(0, 0, 0, 0.75)",
                }}
              >
                {personalInfo.summary}
              </Typography>
            </Box>
          )}
          {!isSectionEmpty("experience") && (
            <Box sx={{ mb: 5 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: colorScheme.primary,
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -6,
                      left: 0,
                      width: "3rem",
                      height: "3px",
                      borderRadius: "2px",
                      bgcolor: colorScheme.primary,
                    },
                    ...pdfColorStyles,
                  }}
                >
                  Experience
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
                <Box
                  key={exp.id || index}
                  sx={{
                    mb: 4,
                    p: 3,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 2,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04)",
                    position: "relative",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "4px",
                      height: "100%",
                      bgcolor: colorScheme.accent,
                      borderTopLeftRadius: 2,
                      borderBottomLeftRadius: 2,
                    },
                    ...pdfColorStyles,
                  }}
                >
                  <Grid container>
                    <Grid item xs={12} sm={8}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: colorScheme.secondary,
                          fontSize: { xs: "1.1rem", sm: "1.25rem" },
                          ...pdfColorStyles,
                        }}
                      >
                        {exp.position || "Position Title"}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          fontSize: "1rem",
                          color: "rgba(0, 0, 0, 0.75)",
                        }}
                      >
                        {exp.company || "Company Name"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        textAlign: { sm: "right" },
                        mt: { xs: 1, sm: 0 },
                      }}
                    >
                      {exp.location && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(0, 0, 0, 0.6)",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { sm: "flex-end" },
                            mb: 0.5,
                          }}
                        >
                          <LocationIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              fontSize: "0.875rem",
                              color: colorScheme.primary,
                              ...pdfColorStyles,
                            }}
                          />
                          {exp.location}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(0, 0, 0, 0.6)",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          fontStyle: "italic",
                        }}
                      >
                        {formatDate(exp.startDate) || "Start Date"} -{" "}
                        {exp.current
                          ? "Present"
                          : formatDate(exp.endDate) || "End Date"}
                      </Typography>
                    </Grid>
                  </Grid>
                  {exp.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 2,
                        mb: 1,
                        color: "rgba(0, 0, 0, 0.75)",
                        lineHeight: 1.6,
                      }}
                    >
                      {exp.description}
                    </Typography>
                  )}
                  {Array.isArray(exp.responsibilities) &&
                    exp.responsibilities.filter(Boolean).length > 0 && (
                      <Box
                        component="ul"
                        sx={{
                          pl: 2,
                          mt: 1,
                          mb: 0,
                          listStyleType: "none",
                          position: "relative",
                        }}
                      >
                        {exp.responsibilities.filter(Boolean).map(
                          (responsibility, idx) =>
                            responsibility.trim() && (
                              <Typography
                                component="li"
                                variant="body2"
                                key={idx}
                                sx={{
                                  mb: 1,
                                  position: "relative",
                                  pl: 3,
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    left: 0,
                                    top: "0.5em",
                                    width: "0.5rem",
                                    height: "0.5rem",
                                    borderRadius: "50%",
                                    bgcolor: colorScheme.accent,
                                    border: `1px solid ${colorScheme.primary}`,
                                  },
                                  lineHeight: 1.6,
                                  color: "rgba(0, 0, 0, 0.75)",
                                }}
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
          )}
          {!isSectionEmpty("projects") && (
            <Box sx={{ mb: 5 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: colorScheme.primary,
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -6,
                      left: 0,
                      width: "3rem",
                      height: "3px",
                      borderRadius: "2px",
                      bgcolor: colorScheme.primary,
                    },
                    ...pdfColorStyles,
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
              <Grid container spacing={3}>
                {projects.map((project, index) => (
                  <Grid item xs={12} sm={6} key={project.id || index}>
                    <Box
                      sx={{
                        height: "100%",
                        p: 3,
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: 2,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04)",
                        position: "relative",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
                        },
                        display: "flex",
                        flexDirection: "column",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "4px",
                          height: "100%",
                          bgcolor: colorScheme.secondary,
                          borderTopLeftRadius: 2,
                          borderBottomLeftRadius: 2,
                        },
                        ...pdfColorStyles,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: colorScheme.secondary,
                          fontSize: { xs: "1.1rem", sm: "1.15rem" },
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          ...pdfColorStyles,
                        }}
                      >
                        <Box component="span" sx={{ pr: 1 }}>
                          {project.title || "Project Title"}
                        </Box>
                        {project.link && (
                          <Link
                            href={project.link}
                            target="_blank"
                            underline="none"
                            sx={{
                              ml: "auto",
                              fontSize: "0.8rem",
                              color: "white",
                              bgcolor: colorScheme.primary,
                              borderRadius: "4px",
                              px: 1,
                              py: 0.5,
                              display: "inline-flex",
                              alignItems: "center",
                              transition: "opacity 0.2s",
                              "&:hover": {
                                opacity: 0.9,
                              },
                              ...pdfColorStyles,
                            }}
                          >
                            <LanguageIcon
                              sx={{ fontSize: "0.8rem", mr: 0.5 }}
                            />
                            View
                          </Link>
                        )}
                      </Typography>
                      {project.technologies && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontStyle: "italic",
                            mt: 1,
                            color: "rgba(0, 0, 0, 0.6)",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.75,
                          }}
                        >
                          {project.technologies
                            .split(/,\s*/)
                            .map((tech, idx) => (
                              <Chip
                                key={idx}
                                label={tech}
                                size="small"
                                sx={{
                                  height: "auto",
                                  py: 0.25,
                                  fontSize: "0.7rem",
                                  bgcolor: "rgba(0, 0, 0, 0.05)",
                                  color: colorScheme.secondary,
                                  ...pdfColorStyles,
                                }}
                              />
                            ))}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(0, 0, 0, 0.6)",
                          fontSize: "0.8rem",
                          fontStyle: "italic",
                          mt: 1,
                        }}
                      >
                        {formatDate(project.startDate) || "Start Date"} -{" "}
                        {project.current
                          ? "Present"
                          : formatDate(project.endDate) || "End Date"}
                      </Typography>
                      {project.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 2,
                            lineHeight: 1.6,
                            color: "rgba(0, 0, 0, 0.75)",
                            flexGrow: 1,
                          }}
                        >
                          {project.description}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
          <Box
            sx={{
              height: "100%",
              p: { xs: 3, md: 4 },
              borderRadius: 2,
              bgcolor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: "100%",
                height: "6px",
                bgcolor: colorScheme.primary,
              },
              ...pdfColorStyles,
            }}
          >
            {!isSectionEmpty("education") && (
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: colorScheme.primary,
                      fontSize: { xs: "1.25rem", sm: "1.4rem" },
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -6,
                        left: 0,
                        width: "2.5rem",
                        height: "3px",
                        borderRadius: "2px",
                        bgcolor: colorScheme.primary,
                      },
                      ...pdfColorStyles,
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
                  <Box
                    key={edu.id || index}
                    sx={{
                      mb: 3,
                      pb: 3,
                      position: "relative",
                      borderBottom:
                        index < education.length - 1
                          ? "1px dashed rgba(0,0,0,0.1)"
                          : "none",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: colorScheme.secondary,
                        fontSize: "1rem",
                        mb: 0.5,
                        ...pdfColorStyles,
                      }}
                    >
                      {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: "rgba(0, 0, 0, 0.75)",
                        mb: 0.5,
                      }}
                    >
                      {edu.institution || "Institution Name"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      {edu.location && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(0, 0, 0, 0.6)",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.8rem",
                          }}
                        >
                          <LocationIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              fontSize: "0.8rem",
                              color: colorScheme.primary,
                              ...pdfColorStyles,
                            }}
                          />
                          {edu.location}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(0, 0, 0, 0.6)",
                          fontStyle: "italic",
                          fontSize: "0.8rem",
                        }}
                      >
                        {formatDate(edu.startDate) || "Start Date"} -{" "}
                        {formatDate(edu.endDate) || "End Date"}
                      </Typography>
                    </Box>
                    {edu.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,
                          lineHeight: 1.6,
                          color: "rgba(0, 0, 0, 0.75)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {edu.description}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
            {!isSectionEmpty("skills") && (
              <Box sx={{ mb: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: colorScheme.primary,
                      fontSize: { xs: "1.25rem", sm: "1.4rem" },
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -6,
                        left: 0,
                        width: "2.5rem",
                        height: "3px",
                        borderRadius: "2px",
                        bgcolor: colorScheme.primary,
                      },
                      ...pdfColorStyles,
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
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {skills.map((category, index) => (
                    <Box key={category.id || index}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: colorScheme.secondary,
                          mb: 1.5,
                          fontSize: "0.95rem",
                          position: "relative",
                          pl: 2,
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            bgcolor: colorScheme.secondary,
                          },
                          ...pdfColorStyles,
                        }}
                      >
                        {category.name || "Skill Category"}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          ml: 2,
                        }}
                      >
                        {Array.isArray(category.skills) &&
                          category.skills.map(
                            (skill, idx) =>
                              skill.trim() && (
                                <Chip
                                  key={idx}
                                  label={skill.trim()}
                                  size="small"
                                  sx={{
                                    bgcolor: "rgba(255, 255, 255, 0.8)",
                                    border: `1px solid ${colorScheme.accent}`,
                                    color: colorScheme.text,
                                    fontWeight: 500,
                                    borderRadius: "4px",
                                    transition:
                                      "background-color 0.2s, transform 0.2s",
                                    "&:hover": {
                                      bgcolor: colorScheme.primary,
                                      color: "white",
                                      transform: "translateY(-2px)",
                                    },
                                    ...pdfColorStyles,
                                  }}
                                />
                              )
                          )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            {references.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: colorScheme.primary,
                      fontSize: { xs: "1.25rem", sm: "1.4rem" },
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -6,
                        left: 0,
                        width: "2.5rem",
                        height: "3px",
                        borderRadius: "2px",
                        bgcolor: colorScheme.primary,
                      },
                      ...pdfColorStyles,
                    }}
                  >
                    References
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => toggleStarSection("references")}
                    sx={{ ml: 1 }}
                  >
                    {starredSections.includes("references") ? (
                      <StarIcon
                        fontSize="small"
                        sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                      />
                    ) : (
                      <StarBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {references.map((reference, index) => (
                    <Box
                      key={reference.id || index}
                      sx={{
                        borderBottom:
                          index < references.length - 1
                            ? "1px dashed rgba(0,0,0,0.1)"
                            : "none",
                        pb: index < references.length - 1 ? 3 : 0,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: colorScheme.secondary,
                          fontSize: "1rem",
                          mb: 0.5,
                          ...pdfColorStyles,
                        }}
                      >
                        {reference.name || "Reference Name"}
                      </Typography>
                      {reference.position && (
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: "rgba(0, 0, 0, 0.75)",
                            mb: 0.5,
                          }}
                        >
                          {reference.position}
                        </Typography>
                      )}
                      {reference.company && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(0, 0, 0, 0.6)",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.8rem",
                          }}
                        >
                          {reference.company}
                        </Typography>
                      )}
                      {reference.email && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(0, 0, 0, 0.6)",
                            fontSize: "0.8rem",
                          }}
                        >
                          Email: {reference.email}
                        </Typography>
                      )}
                      {reference.contact && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(0, 0, 0, 0.6)",
                            fontSize: "0.8rem",
                          }}
                        >
                          Phone: {reference.contact}
                        </Typography>
                      )}
                      {reference.relationship && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(0, 0, 0, 0.6)",
                            fontSize: "0.8rem",
                          }}
                        >
                          Relationship: {reference.relationship}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModernTemplate;
