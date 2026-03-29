import {
  Box,
  Typography,
  Grid,
  Stack,
  Link,
  Chip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";

const dotSx = (colorScheme) => ({
  width: 14,
  height: 14,
  borderRadius: "50%",
  bgcolor: colorScheme.primary,
  boxShadow: `0 0 0 4px ${colorScheme.accent}`,
  flexShrink: 0,
  mt: 0.6,
});

const titleSx = (colorScheme) => ({
  fontSize: "0.88rem",
  fontWeight: 800,
  color: colorScheme.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  mb: 2,
});

export const TimelineTemplate = ({
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

  return (
    <Box
      sx={{
        fontFamily,
        color: "#172033",
        bgcolor: "#f8fafc",
        maxWidth: "980px",
        mx: "auto",
        p: { xs: 3, md: 5 },
        borderRadius: 2,
        boxShadow: "0 18px 38px rgba(15, 23, 42, 0.09)",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              height: "100%",
              p: 3,
              borderRadius: 2,
              background: `linear-gradient(180deg, ${colorScheme.secondary} 0%, ${colorScheme.primary} 100%)`,
              color: "#fff",
            }}
          >
            <Typography sx={{ fontSize: { xs: "2rem", md: "2.4rem" }, fontWeight: 800, lineHeight: 1.05 }}>
              {personalInfo.fullName || "Your Name"}
            </Typography>
            {personalInfo.jobTitle && (
              <Typography sx={{ mt: 1.1, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.88 }}>
                {personalInfo.jobTitle}
              </Typography>
            )}

            <Stack spacing={1.2} sx={{ mt: 3 }}>
              {personalInfo.email && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: "0.92rem" }}>{personalInfo.email}</Typography>
                </Box>
              )}
              {personalInfo.phone && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: "0.92rem" }}>{personalInfo.phone}</Typography>
                </Box>
              )}
              {personalInfo.location && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: "0.92rem" }}>{personalInfo.location}</Typography>
                </Box>
              )}
              {personalInfo.website && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LanguageIcon sx={{ fontSize: 18 }} />
                  <Link href={personalInfo.website} target="_blank" underline="hover" sx={{ color: "#fff", fontSize: "0.92rem" }}>
                    Website
                  </Link>
                </Box>
              )}
            </Stack>

            {personalInfo.summary && (
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.78, mb: 1.2 }}>
                  Profile
                </Typography>
                <Typography sx={{ lineHeight: 1.8, fontSize: "0.95rem", color: "rgba(255,255,255,0.92)" }}>
                  {personalInfo.summary}
                </Typography>
              </Box>
            )}

            {!isSectionEmpty("skills") && (
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.78, mb: 1.2 }}>
                  Skills
                </Typography>
                <Stack spacing={1.3}>
                  {skills.map((group, index) => (
                    <Box key={group.id || index}>
                      <Typography sx={{ fontWeight: 800, mb: 0.5 }}>{group.name || "Category"}</Typography>
                      <Typography sx={{ lineHeight: 1.7, color: "rgba(255,255,255,0.9)" }}>
                        {Array.isArray(group.skills) ? group.skills.filter(Boolean).join(" • ") : group.skills || "Add skills"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          {!isSectionEmpty("experience") && (
            <Box sx={{ mb: 4 }}>
              <Typography sx={titleSx(colorScheme)}>Career Timeline</Typography>
              <Stack spacing={2.2}>
                {experience.map((exp, index) => (
                  <Box key={exp.id || index} sx={{ display: "grid", gridTemplateColumns: "18px 1fr", columnGap: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Box sx={dotSx(colorScheme)} />
                      {index < experience.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: colorScheme.accent, mt: 1 }} />}
                    </Box>
                    <Box sx={{ pb: 0.6 }}>
                      <Typography sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.9rem" }}>
                        {formatDate(exp.startDate) || "Start Date"} - {exp.current ? "Present" : formatDate(exp.endDate) || "End Date"}
                      </Typography>
                      <Typography sx={{ mt: 0.3, fontWeight: 800, fontSize: "1.04rem" }}>
                        {exp.position || "Position Title"}
                      </Typography>
                      <Typography sx={{ mt: 0.25, color: colorScheme.primary, fontWeight: 700 }}>
                        {exp.company || "Company Name"}
                        {exp.location ? `, ${exp.location}` : ""}
                      </Typography>
                      {exp.description && <Typography sx={{ mt: 1, lineHeight: 1.75, color: "#334155" }}>{exp.description}</Typography>}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {!isSectionEmpty("projects") && (
            <Box sx={{ mb: 4 }}>
              <Typography sx={titleSx(colorScheme)}>Projects</Typography>
              <Stack spacing={2.2}>
                {projects.map((project, index) => (
                  <Box key={project.id || index}>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.02rem" }}>{project.title || "Project Title"}</Typography>
                    {project.description && <Typography sx={{ mt: 0.9, lineHeight: 1.75, color: "#334155" }}>{project.description}</Typography>}
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.1 }}>
                      {project.technologies && project.technologies.split(",").map((tech) =>
                        tech.trim() ? (
                          <Chip key={tech} label={tech.trim()} size="small" sx={{ bgcolor: colorScheme.accent, color: colorScheme.secondary, fontWeight: 700 }} />
                        ) : null
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {!isSectionEmpty("education") && (
                <Box>
                  <Typography sx={titleSx(colorScheme)}>Education</Typography>
                  <Stack spacing={1.7}>
                    {education.map((item, index) => (
                      <Box key={item.id || index}>
                        <Typography sx={{ fontWeight: 800 }}>{item.degree || "Degree"}</Typography>
                        <Typography sx={{ color: colorScheme.primary, fontWeight: 700, mt: 0.25 }}>
                          {item.institution || "Institution"}
                        </Typography>
                        <Typography sx={{ color: "#64748b", mt: 0.3 }}>
                          {formatDate(item.startDate) || "Start Date"} - {item.current ? "Present" : formatDate(item.endDate) || "End Date"}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {!isSectionEmpty("references") && (
                <Box>
                  <Typography sx={titleSx(colorScheme)}>References</Typography>
                  <Stack spacing={1.7}>
                    {references.map((reference, index) => (
                      <Box key={reference.id || index}>
                        <Typography sx={{ fontWeight: 800 }}>{reference.name || "Reference Name"}</Typography>
                        <Typography sx={{ color: colorScheme.primary, fontWeight: 700, mt: 0.25 }}>
                          {reference.position || "Role"}
                        </Typography>
                        <Typography sx={{ color: "#64748b" }}>{reference.company || "Company"}</Typography>
                        {reference.email && <Typography sx={{ color: "#64748b" }}>{reference.email}</Typography>}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};