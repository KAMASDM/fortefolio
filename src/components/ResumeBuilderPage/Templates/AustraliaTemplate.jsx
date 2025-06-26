import {
  Box,
  Typography,
  Grid,
  Link,
  Stack,
  IconButton,
  Chip,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  PersonOutline as PersonIcon,
} from "@mui/icons-material";
import { useLayoutEffect, useRef, useState, useMemo } from 'react';

import PreviewWrapper from './PreviewWrapper'
 
const Page = ({ children, fontFamily, isFirst, isLast }) => (
  <Box
    className={`page with-border ${isFirst ? 'first-page' : 'full-page'}`}
    sx={{
      fontFamily: fontFamily,
      backgroundColor: "#ffffff",
      padding: "2.5rem",
      width: '210mm',
      minHeight: '297mm',
      boxSizing: 'border-box',
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

 
export const AustraliaTemplate = ({
  resumeData,
  formatDate,
  colorScheme,
  fontFamily,
  isSectionEmpty,
  toggleStarSection,
  starredSections,
}) => {
  const theme = useTheme();
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
    <Box sx={{
      fontSize: "1.25rem",
      fontWeight: 600,
      color: colorScheme.primary,
      borderBottom: `2px solid ${colorScheme.accent}`,
      paddingBottom: "0.5rem",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      ...pdfColorStyles
    }}>
      {title}
      <IconButton size="small" onClick={() => toggleStarSection(sectionName)} sx={{ ml: 1 }}>
        {starredSections.includes(sectionName)
          ? <StarIcon fontSize="small" sx={{ color: colorScheme.primary, ...pdfColorStyles }} />
          : <StarBorderIcon fontSize="small" />
        }
      </IconButton>
    </Box>
  );

  const A4_HEIGHT_PX = 1123;
  const contentRef = useRef(null);
  const [pagedContent, setPagedContent] = useState([]); // This will hold arrays of JSX for each page

 
  const contentBlocks = useMemo(() => {
    return [
      <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
        {personalInfo.profilePhoto && (
          <Avatar src={personalInfo.profilePhoto} alt={personalInfo.fullName || "Profile"} sx={{ width: 100, height: 100, margin: "0 auto 1rem auto", border: `2px solid ${colorScheme.accent}`, ...pdfColorStyles }}>
            {!personalInfo.profilePhoto && (personalInfo.fullName ? personalInfo.fullName.charAt(0) : <PersonIcon />)}
          </Avatar>
        )}
        <Typography variant="h4" component="h1" sx={{ fontSize: "2.25rem", fontWeight: 700, color: colorScheme.primary, ...pdfColorStyles }}>
          {personalInfo.fullName || "Hayden Smith"}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: "0.5rem", fontSize: "0.875rem", color: colorScheme.text, display: "flex", flexWrap: "wrap", justifyContent: "center", "& span": { display: "inline", marginBottom: 0 }, "& span:not(:last-child)::after": { content: "' | '" }, "& a": { color: colorScheme.primary, textDecoration: "none", "&:hover": { textDecoration: "underline" } }, ...pdfColorStyles }}>
          {personalInfo.location && <Box component="span">{personalInfo.location}</Box>}
          {personalInfo.phone && <Box component="span">{personalInfo.phone}</Box>}
          {personalInfo.email && <Box component="span"><Link href={`mailto:${personalInfo.email}`} target="_blank">{personalInfo.email}</Link></Box>}
          {personalInfo.linkedin && <Box component="span"><Link href={personalInfo.linkedin} target="_blank">LinkedIn</Link></Box>}
          {personalInfo.github && <Box component="span"><Link href={personalInfo.github} target="_blank">GitHub</Link></Box>}
          {personalInfo.portfolio && <Box component="span"><Link href={personalInfo.portfolio} target="_blank">Portfolio</Link></Box>}
          {personalInfo.website && <Box component="span"><Link href={personalInfo.website} target="_blank">Website</Link></Box>}
        </Typography>
      </Box>,

      personalInfo.summary && <Box sx={{ marginBottom: "1.5rem", pageBreakInside: 'avoid' }}><SectionTitle title="Career Objective" sectionName="personalInfo" /><Typography variant="body2" sx={{ color: colorScheme.text, lineHeight: "1.6", ...pdfColorStyles }}>{personalInfo.summary}</Typography></Box>,
      
      !isSectionEmpty("skills") && <Box sx={{ marginBottom: "1.5rem", pageBreakInside: 'avoid' }}><SectionTitle title="Key Skills" sectionName="skills" /><Stack component="ul" spacing={0.5} sx={{ listStyleType: "disc", pl: 2, color: colorScheme.text }}>{skills.map((category, index) => (<Box key={category.id || index}>{category.name && <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1, mb: 0.5, color: colorScheme.secondary }}>{category.name}:</Typography>}<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>{Array.isArray(category.skills) && category.skills.filter(Boolean).map((skill, idx) => (<Chip key={idx} label={skill.trim()} variant="outlined" size="small" sx={{ borderColor: colorScheme.primary, color: colorScheme.text, ...pdfColorStyles }} />))}</Box></Box>))}</Stack></Box>,

      !isSectionEmpty("education") && <Box sx={{ marginBottom: "1.5rem", pageBreakInside: 'avoid' }}><SectionTitle title="Education" sectionName="education" />{education.map((edu, index) => (<Box key={edu.id || index} sx={{ marginBottom: "1rem" }}><Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary, ...pdfColorStyles }}>{edu.institution || "Institution Name"}</Typography><Typography variant="body2" sx={{ color: colorScheme.text, fontSize: "0.875rem" }}>{edu.degree || "Degree"} {edu.field && `in ${edu.field}`}</Typography><Typography variant="body2" sx={{ fontSize: "0.875rem", color: colorScheme.text, marginTop: "0.25rem", ...pdfColorStyles }}>{formatDate(edu.startDate) || "Start Date"} - {formatDate(edu.endDate) || "End Date"}</Typography>{edu.location && <Typography variant="body2" sx={{ color: colorScheme.text, fontSize: "0.875rem" }}>{edu.location}</Typography>}{edu.description && <Typography variant="body2" sx={{ mt: 1, color: colorScheme.text }}>{edu.description}</Typography>}</Box>))}</Box>,

      !isSectionEmpty("experience") && <Box sx={{ marginBottom: "1.5rem", pageBreakInside: 'avoid' }}><SectionTitle title="Work Experience" sectionName="experience" />{experience.map((exp, index) => (<Box key={exp.id || index} sx={{ marginBottom: "1rem" }}><Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary, ...pdfColorStyles }}>{exp.position || "Position Title"}</Typography><Typography variant="body2" sx={{ fontStyle: "italic", color: colorScheme.text, ...pdfColorStyles }}>{exp.company || "Company Name"}{exp.location && ` - ${exp.location}`}</Typography><Typography variant="body2" sx={{ fontSize: "0.875rem", color: colorScheme.text, marginTop: "0.25rem", ...pdfColorStyles }}>{formatDate(exp.startDate) || "Start Date"} - {exp.current ? "Present" : formatDate(exp.endDate) || "End Date"}</Typography>{exp.description && <Typography variant="body2" sx={{ mb: 1, color: colorScheme.text }}>{exp.description}</Typography>}{Array.isArray(exp.responsibilities) && exp.responsibilities.filter(Boolean).length > 0 && <Box component="ul" sx={{ listStyleType: "disc", pl: 2, mt: 1 }}>{exp.responsibilities.filter(Boolean).map((resp, idx) => (<Typography component="li" variant="body2" key={idx} sx={{ marginBottom: "0.25rem", color: colorScheme.text }}>{resp}</Typography>))}</Box>}</Box>))}</Box>,

      !isSectionEmpty("projects") && <Box sx={{ marginBottom: "1.5rem", pageBreakInside: 'avoid' }}><SectionTitle title="Projects" sectionName="projects" />{projects.map((project, index) => (<Box key={project.id || index} sx={{ marginBottom: "1rem" }}><Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary, ...pdfColorStyles }}>{project.title || "Project Title"}</Typography><Typography variant="body2" sx={{ fontSize: "0.875rem", color: colorScheme.text, marginTop: "0.25rem", ...pdfColorStyles }}>{formatDate(project.startDate) || "Start Date"} - {project.current ? "Present" : formatDate(project.endDate) || "End Date"}</Typography>{project.link && <Link href={project.link} target="_blank" underline="hover" variant="body2" sx={{ color: colorScheme.primary, display: "block", mt: 0.5 }}>{project.link}</Link>}{project.technologies && <Typography variant="body2" sx={{ fontStyle: "italic", mt: 0.5, color: colorScheme.text }}>Technologies: {project.technologies}</Typography>}{project.description && <Typography variant="body2" sx={{ mt: 0.5, color: colorScheme.text }}>{project.description}</Typography>}</Box>))}</Box>,

      references.length > 0 && <Box sx={{ pageBreakInside: 'avoid' }}><SectionTitle title="References" sectionName="references" /><Stack spacing={1} sx={{ color: colorScheme.text }}>{references.map((ref, index) => (<Box key={ref.id || index}><Typography variant="body2" sx={{ fontWeight: 600 }}>{ref.name}</Typography>{ref.position && <Typography variant="body2">{ref.position}</Typography>}{ref.company && <Typography variant="body2">{ref.company}</Typography>}{ref.email && <Typography variant="body2">Email: {ref.email}</Typography>}{ref.contact && <Typography variant="body2">Phone: {ref.contact}</Typography>}{ref.relationship && <Typography variant="body2">Relationship: {ref.relationship}</Typography>}</Box>))}</Stack></Box>,

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
      {/* Hidden measurement div for pagination */}
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

// Make sure to export the component as default for the environment
export default AustraliaTemplate;