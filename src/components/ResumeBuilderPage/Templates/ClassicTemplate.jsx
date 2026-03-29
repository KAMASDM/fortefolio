import {
  Box,
  Typography,
  Stack,
  Divider,
  Link,
  Grid,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";

const contactItems = (personalInfo) => [
  { key: "email", label: personalInfo.email, icon: EmailIcon, href: personalInfo.email ? `mailto:${personalInfo.email}` : null },
  { key: "phone", label: personalInfo.phone, icon: PhoneIcon },
  { key: "location", label: personalInfo.location, icon: LocationIcon },
  { key: "linkedin", label: personalInfo.linkedin ? "LinkedIn" : "", icon: LinkedInIcon, href: personalInfo.linkedin },
  { key: "github", label: personalInfo.github ? "GitHub" : "", icon: GitHubIcon, href: personalInfo.github },
  { key: "website", label: personalInfo.website ? "Website" : "", icon: LanguageIcon, href: personalInfo.website },
].filter((item) => item.label);

const sectionTitleSx = (colorScheme) => ({
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: "1.45rem",
  fontWeight: 700,
  color: colorScheme.secondary,
  letterSpacing: "0.04em",
});

export const ClassicTemplate = ({
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
        color: "#1f2937",
        bgcolor: "#fffdf9",
        maxWidth: "940px",
        mx: "auto",
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 5 },
        border: "1px solid rgba(146, 120, 77, 0.18)",
        boxShadow: "0 16px 36px rgba(41, 37, 36, 0.08)",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "2.5rem", md: "3.2rem" },
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1,
          }}
        >
          {personalInfo.fullName || "Your Name"}
        </Typography>
        {personalInfo.jobTitle && (
          <Typography sx={{ mt: 1.2, color: colorScheme.primary, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {personalInfo.jobTitle}
          </Typography>
        )}
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" justifyContent="center" sx={{ mt: 2.2 }}>
          {contactItems(personalInfo).map(({ key, label, icon: Icon, href }) => (
            <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <Icon sx={{ fontSize: 16, color: colorScheme.primary }} />
              {href ? (
                <Link href={href} target="_blank" underline="hover" sx={{ color: "#374151", fontSize: "0.92rem" }}>
                  {label}
                </Link>
              ) : (
                <Typography sx={{ color: "#374151", fontSize: "0.92rem" }}>{label}</Typography>
              )}
            </Box>
          ))}
        </Stack>
      </Box>

      {personalInfo.summary && (
        <Box sx={{ mb: 4 }}>
          <Divider sx={{ borderColor: "rgba(146, 120, 77, 0.28)", mb: 1.4 }} />
          <Typography sx={sectionTitleSx(colorScheme)}>Profile</Typography>
          <Typography sx={{ mt: 1.1, lineHeight: 1.9, color: "#374151" }}>
            {personalInfo.summary}
          </Typography>
        </Box>
      )}

      {!isSectionEmpty("experience") && (
        <Box sx={{ mb: 4 }}>
          <Divider sx={{ borderColor: "rgba(146, 120, 77, 0.28)", mb: 1.4 }} />
          <Typography sx={sectionTitleSx(colorScheme)}>Professional Experience</Typography>
          <Stack spacing={2.8} sx={{ mt: 1.4 }}>
            {experience.map((exp, index) => (
              <Box key={exp.id || index}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.02rem" }}>
                      {exp.position || "Position Title"}
                    </Typography>
                    <Typography sx={{ mt: 0.35, color: colorScheme.primary, fontWeight: 700 }}>
                      {exp.company || "Company Name"}
                      {exp.location ? ` | ${exp.location}` : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ textAlign: { xs: "left", md: "right" }, color: "#6b7280", fontWeight: 600 }}>
                      {formatDate(exp.startDate) || "Start Date"} - {exp.current ? "Present" : formatDate(exp.endDate) || "End Date"}
                    </Typography>
                  </Grid>
                </Grid>
                {exp.description && (
                  <Typography sx={{ mt: 1.1, lineHeight: 1.8, color: "#374151" }}>{exp.description}</Typography>
                )}
                {typeof exp.responsibilities === "string" && exp.responsibilities.trim() && (
                  <Box component="ul" sx={{ pl: 2.2, mt: 1.1, mb: 0 }}>
                    {exp.responsibilities.split("\n").map((line, lineIndex) =>
                      line.trim() ? (
                        <Typography component="li" key={lineIndex} sx={{ mb: 0.65, lineHeight: 1.7, color: "#374151" }}>
                          {line}
                        </Typography>
                      ) : null
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {!isSectionEmpty("education") && (
            <Box sx={{ mb: 4 }}>
              <Divider sx={{ borderColor: "rgba(146, 120, 77, 0.28)", mb: 1.4 }} />
              <Typography sx={sectionTitleSx(colorScheme)}>Education</Typography>
              <Stack spacing={2} sx={{ mt: 1.4 }}>
                {education.map((item, index) => (
                  <Box key={item.id || index}>
                    <Typography sx={{ fontWeight: 800 }}>{item.degree || "Degree"}</Typography>
                    <Typography sx={{ color: colorScheme.primary, fontWeight: 700, mt: 0.3 }}>
                      {item.institution || "Institution"}
                    </Typography>
                    <Typography sx={{ color: "#6b7280", mt: 0.35 }}>
                      {formatDate(item.startDate) || "Start Date"} - {item.current ? "Present" : formatDate(item.endDate) || "End Date"}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {!isSectionEmpty("skills") && (
            <Box>
              <Divider sx={{ borderColor: "rgba(146, 120, 77, 0.28)", mb: 1.4 }} />
              <Typography sx={sectionTitleSx(colorScheme)}>Areas of Expertise</Typography>
              <Stack spacing={1.25} sx={{ mt: 1.4 }}>
                {skills.map((group, index) => (
                  <Typography key={group.id || index} sx={{ lineHeight: 1.8, color: "#374151" }}>
                    <Box component="span" sx={{ fontWeight: 800, color: "#111827" }}>
                      {group.name || "Category"}:
                    </Box>{" "}
                    {Array.isArray(group.skills) ? group.skills.filter(Boolean).join(", ") : group.skills || "Add skills"}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {!isSectionEmpty("projects") && (
            <Box sx={{ mb: 4 }}>
              <Divider sx={{ borderColor: "rgba(146, 120, 77, 0.28)", mb: 1.4 }} />
              <Typography sx={sectionTitleSx(colorScheme)}>Projects</Typography>
              <Stack spacing={2.2} sx={{ mt: 1.4 }}>
                {projects.map((project, index) => (
                  <Box key={project.id || index}>
                    <Typography sx={{ fontWeight: 800 }}>{project.title || "Project Title"}</Typography>
                    {project.description && (
                      <Typography sx={{ mt: 0.75, lineHeight: 1.75, color: "#374151" }}>
                        {project.description}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1.4} sx={{ mt: 0.8 }}>
                      {project.liveLink && <Link href={project.liveLink} target="_blank" underline="hover">Live Demo</Link>}
                      {project.githubLink && <Link href={project.githubLink} target="_blank" underline="hover">Source</Link>}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {!isSectionEmpty("references") && (
            <Box>
              <Divider sx={{ borderColor: "rgba(146, 120, 77, 0.28)", mb: 1.4 }} />
              <Typography sx={sectionTitleSx(colorScheme)}>References</Typography>
              <Stack spacing={1.8} sx={{ mt: 1.4 }}>
                {references.map((reference, index) => (
                  <Box key={reference.id || index}>
                    <Typography sx={{ fontWeight: 800 }}>{reference.name || "Reference Name"}</Typography>
                    <Typography sx={{ color: colorScheme.primary, fontWeight: 700, mt: 0.25 }}>
                      {reference.position || "Role"}
                    </Typography>
                    <Typography sx={{ color: "#6b7280" }}>{reference.company || "Company"}</Typography>
                    {reference.email && <Typography sx={{ color: "#6b7280" }}>{reference.email}</Typography>}
                    {reference.phone && <Typography sx={{ color: "#6b7280" }}>{reference.phone}</Typography>}
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