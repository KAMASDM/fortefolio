import {
  Box,
  Typography,
  Link,
  Stack,
  IconButton,
  Chip,
  Avatar,
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
  PersonOutline as PersonIcon,
} from "@mui/icons-material";

export const EuropenUnionTemplate = ({
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

  const SectionTitle = ({ title, sectionName, isSidebar = false }) => (
    <Box
      sx={{
        fontSize: isSidebar ? "1rem" : "1.125rem",
        fontWeight: 600,
        color: "#312e81",
        borderBottom: isSidebar ? "none" : "2px solid #a5b4fc",
        paddingBottom: isSidebar ? "0" : "0.375rem",
        marginTop: isSidebar ? "1.5rem" : "1.5rem",
        marginBottom: isSidebar ? "0.75rem" : "1rem",
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
        backgroundColor: "#f4f4f5",
        maxWidth: "860px",
        borderRadius: "0.5rem",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "250px 1fr" },
        ...pdfColorStyles,
      }}
      className="resume-container"
    >
      <Box
        sx={{
          backgroundColor: "#e0e7ff",
          padding: "1rem",
          borderRadius: { xs: "0.5rem 0.5rem 0 0", md: "0.5rem 0 0 0.5rem" },
          ...pdfColorStyles,
        }}
        className="sidebar"
      >
        <Box
          sx={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "#cbd5e1",
            margin: "0 auto 1rem auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            ...pdfColorStyles,
          }}
          className="profile-photo-container"
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: "#cbd5e1",
              color: "#64748b",
              fontSize: "3rem",
            }}
          >
            {personalInfo.fullName ? (
              personalInfo.fullName.charAt(0)
            ) : (
              <PersonIcon sx={{ fontSize: "3rem" }} />
            )}
          </Avatar>
        </Box>

        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontSize: { xs: "1.875rem", md: "1.875rem" },
            fontWeight: 700,
            color: "#312e81",
            marginBottom: "0.25rem",
            textAlign: "left",
            ...pdfColorStyles,
          }}
          className="header-name"
        >
          {personalInfo.fullName || "Hayden Smith"}
        </Typography>
        {personalInfo.jobTitle && (
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.875rem",
              color: "#4f46e5",
              textAlign: "left",
              marginBottom: "1.5rem",
              ...pdfColorStyles,
            }}
          >
            {personalInfo.jobTitle}
          </Typography>
        )}

        <SectionTitle
          title="Personal Information"
          sectionName="personalInfo"
          isSidebar
        />
        <Stack spacing={1}>
          {personalInfo.fullName && (
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="contact-item"
            >
              <PersonIcon
                sx={{
                  marginRight: "0.75rem",
                  color: "#4f46e5",
                  width: "16px",
                  ...pdfColorStyles,
                }}
              />
              <Typography variant="body2" color="black">
                {personalInfo.fullName}
              </Typography>
            </Box>
          )}
          {personalInfo.location && (
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="contact-item"
            >
              <LocationIcon
                sx={{
                  marginRight: "0.75rem",
                  color: "#4f46e5",
                  width: "16px",
                  textAlign: "center",
                  ...pdfColorStyles,
                }}
              />
              <Typography variant="body2" color="black">
                {personalInfo.location}
              </Typography>
            </Box>
          )}
          {personalInfo.phone && (
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="contact-item"
            >
              <PhoneIcon
                sx={{
                  marginRight: "0.75rem",
                  color: "#4f46e5",
                  width: "16px",
                  textAlign: "center",
                  ...pdfColorStyles,
                }}
              />
              <Link
                href={`tel:${personalInfo.phone}`}
                target="_blank"
                sx={{
                  color: "#374151",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline", color: "#4f46e5" },
                }}
              >
                {personalInfo.phone}
              </Link>
            </Box>
          )}
          {personalInfo.email && (
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="contact-item"
            >
              <EmailIcon
                sx={{
                  marginRight: "0.75rem",
                  color: "#4f46e5",
                  width: "16px",
                  textAlign: "center",
                  ...pdfColorStyles,
                }}
              />
              <Link
                href={`mailto:${personalInfo.email}`}
                target="_blank"
                sx={{
                  color: "#374151",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline", color: "#4f46e5" },
                }}
              >
                {personalInfo.email}
              </Link>
            </Box>
          )}
          {personalInfo.linkedin && (
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="contact-item"
            >
              <LinkedInIcon
                sx={{
                  marginRight: "0.75rem",
                  color: "#4f46e5",
                  width: "16px",
                  textAlign: "center",
                  ...pdfColorStyles,
                }}
              />
              <Link
                href={personalInfo.linkedin}
                target="_blank"
                sx={{
                  color: "#374151",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline", color: "#4f46e5" },
                }}
              >
                linkedin.com/in/{personalInfo.linkedin.split("/").pop()}
              </Link>
            </Box>
          )}
          {personalInfo.github && (
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="contact-item"
            >
              <GitHubIcon
                sx={{
                  marginRight: "0.75rem",
                  color: "#4f46e5",
                  width: "16px",
                  textAlign: "center",
                  ...pdfColorStyles,
                }}
              />
              <Link
                href={personalInfo.github}
                target="_blank"
                sx={{
                  color: "#374151",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline", color: "#4f46e5" },
                }}
              >
                github.com/{personalInfo.github.split("/").pop()}
              </Link>
            </Box>
          )}
          {personalInfo.portfolio && (
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="contact-item"
            >
              <LanguageIcon
                sx={{
                  marginRight: "0.75rem",
                  color: "#4f46e5",
                  width: "16px",
                  textAlign: "center",
                  ...pdfColorStyles,
                }}
              />
              <Link
                href={personalInfo.portfolio}
                target="_blank"
                sx={{
                  color: "#374151",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline", color: "#4f46e5" },
                }}
              >
                {personalInfo.portfolio.replace(/^(https?:\/\/)?(www\.)?/, "")}
              </Link>
            </Box>
          )}
        </Stack>

        {!isSectionEmpty("skills") && (
          <>
            <SectionTitle title="Skills" sectionName="skills" isSidebar />
            <Stack spacing={1}>
              {skills.map((category, index) => (
                <Box key={category.id || index}>
                  {category.name && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "#312e81",
                        marginBottom: "0.25rem",
                        ...pdfColorStyles,
                      }}
                      className="skill-category"
                    >
                      {category.name}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {Array.isArray(category.skills) &&
                      category.skills.filter(Boolean).map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill.trim()}
                          size="small"
                          sx={{
                            backgroundColor: "#bfdbfe",
                            color: "#1e40af",
                            fontWeight: 500,
                            borderRadius: "0.25rem",
                            ...pdfColorStyles,
                          }}
                        />
                      ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          </>
        )}
      </Box>

      <Box
        sx={{
          padding: { xs: "1.5rem", md: "2rem 2.5rem" },
          borderTopRightRadius: { xs: 0, md: "0.5rem" },
          borderBottomRightRadius: { xs: 0, md: "0.5rem" },
          ...pdfColorStyles,
        }}
        className="main-content"
      >
        {personalInfo.summary && (
          <Box sx={{ marginBottom: "1.5rem" }}>
            <SectionTitle
              title="Professional Summary"
              sectionName="personalInfo"
            />
            <Typography
              variant="body2"
              sx={{ color: "#4b5563", lineHeight: "1.6" }}
            >
              {personalInfo.summary}
            </Typography>
          </Box>
        )}

        {!isSectionEmpty("experience") && (
          <Box sx={{ marginBottom: "1.5rem" }}>
            <SectionTitle title="Work Experience" sectionName="experience" />
            {experience.map((exp, index) => (
              <Box key={exp.id || index} sx={{ marginBottom: "1.5rem" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginBottom: "0.25rem",
                    ...pdfColorStyles,
                  }}
                  className="date-range"
                >
                  {formatDate(exp.startDate) || "Start Date"} –{" "}
                  {exp.current
                    ? "Present"
                    : formatDate(exp.endDate) || "End Date"}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1e293b", ...pdfColorStyles }}
                  className="job-title"
                >
                  {exp.position || "Position Title"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", marginBottom: "0.25rem" }}
                  className="company-name"
                >
                  {exp.company || "Company Name"}
                  {exp.location && `, ${exp.location}`}
                </Typography>
                {exp.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {exp.description}
                  </Typography>
                )}
                {Array.isArray(exp.responsibilities) &&
                  exp.responsibilities.filter(Boolean).length > 0 && (
                    <Box
                      component="ul"
                      sx={{
                        listStyleType: "disc",
                        pl: 2,
                        mt: 1,
                        color: "#4b5563",
                      }}
                      className="description-list"
                    >
                      {exp.responsibilities
                        .filter(Boolean)
                        .map((responsibility, idx) => (
                          <Typography
                            component="li"
                            variant="body2"
                            key={idx}
                            sx={{ marginBottom: "0.25rem" }}
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
                      sx={{
                        listStyleType: "disc",
                        pl: 2,
                        mt: 1,
                        color: "#4b5563",
                      }}
                      className="description-list"
                    >
                      {exp.responsibilities.split("\n").map(
                        (responsibility, idx) =>
                          responsibility.trim() && (
                            <Typography
                              component="li"
                              variant="body2"
                              key={idx}
                              sx={{ marginBottom: "0.25rem" }}
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

        {!isSectionEmpty("education") && (
          <Box sx={{ marginBottom: "1.5rem" }}>
            <SectionTitle
              title="Education and Training"
              sectionName="education"
            />
            {education.map((edu, index) => (
              <Box key={edu.id || index} sx={{ marginBottom: "1rem" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginBottom: "0.25rem",
                    ...pdfColorStyles,
                  }}
                  className="date-range"
                >
                  {formatDate(edu.startDate) || "Start Date"} –{" "}
                  {formatDate(edu.endDate) || "End Date"}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1e293b", ...pdfColorStyles }}
                  className="job-title"
                >
                  {edu.degree || "Degree"} {edu.field && ` / ${edu.field}`}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", marginBottom: "0.25rem" }}
                  className="company-name"
                >
                  {edu.institution || "Institution Name"}
                  {edu.location && `, ${edu.location}`}
                </Typography>
                {edu.description && (
                  <Typography variant="body2" sx={{ mt: 1, color: "#4b5563" }}>
                    {edu.description}
                  </Typography>
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
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginBottom: "0.25rem",
                    ...pdfColorStyles,
                  }}
                  className="date-range"
                >
                  {formatDate(project.startDate) || "Start Date"} –{" "}
                  {project.current
                    ? "Present"
                    : formatDate(project.endDate) || "End Date"}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1e293b", ...pdfColorStyles }}
                  className="job-title"
                >
                  {project.title || "Project Title"}
                </Typography>
                {project.link && (
                  <Link
                    href={project.link}
                    target="_blank"
                    underline="hover"
                    variant="body2"
                    sx={{
                      color: "#4f46e5",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {project.link}
                  </Link>
                )}
                {project.technologies && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: "#475569",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Technologies: {project.technologies}
                  </Typography>
                )}
                {project.description && (
                  <Typography variant="body2" sx={{ color: "#4b5563" }}>
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
                      <Typography variant="body2">
                        {reference.company}
                      </Typography>
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
    </Box>
  );
};

export default EuropenUnionTemplate;
