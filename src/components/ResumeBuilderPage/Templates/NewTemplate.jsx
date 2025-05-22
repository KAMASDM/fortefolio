import {
  Box,
  Typography,
  Grid,
  Link,
  Stack,
  IconButton,
  Divider,
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
  Work as WorkIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";

export const EuropassTemplate = ({
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

  // Enhanced PDF styling with explicit print styling
  const pdfStyles = {
    container: {
      // Ensure the page breaks are controlled properly
      pageBreakInside: "avoid",
      printColorAdjust: "exact",
      WebkitPrintColorAdjust: "exact",
      colorAdjust: "exact",
      // Set a fixed height for PDF export to prevent unexpected page breaks
      "@media print": {
        maxHeight: "1050px", // Standard A4 height minus margins
        overflow: "hidden",
      },
    },
    section: {
      // Keep sections together
      pageBreakInside: "avoid",
      breakInside: "avoid",
    },
    item: {
      // Keep individual items (like job entries) together
      pageBreakInside: "avoid",
      breakInside: "avoid",
    },
  };

  const SectionTitle = ({
    title,
    sectionName,
    isSidebar = false,
    icon: IconComponent,
  }) => (
    <Box
      sx={{
        fontSize: isSidebar ? "1.125rem" : "1.375rem",
        fontWeight: isSidebar ? 500 : 600,
        color: isSidebar ? "#ffffff" : "#185a9d",
        paddingBottom: isSidebar ? "0.375rem" : "0.5rem",
        marginTop: isSidebar ? "2rem" : "2rem",
        marginBottom: isSidebar ? "1rem" : "1.5rem",
        borderBottom: isSidebar
          ? "1px solid rgba(255,255,255,0.3)"
          : "2px solid #43cea2",
        display: "flex",
        alignItems: "center",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
        // Prevent page breaks right after section titles
        pageBreakAfter: "avoid",
        breakAfter: "avoid",
      }}
    >
      {IconComponent && (
        <IconComponent
          sx={{ mr: "0.75rem", fontSize: isSidebar ? "1rem" : "1.25rem" }}
        />
      )}
      {title}
      <IconButton
        size="small"
        onClick={() => toggleStarSection(sectionName)}
        sx={{
          ml: 1,
          color: isSidebar ? "rgba(255,255,255,0.7)" : colorScheme.primary,
        }}
      >
        {starredSections.includes(sectionName) ? (
          <StarIcon
            fontSize="small"
            sx={{
              color: isSidebar ? "white" : colorScheme.primary,
              printColorAdjust: "exact",
              WebkitPrintColorAdjust: "exact",
            }}
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
        backgroundColor: "#f8f9fa",
        maxWidth: "840px",
        background: "#ffffff",
        borderRadius: "0.75rem",
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.15)",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
        overflow: "hidden",
        color: "#343a40",
        // PDF-specific styles for proper printing
        "@media print": {
          boxShadow: "none",
          margin: 0,
          width: "100%",
          maxWidth: "100%",
          borderRadius: 0,
          // Fix page break issues
          pageBreakInside: "avoid",
          breakInside: "avoid",
        },
        ...pdfStyles.container,
      }}
      className="resume-container"
    >
      {/* Sidebar */}
      <Box
        sx={{
          backgroundImage: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
          color: "#ffffff",
          padding: "2.5rem",
          borderRadius: {
            xs: "0.75rem 0.75rem 0 0",
            md: "0.75rem 0 0 0.75rem",
          },
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
          // Ensure sidebar content doesn't break across pages
          "@media print": {
            breakInside: "avoid",
            pageBreakInside: "avoid",
            borderRadius: 0,
          },
        }}
        className="sidebar"
      >
        <Box
          sx={{
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            margin: { xs: "0 auto 1.5rem auto", md: "0 0 1.5rem 0" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "3px solid rgba(255, 255, 255, 0.8)",
            printColorAdjust: "exact",
            WebkitPrintColorAdjust: "exact",
          }}
          className="profile-photo-container"
        >
          <Avatar
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "transparent",
              color: "white",
              fontSize: "3.5rem",
            }}
          >
            {personalInfo.fullName ? (
              personalInfo.fullName.charAt(0)
            ) : (
              <PersonIcon sx={{ fontSize: "3.5rem" }} />
            )}
          </Avatar>
        </Box>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "0.25rem",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            textAlign: { xs: "center", md: "left" },
            printColorAdjust: "exact",
            WebkitPrintColorAdjust: "exact",
          }}
          className="header-name"
        >
          {personalInfo.fullName || "Hayden Smith"}
        </Typography>
        {personalInfo.jobTitle && (
          <Typography
            variant="body1"
            sx={{
              fontSize: "0.95rem",
              fontWeight: 300,
              color: "rgba(255, 255, 255, 0.85)",
              textAlign: { xs: "center", md: "left" },
              marginBottom: "2rem",
              printColorAdjust: "exact",
              WebkitPrintColorAdjust: "exact",
            }}
            className="job-description-sidebar"
          >
            {personalInfo.jobTitle}
          </Typography>
        )}

        <SectionTitle
          title="Personal Information"
          sectionName="personalInfo"
          isSidebar
        />
        <Stack spacing={1.5} sx={pdfStyles.section}>
          {personalInfo.fullName && (
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="contact-item"
            >
              <PersonIcon
                sx={{
                  marginRight: "1rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  width: "20px",
                  textAlign: "center",
                  fontSize: "1rem",
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              />
              <Typography variant="body2">{personalInfo.fullName}</Typography>
            </Box>
          )}
          {personalInfo.location && (
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="contact-item"
            >
              <LocationIcon
                sx={{
                  marginRight: "1rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  width: "20px",
                  textAlign: "center",
                  fontSize: "1rem",
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              />
              <Typography variant="body2">{personalInfo.location}</Typography>
            </Box>
          )}
          {personalInfo.phone && (
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="contact-item"
            >
              <PhoneIcon
                sx={{
                  marginRight: "1rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  width: "20px",
                  textAlign: "center",
                  fontSize: "1rem",
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              />
              <Link
                href={`tel:${personalInfo.phone}`}
                target="_blank"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textDecoration: "none",
                  "&:hover": { color: "#ffffff", textDecoration: "none" },
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
                  marginRight: "1rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  width: "20px",
                  textAlign: "center",
                  fontSize: "1rem",
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              />
              <Link
                href={`mailto:${personalInfo.email}`}
                target="_blank"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textDecoration: "none",
                  "&:hover": { color: "#ffffff", textDecoration: "none" },
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
                  marginRight: "1rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  width: "20px",
                  textAlign: "center",
                  fontSize: "1rem",
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              />
              <Link
                href={personalInfo.linkedin}
                target="_blank"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textDecoration: "none",
                  "&:hover": { color: "#ffffff", textDecoration: "none" },
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
                  marginRight: "1rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  width: "20px",
                  textAlign: "center",
                  fontSize: "1rem",
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              />
              <Link
                href={personalInfo.github}
                target="_blank"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textDecoration: "none",
                  "&:hover": { color: "#ffffff", textDecoration: "none" },
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
                  marginRight: "1rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  width: "20px",
                  textAlign: "center",
                  fontSize: "1rem",
                  printColorAdjust: "exact",
                  WebkitPrintColorAdjust: "exact",
                }}
              />
              <Link
                href={personalInfo.portfolio}
                target="_blank"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textDecoration: "none",
                  "&:hover": { color: "#ffffff", textDecoration: "none" },
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
            <Stack spacing={1} sx={pdfStyles.section}>
              {skills.map((category, index) => (
                <Box key={category.id || index}>
                  {category.name && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.95)",
                        marginBottom: "0.25rem",
                        printColorAdjust: "exact",
                        WebkitPrintColorAdjust: "exact",
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
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            color: "#ffffff",
                            fontWeight: 400,
                            borderRadius: "0.25rem",
                            fontSize: "0.8rem",
                            printColorAdjust: "exact",
                            WebkitPrintColorAdjust: "exact",
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

      {/* Main Content */}
      <Box
        sx={{
          padding: { xs: 3, md: 4 },
          borderTopRightRadius: { xs: "0.75rem", md: "0.75rem" },
          borderBottomRightRadius: { xs: "0.75rem", md: "0.75rem" },
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
          // Adjust main content for print
          "@media print": {
            padding: "20px 30px",
            borderRadius: 0,
          },
        }}
        className="main-content"
      >
        {personalInfo.summary && (
          <Box
            sx={{
              marginBottom: "2.5rem",
              ...pdfStyles.section,
            }}
          >
            <SectionTitle
              title="Professional Summary"
              sectionName="personalInfo"
              icon={PersonIcon}
            />
            <Typography
              variant="body2"
              sx={{ color: "#4b5563", lineHeight: "1.6", fontSize: "0.9rem" }}
            >
              {personalInfo.summary}
            </Typography>
          </Box>
        )}

        {!isSectionEmpty("experience") && (
          <Box
            sx={{
              marginBottom: "2.5rem",
              ...pdfStyles.section,
            }}
          >
            <SectionTitle
              title="Work Experience"
              sectionName="experience"
              icon={WorkIcon}
            />
            {experience.map((exp, index) => (
              <Box
                key={exp.id || index}
                sx={{
                  marginBottom: "1.5rem",
                  ...pdfStyles.item,
                }}
                className="content-card"
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.85rem",
                    color: "#71717a",
                    marginBottom: "0.5rem",
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact",
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
                  sx={{
                    fontWeight: 600,
                    color: "#2c3e50",
                    fontSize: "1.05rem",
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact",
                  }}
                  className="job-title"
                >
                  {exp.position || "Position Title"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#52525b",
                    fontSize: "0.95rem",
                    marginBottom: "0.25rem",
                  }}
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
                        listStyleType: "none",
                        pl: 0,
                        mt: 1,
                        color: "#343a40",
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
                            sx={{
                              marginBottom: "0.375rem",
                              paddingLeft: "0.75rem",
                              position: "relative",
                              fontSize: "0.9rem",
                              lineHeight: 1.6,
                              "&::before": {
                                content: '"•"',
                                color: "#43cea2",
                                fontWeight: "bold",
                                display: "inline-block",
                                width: "1em",
                                marginLeft: "-1.25em",
                                position: "absolute",
                                left: "0.75rem",
                              },
                            }}
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
                        listStyleType: "none",
                        pl: 0,
                        mt: 1,
                        color: "#343a40",
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
                              sx={{
                                marginBottom: "0.375rem",
                                paddingLeft: "0.75rem",
                                position: "relative",
                                fontSize: "0.9rem",
                                lineHeight: 1.6,
                                "&::before": {
                                  content: '"•"',
                                  color: "#43cea2",
                                  fontWeight: "bold",
                                  display: "inline-block",
                                  width: "1em",
                                  marginLeft: "-1.25em",
                                  position: "absolute",
                                  left: "0.75rem",
                                },
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

        {!isSectionEmpty("education") && (
          <Box
            sx={{
              marginBottom: "2.5rem",
              ...pdfStyles.section,
            }}
          >
            <SectionTitle
              title="Education and Training"
              sectionName="education"
              icon={SchoolIcon}
            />
            {education.map((edu, index) => (
              <Box
                key={edu.id || index}
                sx={{
                  marginBottom: "1rem",
                  ...pdfStyles.item,
                }}
                className="content-card"
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.85rem",
                    color: "#71717a",
                    marginBottom: "0.5rem",
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact",
                  }}
                  className="date-range"
                >
                  {formatDate(edu.startDate) || "Start Date"} –{" "}
                  {formatDate(edu.endDate) || "End Date"}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#1e293b",
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact",
                  }}
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
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: "#4b5563",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {edu.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {!isSectionEmpty("projects") && (
          <Box
            sx={{
              marginBottom: "2.5rem",
              ...pdfStyles.section,
            }}
          >
            <SectionTitle
              title="Projects"
              sectionName="projects"
              icon={CodeIcon}
            />
            {projects.map((project, index) => (
              <Box
                key={project.id || index}
                sx={{
                  marginBottom: "1rem",
                  ...pdfStyles.item,
                }}
                className="content-card"
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.85rem",
                    color: "#71717a",
                    marginBottom: "0.5rem",
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact",
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
                  sx={{
                    fontWeight: 600,
                    color: "#1e293b",
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact",
                  }}
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
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4b5563",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {project.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {references.length > 0 && (
          <Box sx={pdfStyles.section}>
            <SectionTitle
              title="References"
              sectionName="references"
              icon={PersonIcon}
            />
            {references.length > 0 ? (
              <Stack
                spacing={1}
                sx={{ color: "#4b5563" }}
                className="content-card"
              >
                {references.map((reference, index) => (
                  <Box key={reference.id || index} sx={pdfStyles.item}>
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

export default EuropassTemplate;
