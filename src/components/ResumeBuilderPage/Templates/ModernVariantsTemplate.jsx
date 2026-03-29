import { Box, Typography, Grid, Stack, Chip, Divider, Link } from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";

const variantStyles = {
  modernNeo: {
    surface: "#f8fafc",
    card: "#ffffff",
    border: "rgba(15, 23, 42, 0.08)",
    titleCase: "uppercase",
    titleSpacing: "0.16em",
    strip: "linear-gradient(120deg, #0ea5e9 0%, #0284c7 100%)",
    radius: 2,
    shadow: "0 16px 36px rgba(15, 23, 42, 0.10)",
  },
  modernSlate: {
    surface: "#f3f4f6",
    card: "#ffffff",
    border: "rgba(55, 65, 81, 0.14)",
    titleCase: "none",
    titleSpacing: "0.08em",
    strip: "linear-gradient(120deg, #334155 0%, #1e293b 100%)",
    radius: 1.5,
    shadow: "0 14px 30px rgba(30, 41, 59, 0.14)",
  },
  modernAurora: {
    surface: "#f5f3ff",
    card: "#ffffff",
    border: "rgba(124, 58, 237, 0.16)",
    titleCase: "uppercase",
    titleSpacing: "0.2em",
    strip: "linear-gradient(120deg, #7c3aed 0%, #06b6d4 100%)",
    radius: 2.5,
    shadow: "0 16px 34px rgba(91, 33, 182, 0.16)",
  },
  modernMetro: {
    surface: "#f8fafc",
    card: "#ffffff",
    border: "rgba(37, 99, 235, 0.16)",
    titleCase: "uppercase",
    titleSpacing: "0.12em",
    strip: "linear-gradient(120deg, #2563eb 0%, #1d4ed8 100%)",
    radius: 0.8,
    shadow: "0 14px 28px rgba(30, 64, 175, 0.16)",
  },
  modernZen: {
    surface: "#f0fdf4",
    card: "#ffffff",
    border: "rgba(22, 163, 74, 0.16)",
    titleCase: "none",
    titleSpacing: "0.06em",
    strip: "linear-gradient(120deg, #16a34a 0%, #0d9488 100%)",
    radius: 3,
    shadow: "0 16px 32px rgba(5, 150, 105, 0.16)",
  },
  modernNova: {
    surface: "#fff7ed",
    card: "#ffffff",
    border: "rgba(249, 115, 22, 0.18)",
    titleCase: "uppercase",
    titleSpacing: "0.14em",
    strip: "linear-gradient(120deg, #f97316 0%, #ea580c 100%)",
    radius: 2,
    shadow: "0 16px 34px rgba(194, 65, 12, 0.16)",
  },
  modernEdge: {
    surface: "#f5f3ff",
    card: "#ffffff",
    border: "rgba(99, 102, 241, 0.2)",
    titleCase: "uppercase",
    titleSpacing: "0.2em",
    strip: "linear-gradient(120deg, #4338ca 0%, #7c3aed 100%)",
    radius: 0.5,
    shadow: "0 18px 36px rgba(67, 56, 202, 0.2)",
  },
  modernPrism: {
    surface: "#ecfeff",
    card: "#ffffff",
    border: "rgba(6, 182, 212, 0.16)",
    titleCase: "none",
    titleSpacing: "0.1em",
    strip: "linear-gradient(120deg, #06b6d4 0%, #0f766e 100%)",
    radius: 2,
    shadow: "0 16px 32px rgba(14, 116, 144, 0.16)",
  },
  modernSummit: {
    surface: "#eff6ff",
    card: "#ffffff",
    border: "rgba(30, 64, 175, 0.16)",
    titleCase: "uppercase",
    titleSpacing: "0.1em",
    strip: "linear-gradient(120deg, #1e40af 0%, #3730a3 100%)",
    radius: 1.8,
    shadow: "0 16px 30px rgba(30, 64, 175, 0.14)",
  },
  modernFlow: {
    surface: "#faf5ff",
    card: "#ffffff",
    border: "rgba(168, 85, 247, 0.16)",
    titleCase: "none",
    titleSpacing: "0.08em",
    strip: "linear-gradient(120deg, #a855f7 0%, #ec4899 100%)",
    radius: 2.8,
    shadow: "0 16px 34px rgba(147, 51, 234, 0.16)",
  },
};

const contactEntries = (personalInfo) => [
  { key: "email", value: personalInfo.email, icon: <EmailIcon fontSize="small" /> },
  { key: "phone", value: personalInfo.phone, icon: <PhoneIcon fontSize="small" /> },
  { key: "location", value: personalInfo.location, icon: <LocationIcon fontSize="small" /> },
  {
    key: "linkedin",
    value: personalInfo.linkedin,
    label: "LinkedIn",
    icon: <LinkedInIcon fontSize="small" />,
  },
  {
    key: "github",
    value: personalInfo.github,
    label: "GitHub",
    icon: <GitHubIcon fontSize="small" />,
  },
  {
    key: "website",
    value: personalInfo.website,
    label: "Website",
    icon: <LanguageIcon fontSize="small" />,
  },
].filter((item) => item.value);

const SectionTitle = ({ title, colorScheme, styleSet }) => (
  <Typography
    sx={{
      fontSize: "0.82rem",
      fontWeight: 800,
      textTransform: styleSet.titleCase,
      letterSpacing: styleSet.titleSpacing,
      color: colorScheme.primary,
      mb: 1.2,
    }}
  >
    {title}
  </Typography>
);

const ModernVariantTemplate = ({
  variantKey,
  resumeData,
  formatDate,
  colorScheme,
  fontFamily,
  isSectionEmpty,
}) => {
  const styleSet = variantStyles[variantKey] || variantStyles.modernNeo;
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
        color: "#1e293b",
        bgcolor: styleSet.surface,
        maxWidth: "1000px",
        mx: "auto",
        borderRadius: styleSet.radius,
        border: `1px solid ${styleSet.border}`,
        boxShadow: styleSet.shadow,
        overflow: "hidden",
      }}
    >
      <Box sx={{ background: styleSet.strip, color: "#fff", px: { xs: 3, md: 4 }, py: { xs: 2.8, md: 3.3 } }}>
        <Typography sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 800, lineHeight: 1.05 }}>
          {personalInfo.fullName || "Your Name"}
        </Typography>
        {personalInfo.jobTitle && (
          <Typography sx={{ mt: 1, fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.92 }}>
            {personalInfo.jobTitle}
          </Typography>
        )}

        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2.2} sx={{ mt: 2 }}>
          {contactEntries(personalInfo).map((entry) => (
            <Box key={entry.key} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <Box sx={{ display: "flex", alignItems: "center", opacity: 0.94 }}>{entry.icon}</Box>
              {entry.key === "linkedin" || entry.key === "github" || entry.key === "website" ? (
                <Link href={entry.value} target="_blank" underline="hover" sx={{ color: "#fff", fontSize: "0.88rem", fontWeight: 600 }}>
                  {entry.label}
                </Link>
              ) : (
                <Typography sx={{ fontSize: "0.88rem", fontWeight: 600 }}>{entry.value}</Typography>
              )}
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: styleSet.card }}>
        {personalInfo.summary && (
          <Box sx={{ mb: 3.2 }}>
            <SectionTitle title="Profile" colorScheme={colorScheme} styleSet={styleSet} />
            <Typography sx={{ color: "#334155", lineHeight: 1.75 }}>{personalInfo.summary}</Typography>
          </Box>
        )}

        <Grid container spacing={3.5}>
          <Grid item xs={12} md={8}>
            {!isSectionEmpty("experience") && (
              <Box sx={{ mb: 3.2 }}>
                <SectionTitle title="Experience" colorScheme={colorScheme} styleSet={styleSet} />
                <Stack spacing={2.2}>
                  {experience.map((exp, index) => (
                    <Box key={exp.id || index}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: "1.02rem", color: "#0f172a" }}>
                            {exp.position || "Position Title"}
                          </Typography>
                          <Typography sx={{ mt: 0.25, color: colorScheme.primary, fontWeight: 700 }}>
                            {exp.company || "Company Name"}
                            {exp.location ? `, ${exp.location}` : ""}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>
                          {formatDate(exp.startDate) || "Start Date"} - {exp.current ? "Present" : formatDate(exp.endDate) || "End Date"}
                        </Typography>
                      </Box>
                      {exp.description && (
                        <Typography sx={{ mt: 0.9, color: "#334155", lineHeight: 1.72 }}>{exp.description}</Typography>
                      )}
                      {typeof exp.responsibilities === "string" && exp.responsibilities.trim() && (
                        <Box component="ul" sx={{ pl: 2.2, mt: 0.9, mb: 0 }}>
                          {exp.responsibilities.split("\n").map((line, lineIndex) =>
                            line.trim() ? (
                              <Typography component="li" key={lineIndex} sx={{ mb: 0.5, color: "#334155", lineHeight: 1.65 }}>
                                {line}
                              </Typography>
                            ) : null
                          )}
                        </Box>
                      )}
                      {index < experience.length - 1 && <Divider sx={{ mt: 1.7 }} />}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {!isSectionEmpty("projects") && (
              <Box>
                <SectionTitle title="Projects" colorScheme={colorScheme} styleSet={styleSet} />
                <Stack spacing={1.8}>
                  {projects.map((project, index) => (
                    <Box key={project.id || index}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem" }}>{project.title || "Project Title"}</Typography>
                      {project.description && (
                        <Typography sx={{ mt: 0.7, color: "#334155", lineHeight: 1.7 }}>{project.description}</Typography>
                      )}
                      {project.technologies && (
                        <Stack direction="row" spacing={0.9} useFlexGap flexWrap="wrap" sx={{ mt: 0.9 }}>
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
              <Box sx={{ mb: 3 }}>
                <SectionTitle title="Skills" colorScheme={colorScheme} styleSet={styleSet} />
                <Stack spacing={1.2}>
                  {skills.map((group, index) => (
                    <Box key={group.id || index}>
                      <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>{group.name || "Category"}</Typography>
                      <Typography sx={{ mt: 0.3, color: "#475569", lineHeight: 1.65 }}>
                        {Array.isArray(group.skills) ? group.skills.filter(Boolean).join(" • ") : group.skills || "Add skills"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {!isSectionEmpty("education") && (
              <Box sx={{ mb: 3 }}>
                <SectionTitle title="Education" colorScheme={colorScheme} styleSet={styleSet} />
                <Stack spacing={1.4}>
                  {education.map((edu, index) => (
                    <Box key={edu.id || index}>
                      <Typography sx={{ fontWeight: 800 }}>{edu.degree || "Degree"}</Typography>
                      <Typography sx={{ mt: 0.2, color: colorScheme.primary, fontWeight: 700 }}>
                        {edu.institution || "Institution"}
                      </Typography>
                      <Typography sx={{ mt: 0.2, color: "#64748b" }}>
                        {formatDate(edu.startDate) || "Start Date"} - {edu.current ? "Present" : formatDate(edu.endDate) || "End Date"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {!isSectionEmpty("references") && (
              <Box>
                <SectionTitle title="References" colorScheme={colorScheme} styleSet={styleSet} />
                <Stack spacing={1.2}>
                  {references.map((reference, index) => (
                    <Box key={reference.id || index}>
                      <Typography sx={{ fontWeight: 800 }}>{reference.name || "Reference Name"}</Typography>
                      <Typography sx={{ color: "#64748b" }}>{reference.position || "Role"}</Typography>
                      <Typography sx={{ color: "#64748b" }}>{reference.company || "Company"}</Typography>
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

export const ModernNeoTemplate = (props) => <ModernVariantTemplate {...props} variantKey="modernNeo" />;
export const ModernSlateTemplate = (props) => <ModernVariantTemplate {...props} variantKey="modernSlate" />;
export const ModernAuroraTemplate = (props) => <ModernVariantTemplate {...props} variantKey="modernAurora" />;
export const ModernMetroTemplate = (props) => <ModernVariantTemplate {...props} variantKey="modernMetro" />;
export const ModernZenTemplate = (props) => <ModernVariantTemplate {...props} variantKey="modernZen" />;
export const ModernNovaTemplate = (props) => <ModernVariantTemplate {...props} variantKey="modernNova" />;
export const ModernEdgeTemplate = (props) => <ModernVariantTemplate {...props} variantKey="modernEdge" />;
export const ModernPrismTemplate = (props) => <ModernVariantTemplate {...props} variantKey="modernPrism" />;
export const ModernSummitTemplate = (props) => <ModernVariantTemplate {...props} variantKey="modernSummit" />;
export const ModernFlowTemplate = (props) => <ModernVariantTemplate {...props} variantKey="modernFlow" />;
