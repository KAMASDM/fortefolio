import {
  Box,
  Typography,
  Grid,
  Stack,
  Divider,
  Chip,
  Link,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";

const executiveSectionTitleSx = (colorScheme) => ({
  fontSize: "0.85rem",
  fontWeight: 800,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: colorScheme.primary,
  mb: 1.5,
});

const renderExecutiveContact = (icon, label, href) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
    {icon}
    {href ? (
      <Link
        href={href}
        target="_blank"
        underline="hover"
        sx={{ color: "rgba(255,255,255,0.94)", fontSize: "0.9rem", fontWeight: 500 }}
      >
        {label}
      </Link>
    ) : (
      <Typography sx={{ color: "rgba(255,255,255,0.94)", fontSize: "0.9rem", fontWeight: 500 }}>
        {label}
      </Typography>
    )}
  </Box>
);

export const ExecutiveTemplate = ({
  resumeData,
  formatDate,
  colorScheme,
  fontFamily,
  isSectionEmpty,
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
        fontFamily,
        color: "#0f172a",
        bgcolor: "#fff",
        maxWidth: "1000px",
        mx: "auto",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
        border: "1px solid rgba(148, 163, 184, 0.22)",
        ...pdfColorStyles,
      }}
    >
      <Box
        sx={{
          px: { xs: 3, md: 5 },
          py: { xs: 3, md: 4 },
          background: `linear-gradient(135deg, ${colorScheme.secondary} 0%, ${colorScheme.primary} 100%)`,
          color: "#fff",
          ...pdfColorStyles,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography sx={{ fontSize: { xs: "2rem", md: "2.8rem" }, fontWeight: 800, lineHeight: 1.05 }}>
              {personalInfo.fullName || "Your Name"}
            </Typography>
            {personalInfo.jobTitle && (
              <Typography sx={{ mt: 1, fontSize: "1rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.88 }}>
                {personalInfo.jobTitle}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={1.1}>
              {personalInfo.email && renderExecutiveContact(<EmailIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.92)" }} />, personalInfo.email, null)}
              {personalInfo.phone && renderExecutiveContact(<PhoneIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.92)" }} />, personalInfo.phone, null)}
              {personalInfo.location && renderExecutiveContact(<LocationIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.92)" }} />, personalInfo.location, null)}
              {personalInfo.linkedin && renderExecutiveContact(<LinkedInIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.92)" }} />, "LinkedIn", personalInfo.linkedin)}
              {personalInfo.github && renderExecutiveContact(<GitHubIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.92)" }} />, "GitHub", personalInfo.github)}
              {personalInfo.website && renderExecutiveContact(<LanguageIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.92)" }} />, "Website", personalInfo.website)}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 } }}>
        {personalInfo.summary && (
          <Box sx={{ mb: 4 }}>
            <Typography sx={executiveSectionTitleSx(colorScheme)}>Executive Profile</Typography>
            <Typography sx={{ fontSize: "0.98rem", lineHeight: 1.8, color: "#334155" }}>
              {personalInfo.summary}
            </Typography>
          </Box>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {!isSectionEmpty("experience") && (
              <Box sx={{ mb: 4 }}>
                <Typography sx={executiveSectionTitleSx(colorScheme)}>Experience</Typography>
                <Stack spacing={3}>
                  {experience.map((exp, index) => (
                    <Box key={exp.id || index}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                        <Box>
                          <Typography sx={{ fontSize: "1.08rem", fontWeight: 800, color: "#0f172a" }}>
                            {exp.position || "Position Title"}
                          </Typography>
                          <Typography sx={{ mt: 0.4, color: colorScheme.primary, fontWeight: 700 }}>
                            {exp.company || "Company Name"}
                            {exp.location ? `, ${exp.location}` : ""}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: "#475569", fontWeight: 600, whiteSpace: "nowrap" }}>
                          {formatDate(exp.startDate) || "Start Date"} - {exp.current ? "Present" : formatDate(exp.endDate) || "End Date"}
                        </Typography>
                      </Box>
                      {exp.description && (
                        <Typography sx={{ mt: 1.2, color: "#334155", lineHeight: 1.75 }}>
                          {exp.description}
                        </Typography>
                      )}
                      {typeof exp.responsibilities === "string" && exp.responsibilities.trim() && (
                        <Box component="ul" sx={{ pl: 2.3, mt: 1.2, mb: 0 }}>
                          {exp.responsibilities.split("\n").map((item, itemIndex) =>
                            item.trim() ? (
                              <Typography component="li" key={itemIndex} sx={{ mb: 0.7, color: "#334155", lineHeight: 1.65 }}>
                                {item}
                              </Typography>
                            ) : null
                          )}
                        </Box>
                      )}
                      {index < experience.length - 1 && <Divider sx={{ mt: 2.2 }} />}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {!isSectionEmpty("projects") && (
              <Box sx={{ mb: 4 }}>
                <Typography sx={executiveSectionTitleSx(colorScheme)}>Selected Projects</Typography>
                <Stack spacing={2.5}>
                  {projects.map((project, index) => (
                    <Box key={project.id || index}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", alignItems: "baseline" }}>
                        <Typography sx={{ fontSize: "1.02rem", fontWeight: 800 }}>{project.title || "Project Title"}</Typography>
                        {(project.liveLink || project.githubLink) && (
                          <Stack direction="row" spacing={1.2}>
                            {project.liveLink && <Link href={project.liveLink} target="_blank" underline="hover">Live Demo</Link>}
                            {project.githubLink && <Link href={project.githubLink} target="_blank" underline="hover">Source</Link>}
                          </Stack>
                        )}
                      </Box>
                      {project.description && (
                        <Typography sx={{ mt: 1, color: "#334155", lineHeight: 1.75 }}>
                          {project.description}
                        </Typography>
                      )}
                      {project.technologies && (
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.3 }}>
                          {project.technologies.split(",").map((tech) =>
                            tech.trim() ? (
                              <Chip
                                key={tech}
                                label={tech.trim()}
                                size="small"
                                sx={{
                                  bgcolor: colorScheme.accent,
                                  color: colorScheme.secondary,
                                  fontWeight: 700,
                                }}
                              />
                            ) : null
                          )}
                        </Stack>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            {!isSectionEmpty("skills") && (
              <Box sx={{ mb: 4 }}>
                <Typography sx={executiveSectionTitleSx(colorScheme)}>Core Skills</Typography>
                <Stack spacing={1.5}>
                  {skills.map((group, index) => (
                    <Box key={group.id || index}>
                      <Typography sx={{ fontWeight: 800, mb: 0.8 }}>{group.name || "Category"}</Typography>
                      <Typography sx={{ color: "#475569", lineHeight: 1.7 }}>
                        {Array.isArray(group.skills) ? group.skills.filter(Boolean).join(" • ") : group.skills || "Add skills"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {!isSectionEmpty("education") && (
              <Box sx={{ mb: 4 }}>
                <Typography sx={executiveSectionTitleSx(colorScheme)}>Education</Typography>
                <Stack spacing={2}>
                  {education.map((item, index) => (
                    <Box key={item.id || index}>
                      <Typography sx={{ fontWeight: 800 }}>{item.degree || "Degree"}</Typography>
                      <Typography sx={{ color: colorScheme.primary, fontWeight: 700, mt: 0.3 }}>
                        {item.institution || "Institution"}
                      </Typography>
                      <Typography sx={{ color: "#475569", mt: 0.4 }}>
                        {formatDate(item.startDate) || "Start Date"} - {item.current ? "Present" : formatDate(item.endDate) || "End Date"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {!isSectionEmpty("references") && (
              <Box>
                <Typography sx={executiveSectionTitleSx(colorScheme)}>References</Typography>
                <Stack spacing={1.5}>
                  {references.map((reference, index) => (
                    <Box key={reference.id || index}>
                      <Typography sx={{ fontWeight: 800 }}>{reference.name || "Reference Name"}</Typography>
                      <Typography sx={{ color: "#475569" }}>{reference.position || "Role"}</Typography>
                      <Typography sx={{ color: "#475569" }}>{reference.company || "Company"}</Typography>
                      {reference.email && <Typography sx={{ color: "#475569" }}>{reference.email}</Typography>}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};