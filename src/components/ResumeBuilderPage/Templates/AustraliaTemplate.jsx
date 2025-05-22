import {
  Box,
  Typography,
  Grid,
  Link,
  Stack,
  IconButton,
  Divider,
  Chip,
  Avatar, // Import Avatar for the profile image
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
  PersonOutline as PersonIcon, // For references section title
} from "@mui/icons-material";

export const AustraliaTemplate = ({
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
    references = [],
  } = resumeData;

  const pdfColorStyles = {
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
    colorAdjust: "exact",
  };

  const SectionTitle = ({ title, sectionName }) => (
    <Box
      sx={{
        fontSize: "1.25rem", // Tailwind text-xl
        fontWeight: 600, // Tailwind font-semibold
        color: "#047857", // Tailwind emerald-700
        borderBottom: "2px solid #6ee7b7", // Tailwind emerald-300
        paddingBottom: "0.5rem",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        ...pdfColorStyles,
      }}
    >
      {title}
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
        backgroundColor: "#f8fafc", // Tailwind gray-50
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "2.5rem",
        background: "white",
        borderRadius: "0.75rem", // Tailwind rounded-xl
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // Tailwind shadow-lg
        color: "#343a40", // Darker gray for main text
        ...pdfColorStyles,
      }}
      className="resume-container"
    >
      <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
        {/* Profile Photo */}
        {personalInfo.profilePhoto && ( // Assuming personalInfo might have a profilePhoto URL
          <Avatar
            src={personalInfo.profilePhoto}
            alt={personalInfo.fullName || "Profile Photo"}
            sx={{
              width: 100,
              height: 100,
              margin: "0 auto 1rem auto",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "2px solid #e0e0e0",
              ...pdfColorStyles,
            }}
          >
            {/* Fallback for no image or broken URL */}
            {!personalInfo.profilePhoto &&
              (personalInfo.fullName ? (
                personalInfo.fullName.charAt(0)
              ) : (
                <PersonIcon />
              ))}
          </Avatar>
        )}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.875rem", md: "2.25rem" }, // Tailwind text-3xl / text-4xl
            fontWeight: 700, // Tailwind font-bold
            color: "#065f46", // Tailwind emerald-800
            ...pdfColorStyles,
          }}
          className="header-name"
        >
          {personalInfo.fullName || "Hayden Smith"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginTop: "0.5rem",
            fontSize: "0.875rem", // Tailwind text-sm
            color: "#374151", // Tailwind gray-700
            display: { xs: "block", sm: "flex" },
            flexWrap: "wrap",
            justifyContent: "center",
            "& span": {
              display: { xs: "block", sm: "inline" },
              marginBottom: { xs: "0.25rem", sm: 0 },
            },
            "& span:not(:last-child)::after": {
              content: { xs: "''", sm: "' | '" },
            },
            "& a": {
              color: "#059669", // Tailwind emerald-600
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            ...pdfColorStyles,
          }}
          className="contact-info"
        >
          {personalInfo.location && (
            <Box component="span">{personalInfo.location}</Box>
          )}
          {personalInfo.phone && (
            <Box component="span">{personalInfo.phone}</Box>
          )}
          {personalInfo.email && (
            <Box component="span">
              <Link href={`mailto:${personalInfo.email}`} target="_blank">
                {personalInfo.email}
              </Link>
            </Box>
          )}
          {personalInfo.linkedin && (
            <Box component="span">
              {" "}
              <Link href={personalInfo.linkedin} target="_blank">
                LinkedIn
              </Link>
            </Box>
          )}
          {personalInfo.github && (
            <Box component="span">
              {" "}
              <Link href={personalInfo.github} target="_blank">
                GitHub
              </Link>
            </Box>
          )}
          {personalInfo.portfolio && (
            <Box component="span">
              <Link href={personalInfo.portfolio} target="_blank">
                Portfolio
              </Link>
            </Box>
          )}
          {personalInfo.website && (
            <Box component="span">
              {" "}
              <Link href={personalInfo.website} target="_blank">
                Website
              </Link>
            </Box>
          )}
        </Typography>
      </Box>

      {personalInfo.summary && (
        <Box sx={{ marginBottom: "1.5rem" }}>
          <SectionTitle title="Career Objective" sectionName="personalInfo" />
          <Typography
            variant="body2"
            sx={{
              color: "#4b5563", // Tailwind gray-700
              lineHeight: "1.6",
              ...pdfColorStyles,
            }}
          >
            {personalInfo.summary}
          </Typography>
        </Box>
      )}

      {!isSectionEmpty("skills") && (
        <Box sx={{ marginBottom: "1.5rem" }}>
          <SectionTitle title="Key Skills" sectionName="skills" />
          <Stack
            component="ul"
            spacing={0.5}
            sx={{ listStyleType: "disc", pl: 2, color: "#4b5563" }}
          >
            {skills.map((category, index) => (
              <Box key={category.id || index}>
                {category.name && (
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mt: 1, mb: 0.5 }}
                  >
                    {category.name}:
                  </Typography>
                )}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {Array.isArray(category.skills) &&
                    category.skills.filter(Boolean).map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill.trim()}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: colorScheme.primary,
                          color: colorScheme.text,
                          ...pdfColorStyles,
                        }}
                      />
                    ))}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {!isSectionEmpty("education") && (
        <Box sx={{ marginBottom: "1.5rem" }}>
          <SectionTitle title="Education" sectionName="education" />
          {education.map((edu, index) => (
            <Box key={edu.id || index} sx={{ marginBottom: "1rem" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1f2937", // Tailwind gray-800
                  ...pdfColorStyles,
                }}
                className="job-title"
              >
                {edu.institution || "Institution Name"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#4b5563", fontSize: "0.875rem" }}
              >
                {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  color: "#6b7280", // Tailwind gray-500
                  marginTop: "0.25rem",
                  ...pdfColorStyles,
                }}
                className="date-range"
              >
                {formatDate(edu.startDate) || "Start Date"} -{" "}
                {formatDate(edu.endDate) || "End Date"}
              </Typography>
              {edu.location && (
                <Typography
                  variant="body2"
                  sx={{ color: "#4b5563", fontSize: "0.875rem" }}
                >
                  {edu.location}
                </Typography>
              )}
              {edu.description && (
                <Typography variant="body2" sx={{ mt: 1, color: "#4b5563" }}>
                  {edu.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {!isSectionEmpty("experience") && (
        <Box sx={{ marginBottom: "1.5rem" }}>
          <SectionTitle title="Work Experience" sectionName="experience" />
          {experience.map((exp, index) => (
            <Box key={exp.id || index} sx={{ marginBottom: "1rem" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1f2937", // Tailwind gray-800
                  ...pdfColorStyles,
                }}
                className="job-title"
              >
                {exp.position || "Position Title"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  color: "#4b5563", // Tailwind gray-600
                  ...pdfColorStyles,
                }}
                className="company-name"
              >
                {exp.company || "Company Name"}
                {exp.location && ` - ${exp.location}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  color: "#6b7280", // Tailwind gray-500
                  marginTop: "0.25rem",
                  ...pdfColorStyles,
                }}
                className="date-range"
              >
                {formatDate(exp.startDate) || "Start Date"} -{" "}
                {exp.current
                  ? "Present"
                  : formatDate(exp.endDate) || "End Date"}
              </Typography>
              {exp.description && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {exp.description}
                </Typography>
              )}
              {Array.isArray(exp.responsibilities) &&
                exp.responsibilities.filter(Boolean).length > 0 && (
                  <Box
                    component="ul"
                    sx={{ listStyleType: "disc", pl: 2, mt: 1 }}
                  >
                    {exp.responsibilities
                      .filter(Boolean)
                      .map((responsibility, idx) => (
                        <Typography
                          component="li"
                          variant="body2"
                          key={idx}
                          sx={{ marginBottom: "0.25rem", color: "#4b5563" }}
                        >
                          {responsibility}
                        </Typography>
                      ))}
                  </Box>
                )}
              {typeof exp.responsibilities === "string" &&
                exp.responsibilities.trim() && (
                  <Box
                    component="ul"
                    sx={{ listStyleType: "disc", pl: 2, mt: 1 }}
                  >
                    {exp.responsibilities.split("\n").map(
                      (responsibility, idx) =>
                        responsibility.trim() && (
                          <Typography
                            component="li"
                            variant="body2"
                            key={idx}
                            sx={{ marginBottom: "0.25rem", color: "#4b5563" }}
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
        <Box sx={{ marginBottom: "1.5rem" }}>
          <SectionTitle title="Projects" sectionName="projects" />
          {projects.map((project, index) => (
            <Box key={project.id || index} sx={{ marginBottom: "1rem" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1f2937", // Tailwind gray-800
                  ...pdfColorStyles,
                }}
              >
                {project.title || "Project Title"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  color: "#6b7280", // Tailwind gray-500
                  marginTop: "0.25rem",
                  ...pdfColorStyles,
                }}
                className="date-range"
              >
                {formatDate(project.startDate) || "Start Date"} -{" "}
                {project.current
                  ? "Present"
                  : formatDate(project.endDate) || "End Date"}
              </Typography>
              {project.link && (
                <Link
                  href={project.link}
                  target="_blank"
                  underline="hover"
                  variant="body2"
                  sx={{
                    color: "#059669", // Tailwind emerald-600
                    display: "block",
                    mt: 0.5,
                  }}
                >
                  {project.link}
                </Link>
              )}
              {project.technologies && (
                <Typography
                  variant="body2"
                  sx={{ fontStyle: "italic", mt: 0.5 }}
                >
                  Technologies: {project.technologies}
                </Typography>
              )}
              {project.description && (
                <Typography variant="body2" sx={{ mt: 0.5, color: "#4b5563" }}>
                  {project.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {references.length > 0 && (
        <Box>
          <SectionTitle title="References" sectionName="references" />
          {references.length > 0 ? (
            <Stack spacing={1} sx={{ color: "#4b5563" }}>
              {references.map((reference, index) => (
                <Box key={reference.id || index}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {reference.name}
                  </Typography>
                  {reference.position && (
                    <Typography variant="body2">
                      {reference.position}
                    </Typography>
                  )}
                  {reference.company && (
                    <Typography variant="body2">{reference.company}</Typography>
                  )}
                  {reference.email && (
                    <Typography variant="body2">
                      Email: {reference.email}
                    </Typography>
                  )}
                  {reference.contact && (
                    <Typography variant="body2">
                      Phone: {reference.contact}
                    </Typography>
                  )}
                  {reference.relationship && (
                    <Typography variant="body2">
                      Relationship: {reference.relationship}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "#4b5563", fontSize: "0.875rem" }}
            >
              Available upon request.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AustraliaTemplate;
