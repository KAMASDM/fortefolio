import React from "react";
import {
  Box,
  Typography,
  Grid,
  Link,
  Stack,
  IconButton,
  Divider,
  Chip,
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

export const MinimalTemplate = ({
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
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
    colorAdjust: "exact",
  };

  return (
    <Box
      sx={{
        fontFamily: fontFamily,
        color: colorScheme.text,
        bgcolor: colorScheme.background,
        p: 4,
        maxWidth: "1000px",
        mx: "auto",
        ...pdfColorStyles,
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 600,
            color: colorScheme.primary,
            mb: 1,
            fontSize: { xs: "2rem", md: "2.5rem" },
            ...pdfColorStyles,
          }}
        >
          {personalInfo.fullName || "Your Name"}
        </Typography>
        {personalInfo.jobTitle && (
          <Typography
            variant="h5"
            color="text.secondary"
            gutterBottom
            sx={{
              fontWeight: 400,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              mb: 2,
            }}
          >
            {personalInfo.jobTitle}
          </Typography>
        )}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={8}>
            {personalInfo.summary && (
              <Typography variant="body2" sx={{ textAlign: "justify" }}>
                {personalInfo.summary}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={1}>
              {personalInfo.email && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EmailIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: colorScheme.primary,
                      ...pdfColorStyles,
                    }}
                  />
                  <Typography variant="body2">{personalInfo.email}</Typography>
                </Box>
              )}
              {personalInfo.phone && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PhoneIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: colorScheme.primary,
                      ...pdfColorStyles,
                    }}
                  />
                  <Typography variant="body2">{personalInfo.phone}</Typography>
                </Box>
              )}
              {personalInfo.location && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: colorScheme.primary,
                      ...pdfColorStyles,
                    }}
                  />
                  <Typography variant="body2">
                    {personalInfo.location}
                  </Typography>
                </Box>
              )}
              {personalInfo.linkedin && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LinkedInIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: colorScheme.primary,
                      ...pdfColorStyles,
                    }}
                  />
                  <Link
                    href={personalInfo.linkedin}
                    target="_blank"
                    variant="body2"
                    underline="hover"
                    color="inherit"
                  >
                    LinkedIn
                  </Link>
                </Box>
              )}
              {personalInfo.github && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <GitHubIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: colorScheme.primary,
                      ...pdfColorStyles,
                    }}
                  />
                  <Link
                    href={personalInfo.github}
                    target="_blank"
                    variant="body2"
                    underline="hover"
                    color="inherit"
                  >
                    GitHub
                  </Link>
                </Box>
              )}
              {personalInfo.website && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LanguageIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: colorScheme.primary,
                      ...pdfColorStyles,
                    }}
                  />
                  <Link
                    href={personalInfo.website}
                    target="_blank"
                    variant="body2"
                    underline="hover"
                    color="inherit"
                  >
                    Website
                  </Link>
                </Box>
              )}
              {personalInfo.portfolio && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LanguageIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: colorScheme.primary,
                      ...pdfColorStyles,
                    }}
                  />
                  <Link
                    href={personalInfo.portfolio}
                    target="_blank"
                    variant="body2"
                    underline="hover"
                    color="inherit"
                  >
                    Portfolio
                  </Link>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
        <Divider
          sx={{ mt: 3, borderColor: colorScheme.primary, ...pdfColorStyles }}
        />
      </Box>
      {!isSectionEmpty("experience") && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                color: colorScheme.primary,
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
            <Box key={exp.id || index} sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={2}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {formatDate(exp.startDate) || "Start Date"} -{" "}
                    {exp.current
                      ? "Present"
                      : formatDate(exp.endDate) || "End Date"}
                  </Typography>
                  {exp.location && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {exp.location}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: colorScheme.secondary,
                      fontSize: "1.1rem",
                      ...pdfColorStyles,
                    }}
                  >
                    {exp.position || "Position Title"}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 500, mb: 1 }}
                  >
                    {exp.company || "Company Name"}
                  </Typography>

                  {exp.description && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {exp.description}
                    </Typography>
                  )}
                  {exp.responsibilities &&
                    typeof exp.responsibilities === "string" && (
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
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
                  {Array.isArray(exp.responsibilities) &&
                    exp.responsibilities.length > 0 && (
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {exp.responsibilities.map(
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
                </Grid>
              </Grid>
              {index < experience.length - 1 && (
                <Divider sx={{ my: 2, ...pdfColorStyles }} />
              )}
            </Box>
          ))}
        </Box>
      )}
      {!isSectionEmpty("education") && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                color: colorScheme.primary,
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
          <Grid container spacing={3}>
            {education.map((edu, index) => (
              <Grid item xs={12} sm={6} md={4} key={edu.id || index}>
                <Box
                  sx={{
                    p: 2,
                    height: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    ...pdfColorStyles,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: colorScheme.secondary,
                      fontSize: "1rem",
                      ...pdfColorStyles,
                    }}
                  >
                    {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 500, mb: 1 }}
                  >
                    {edu.institution || "Institution Name"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(edu.startDate) || "Start Date"} -{" "}
                    {formatDate(edu.endDate) || "End Date"}
                  </Typography>
                  {edu.location && (
                    <Typography variant="body2" color="text.secondary">
                      {edu.location}
                    </Typography>
                  )}
                  {edu.description && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, fontSize: "0.875rem" }}
                    >
                      {edu.description}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {!isSectionEmpty("skills") && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                color: colorScheme.primary,
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
          <Grid container spacing={2}>
            {skills.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={category.id || index}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: colorScheme.secondary,
                      mb: 1,
                      ...pdfColorStyles,
                    }}
                  >
                    {category.name || "Skill Category"}
                  </Typography>
                  {Array.isArray(category.skills) && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {category.skills.map(
                        (skill, idx) =>
                          skill.trim() && (
                            <Chip
                              key={idx}
                              label={skill.trim()}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: colorScheme.primary,
                                color: colorScheme.text,
                                ...pdfColorStyles,
                              }}
                            />
                          )
                      )}
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {!isSectionEmpty("projects") && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                color: colorScheme.primary,
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
                    p: 2,
                    height: "100%",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    ...pdfColorStyles,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: colorScheme.secondary,
                      fontSize: "1.1rem",
                      ...pdfColorStyles,
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
                          ...pdfColorStyles,
                        }}
                      >
                        View
                      </Link>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
                        mt: 1,
                        bgcolor: colorScheme.accent,
                        color: colorScheme.secondary,
                        fontSize: "0.75rem",
                        ...pdfColorStyles,
                      }}
                    />
                  )}
                  {project.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {project.description}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default MinimalTemplate;
