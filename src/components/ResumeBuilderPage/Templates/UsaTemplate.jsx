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
  PersonOutline as PersonIcon, // For references section title
  Description as DescriptionIcon, // For Objective/Summary
  School as SchoolIcon, // For Education
  Psychology as PsychologyIcon, // For Skills
  Work as WorkIcon, // For Experience
  Code as CodeIcon, // For Projects
  EmojiEvents as LeadershipIcon, // For Leadership & Activities
  SportsSoccer as InterestsIcon, // For Interests
} from "@mui/icons-material";
import { useLayoutEffect, useRef, useState, useMemo } from 'react';

import PreviewWrapper from './PreviewWrapper'

 
const Page = ({ children, fontFamily, isFirst, isLast }) => (
  <Box
    className={`page with-border ${isFirst ? 'first-page' : 'full-page'}`}
    sx={{
      fontFamily: fontFamily,
      backgroundColor: "#f8fafc", // Tailwind gray-50
      padding: "2.5rem",
      width: '210mm',
      minHeight: '297mm',
      boxSizing: 'border-box',
      background: "white",
      '@media print': {
        width: '100%',
        height: '100%',
        minHeight: 'auto',
        boxShadow: 'none',
        margin: 0,
        borderRadius: 0,
        ...(isLast ? {} : { pageBreakAfter: 'always' }),
      },
    }}
  >
    {children}
  </Box>
);

export const UsaTemplate = ({
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

  const SectionTitle = ({ title, sectionName, icon: IconComponent }) => (
    <Box
      sx={{
        fontSize: "1.125rem", 
        fontWeight: 700, 
        width:'100%',
        color: "#1e3a8a", 
        borderBottom: "1px solid #93c5fd", 
        paddingBottom: "0.375rem", 
        marginBottom: "1rem",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        ...pdfColorStyles,
      }}
    >
      {IconComponent && (
        <IconComponent
          sx={{ mr: "0.75rem", fontSize: "1.25rem" }}
        />
      )}
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

  const A4_HEIGHT_PX = 1123;
  const contentRef = useRef(null);
  const [pagedContent, setPagedContent] = useState([]); // This will hold arrays of JSX for each page
 
  const contentBlocks = useMemo(() => {
    return [
      <Box sx={{ textAlign: "center", marginBottom: "1.5rem", pageBreakInside: 'avoid' }}>
        {personalInfo.profilePhoto && (
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
            fontSize: "2rem",
            fontWeight: 700,
            color: "#111827",
            ...pdfColorStyles,
          }}
          className="header-name"
        >
          {personalInfo.fullName
            ? personalInfo.fullName.toUpperCase()
            : "HAYDEN SMITH"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginTop: "0.25rem",
            fontSize: "0.875rem",
            color: "#374151",
            textAlign: "center",
            marginBottom: "1.5rem",
            "& span": {
              display: "inline",
              marginRight: "0.5rem",
            },
            "& span:not(:last-child)::after": {
              content: "' | '",
              marginLeft: "0.5rem",
              color: "#9ca3af",
            },
            "& a": {
              color: "#1d4ed8",
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
              <Link href={personalInfo.linkedin} target="_blank">
                LinkedIn
              </Link>
            </Box>
          )}
          {personalInfo.github && (
            <Box component="span">
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
              <Link href={personalInfo.website} target="_blank">
                Website
              </Link>
            </Box>
          )}
        </Typography>
      </Box>,

      personalInfo.summary && (
        <Box sx={{ marginBottom: "1rem", pageBreakInside: 'avoid' }}>
          <SectionTitle
            title="Objective"
            sectionName="personalInfo"
            icon={DescriptionIcon}
          />
          <Typography
            variant="body2"
            sx={{
              color: "#4b5563",
              lineHeight: "1.6",
              fontSize: "0.9rem",
              ...pdfColorStyles,
            }}
          >
            {personalInfo.summary}
          </Typography>
        </Box>
      ),

      !isSectionEmpty("education") && (
        <Box sx={{ marginBottom: "1rem", pageBreakInside: 'avoid' }}>
          <SectionTitle
            title="Education"
            sectionName="education"
            icon={SchoolIcon}
          />
          {education.map((edu, index) => (
            <Box
              key={edu.id || index}
              sx={{ marginBottom: "0.75rem" }}
              className="education-item"
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#1f2937",
                    ...pdfColorStyles,
                  }}
                  className="job-title"
                >
                  {edu.institution || "Institution Name"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#374151", fontSize: "0.95rem" }}
                  className="company-name"
                >
                  {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                  {edu.location && `, ${edu.location}`}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  color: "#4b5563",
                  textAlign: "right",
                  ...pdfColorStyles,
                }}
                className="date-range"
              >
                {formatDate(edu.startDate) || "Start Date"} –{" "}
                {formatDate(edu.endDate) || "End Date"}
              </Typography>
              {edu.description && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.25,
                    color: "#4b5563",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                  className="education-item-details"
                >
                  {edu.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      ),

      !isSectionEmpty("skills") && (
        <Box sx={{ marginBottom: "1rem", pageBreakInside: 'avoid' }}>
          <SectionTitle
            title="Skills"
            sectionName="skills"
            icon={PsychologyIcon}
          />
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyleType: "disc",
              pl: 2,
              color: "#4b5563",
              fontSize: "0.9rem",
            }}
          >
            {skills.map((category, index) => (
              <Box key={category.id || index}>
                {category.name && (
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mt: 0.5, mb: 0.25 }}
                  >
                    {category.name}:
                  </Typography>
                )}
                {Array.isArray(category.skills) &&
                  category.skills.filter(Boolean).map((skill, idx) => (
                    <Typography
                      component="li"
                      variant="body2"
                      key={idx}
                      sx={{ marginBottom: "0.25rem" }}
                    >
                      {skill.trim()}
                    </Typography>
                  ))}
              </Box>
            ))}
          </Stack>
        </Box>
      ),

      !isSectionEmpty("experience") && (
        <Box sx={{ marginBottom: "1rem", pageBreakInside: 'avoid' }}>
          <SectionTitle
            title="Work Experience"
            sectionName="experience"
            icon={WorkIcon}
          />
          {experience.map((exp, index) => (
            <Box
              key={exp.id || index}
              sx={{ marginBottom: "0.75rem" }}
              className="experience-item"
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#1f2937",
                    ...pdfColorStyles,
                  }}
                  className="job-title"
                >
                  {exp.position || "Position Title"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    ...pdfColorStyles,
                  }}
                  className="company-name"
                >
                  {exp.company || "Company Name"}
                  {exp.location && `, ${exp.location}`}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  color: "#4b5563",
                  textAlign: "right",
                  ...pdfColorStyles,
                }}
                className="date-range"
              >
                {formatDate(exp.startDate) || "Start Date"} –{" "}
                {exp.current
                  ? "Present"
                  : formatDate(exp.endDate) || "End Date"}
              </Typography>
              {exp.description && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.25,
                    color: "#4b5563",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                  className="experience-item-details"
                >
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
                      mt: 0.5,
                      color: "#4b5563",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                    className="experience-item-details"
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
                      mt: 0.5,
                      color: "#4b5563",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                    className="experience-item-details"
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
      ),

      !isSectionEmpty("projects") && (
        <Box sx={{ marginBottom: "1rem", pageBreakInside: 'avoid' }}>
          <SectionTitle
            title="Projects"
            sectionName="projects"
            icon={CodeIcon}
          />
          {projects.map((project, index) => (
            <Box
              key={project.id || index}
              sx={{ marginBottom: "0.75rem" }}
              className="experience-item"
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#1f2937",
                    ...pdfColorStyles,
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
                      color: "#1d4ed8",
                      display: "block",
                      mt: 0.25,
                    }}
                  >
                    {project.link}
                  </Link>
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  color: "#4b5563",
                  textAlign: "right",
                  ...pdfColorStyles,
                }}
                className="date-range"
              >
                {formatDate(project.startDate) || "Start Date"} –{" "}
                {project.current
                  ? "Present"
                  : formatDate(project.endDate) || "End Date"}
              </Typography>
              {project.technologies && (
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                    mt: 0.25,
                    color: "#4b5563",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                  className="experience-item-details"
                >
                  Technologies: {project.technologies}
                </Typography>
              )}
              {project.description && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.25,
                    color: "#4b5563",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                  className="experience-item-details"
                >
                  {project.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      ),

      isSectionEmpty("references") && (
        <Box sx={{ pageBreakInside: 'avoid' }}>
          <SectionTitle
            title="References"
            sectionName="references"
            icon={PersonIcon}
          />
          {references.length > 0 ? (
            <Stack spacing={1} sx={{ color: "#4b5563", fontSize: "0.9rem" }}>
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
      ),

    ].filter(Boolean);
  }, [resumeData, isSectionEmpty, formatDate, colorScheme, starredSections, toggleStarSection]);
 
  useLayoutEffect(() => {
    if (!contentRef.current) return;
    
    const allBlockElements = Array.from(contentRef.current.children);
    const pagesOfIndices = [];
    let currentPageIndices = [];
    let currentHeight = 0;
    
    const pageVerticalPadding = 5 * 16; // 2.5rem top + 2.5rem bottom
    const MAX_PAGE_HEIGHT = A4_HEIGHT_PX - pageVerticalPadding;

    allBlockElements.forEach((blockElement, index) => {
      const blockHeight = blockElement.offsetHeight;

      if (currentHeight + blockHeight > MAX_PAGE_HEIGHT && currentPageIndices.length > 0) {
        pagesOfIndices.push(currentPageIndices);
        currentPageIndices = [index];
        currentHeight = blockHeight;
      } else {
        currentPageIndices.push(index);
        currentHeight += blockHeight;
      }
    });

    if (currentPageIndices.length > 0) {
      pagesOfIndices.push(currentPageIndices);
    }
    
    const newPagedContent = pagesOfIndices.map(pageIndices => 
      pageIndices.map(index => contentBlocks[index])
    );
    
    setPagedContent(newPagedContent);

  }, [contentBlocks, fontFamily]);

  return (
    <PreviewWrapper>
      <Box sx={{ position: 'absolute', top: -9999, left: -9999, visibility: 'hidden', width: '210mm', p: "2.5rem", boxSizing: 'border-box', fontFamily: fontFamily }}>
        <div ref={contentRef}>
          {contentBlocks.map((block, index) => (
            <div key={index}>{block}</div>
          ))}
        </div>
      </Box>

      {pagedContent.length > 0 ? (
        pagedContent.map((pageContent, idx) => (
          <Page 
            key={idx} 
            fontFamily={fontFamily} 
            isFirst={idx === 0}
            isLast={idx === pagedContent.length - 1}
          >
            {pageContent}
          </Page>
        ))
      ) : (
        <Page fontFamily={fontFamily} isFirst={true} isLast={true} />
      )}
    </PreviewWrapper>
  );
};

export default UsaTemplate;