import {
  Box,
  Typography,
  Grid,
  Link,
  Stack,
  IconButton,
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

export const SidebarTemplate = ({
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

  const SectionTitle = ({ title, sectionName }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        pb: 0.5,
        borderBottom: `1px solid ${colorScheme.accent}`,
        ...pdfColorStyles,
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontWeight: 700,
          color: colorScheme.secondary,
          fontSize: "1.1rem",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          ...pdfColorStyles,
        }}
      >
        {title}
      </Typography>
      <IconButton
        size="small"
        onClick={() => toggleStarSection(sectionName)}
        sx={{ ml: 1 }}
      >
        {starredSections.includes(sectionName) ? (
          <StarIcon
            fontSize="small"
            sx={{ color: colorScheme.primary, ...pdfColorStyles }}
          />
        ) : (
          <StarBorderIcon fontSize="small" />
        )}
      </IconButton>
    </Box>
  );

  return (
    <Box
      sx={{
        fontFamily: fontFamily,
        color: colorScheme.text,
        bgcolor: colorScheme.background,
        p: 2,
        maxWidth: "1000px",
        mx: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        ...pdfColorStyles,
      }}
    >
      <Box
        sx={{
          mb: 4,
          pb: 2,
          borderBottom: `2px solid ${colorScheme.primary}`,
          ...pdfColorStyles,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            color: colorScheme.primary,
            mb: 0.5,
            fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.2rem" },
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
              fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.8rem" },
              ...pdfColorStyles,
            }}
          >
            {personalInfo.jobTitle}
          </Typography>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              bgcolor: colorScheme.sidebarBackground || colorScheme.background,
              p: { xs: 1, md: 2 },
              borderRadius: 2,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              height: "100%",
              ...pdfColorStyles,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <SectionTitle title="Contact" sectionName="personalInfo" />
              <Stack spacing={1.5}>
                {personalInfo.email && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon
                      fontSize="small"
                      sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                    />
                    <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                      {personalInfo.email}
                    </Typography>
                  </Box>
                )}
                {personalInfo.phone && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PhoneIcon
                      fontSize="small"
                      sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                    />
                    <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                      {personalInfo.phone}
                    </Typography>
                  </Box>
                )}
                {personalInfo.location && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationIcon
                      fontSize="small"
                      sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                    />
                    <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
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
                      sx={{ fontSize: "0.9rem", color: colorScheme.text }}
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
                      sx={{ fontSize: "0.9rem", color: colorScheme.text }}
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
                      sx={{ fontSize: "0.9rem", color: colorScheme.text }}
                    >
                      Website
                    </Link>
                  </Box>
                )}
                {personalInfo.portfolio && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LanguageIcon
                      fontSize="small"
                      sx={{ color: colorScheme.primary, ...pdfColorStyles }}
                    />
                    <Link
                      href={personalInfo.portfolio}
                      target="_blank"
                      variant="body2"
                      underline="hover"
                      sx={{ fontSize: "0.9rem", color: colorScheme.text }}
                    >
                      Portfolio
                    </Link>
                  </Box>
                )}
              </Stack>
            </Box>

            {!isSectionEmpty("skills") && (
              <Box sx={{ mb: 4 }}>
                <SectionTitle title="Skills" sectionName="skills" />
                <Stack spacing={2}>
                  {skills.map((category, index) => (
                    <Box key={category.id || index}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: colorScheme.secondary,
                          mb: 1,
                          ...pdfColorStyles,
                        }}
                      >
                        {category.name || "Skill Category"}
                      </Typography>
                      <Box
                        sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}
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
                                    bgcolor: colorScheme.primary,
                                    color: "white",
                                    fontWeight: 500,
                                    ...pdfColorStyles,
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

            {!isSectionEmpty("education") && (
              <Box>
                <SectionTitle title="Education" sectionName="education" />
                <Stack spacing={2}>
                  {education.map((edu, index) => (
                    <Box key={edu.id || index}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: colorScheme.secondary,
                          fontSize: "1rem",
                          ...pdfColorStyles,
                        }}
                      >
                        {edu.degree || "Degree"}{" "}
                        {edu.field && `in ${edu.field}`}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, mb: 0.5 }}
                      >
                        {edu.institution || "Institution Name"}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {edu.location && (
                          <Typography variant="caption" color="text.secondary">
                            {edu.location}
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            fontStyle: "italic",
                            color: colorScheme.primary,
                            ...pdfColorStyles,
                          }}
                        >
                          {formatDate(edu.startDate) || "Start Date"} -{" "}
                          {formatDate(edu.endDate) || "End Date"}
                        </Typography>
                      </Box>
                      {edu.description && (
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, fontSize: "0.8rem" }}
                        >
                          {edu.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          {personalInfo.summary && (
            <Box sx={{ mb: 5 }}>
              <SectionTitle title="Profile" sectionName="summary" />
              <Typography variant="body1">{personalInfo.summary}</Typography>
            </Box>
          )}

          {!isSectionEmpty("experience") && (
            <Box sx={{ mb: 5 }}>
              <SectionTitle title="Work Experience" sectionName="experience" />
              {experience.map((exp, index) => (
                <Box
                  key={exp.id || index}
                  sx={{ mb: index < experience.length - 1 ? 3 : 0 }}
                >
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
                        fontSize: "1.1rem",
                        ...pdfColorStyles,
                      }}
                    >
                      {exp.position || "Position Title"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: colorScheme.primary,
                        fontStyle: "italic",
                        ...pdfColorStyles,
                      }}
                    >
                      {formatDate(exp.startDate) || "Start Date"} -{" "}
                      {exp.current
                        ? "Present"
                        : formatDate(exp.endDate) || "End Date"}
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 500, mb: 1 }}
                  >
                    {exp.company || "Company Name"}{" "}
                    {exp.location && `• ${exp.location}`}
                  </Typography>
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
          )}

          {!isSectionEmpty("projects") && (
            <Box>
              <SectionTitle title="Projects" sectionName="projects" />
              {projects.map((project, index) => (
                <Box
                  key={project.id || index}
                  sx={{ mb: index < projects.length - 1 ? 3 : 0 }}
                >
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
                        fontSize: "1.1rem",
                        ...pdfColorStyles,
                      }}
                    >
                      {project.title || "Project Title"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: colorScheme.primary,
                        fontStyle: "italic",
                        ...pdfColorStyles,
                      }}
                    >
                      {formatDate(project.startDate) || "Start Date"} -{" "}
                      {project.current
                        ? "Present"
                        : formatDate(project.endDate) || "End Date"}
                    </Typography>
                  </Box>
                  {project.link && (
                    <Link
                      href={project.link}
                      target="_blank"
                      underline="hover"
                      variant="body2"
                      sx={{
                        mb: 1,
                        display: "block",
                        color: colorScheme.primary,
                        ...pdfColorStyles,
                      }}
                    >
                      {project.link}
                    </Link>
                  )}
                  {project.technologies && (
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", mb: 1 }}
                    >
                      Technologies: {project.technologies}
                    </Typography>
                  )}
                  {project.description && (
                    <Typography variant="body2">
                      {project.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SidebarTemplate;
