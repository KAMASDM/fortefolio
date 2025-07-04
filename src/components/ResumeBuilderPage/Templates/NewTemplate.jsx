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
  useMediaQuery,
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
  Code as CodeIcon,
} from "@mui/icons-material";
import { useEffect, useRef, useState, useMemo } from 'react';
import PreviewWrapper from './PreviewWrapper'; 

export const EuropassTemplate = ({
  resumeData,
  formatDate,
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

  
  const SectionTitle = ({ title, sectionName, isSidebar = false, icon: IconComponent }) => (
    <Box
      sx={{
        fontSize: isSidebar ? "1.125rem" : "1.375rem",
        fontWeight: isSidebar ? 500 : 600,
        color: isSidebar ? "#ffffff" : "#185a9d",
        paddingBottom: isSidebar ? "0.375rem" : "0.5rem",
        marginTop: isSidebar ? "2rem" : "2rem",
        marginBottom: isSidebar ? "1rem" : "1.5rem",
        borderBottom: isSidebar ? "1px solid rgba(255,255,255,0.3)" : "2px solid #43cea2",
        display: "flex",
        alignItems: "center",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
        pageBreakAfter: "avoid",
        breakAfter: "avoid",
      }}
    >
      {IconComponent && <IconComponent sx={{ mr: "0.75rem", fontSize: isSidebar ? "1rem" : "1.25rem" }} />}
      {title}
      <IconButton
        size="small"
        onClick={() => toggleStarSection(sectionName)}
        sx={{ ml: 1, color: isSidebar ? "rgba(255,255,255,0.7)" : '#185a9d' }}
      >
        {starredSections.includes(sectionName) ? (
          <StarIcon fontSize="small" sx={{ color: isSidebar ? "white" : '#185a9d', printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} />
        ) : (
          <StarBorderIcon fontSize="small" />
        )}
      </IconButton>
    </Box>
  );
  
  
  function Page({ isFirst, leftContent, rightContentChildren }) {
    return (
        <Box
            className={`page with-border ${isFirst ? 'first-page' : 'full-page'}`}
            sx={{
                fontFamily: fontFamily,
                backgroundColor: "#ffffff",
                boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.15)",
                display: 'flex',
                flexDirection: 'row',
                overflow: "hidden",
                margin: "0 auto",
                '@media print': {
                    boxShadow: 'none',
                    margin: 0,
                    borderRadius: 0,
                },
                ...(!isFirst && {
                    display: 'block',
                })
            }}
        >
            {isFirst && (
                <Box 
                    sx={{
                        width: '300px',
                        backgroundImage: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
                        color: "#ffffff",
                        padding: "2.5rem",
                        printColorAdjust: "exact",
                        WebkitPrintColorAdjust: "exact",
                        '@media print': {
                            width: '300px',
                            breakInside: "avoid",
                            pageBreakInside: "avoid",
                        },
                    }}
                >
                    {leftContent}
                </Box>
            )}
            
            <Box 
                sx={{
                    flex: 1,
                    padding: 4,
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact",
                    '@media print': {
                        padding: "20px 30px",
                        borderRadius: 0,
                    },
                }}
            >
                {rightContentChildren.map((item, idx) => (
                    <div key={idx} className="content-block">{item}</div>
                ))}
            </Box>
        </Box>
    );
  }

  
  const A4_HEIGHT_PX = 1050; 
  const rightColumnRef = useRef(null);
  const overflowRef = useRef(null);

  const [firstPageItems, setFirstPageItems] = useState([]);
  const [remainingItems, setRemainingItems] = useState([]);
  const [overflowPages, setOverflowPages] = useState([]);

  
  const leftContent = useMemo(() => (
    <>
        <Box sx={{ width: "130px", height: "130px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.2)", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "3px solid rgba(255, 255, 255, 0.8)", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>
            <Avatar sx={{ width: "100%", height: "100%", bgcolor: "transparent", color: "white", fontSize: "3.5rem" }}>
                {personalInfo.fullName ? personalInfo.fullName.charAt(0) : <PersonIcon sx={{ fontSize: "3.5rem" }} />}
            </Avatar>
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontSize: "2rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem", textShadow: "1px 1px 2px rgba(0,0,0,0.1)", textAlign: "left", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>
            {personalInfo.fullName || "Hayden Smith"}
        </Typography>
        {personalInfo.jobTitle && (
            <Typography variant="body1" sx={{ fontSize: "0.95rem", fontWeight: 300, color: "rgba(255, 255, 255, 0.85)", textAlign: "left", marginBottom: "2rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>
                {personalInfo.jobTitle}
            </Typography>
        )}
        <SectionTitle title="Personal Information" sectionName="personalInfo" isSidebar />
        <Stack spacing={1.5}>
            {personalInfo.fullName && <Box sx={{ display: "flex", alignItems: "center" }}><PersonIcon sx={{ marginRight: "1rem", color: "rgba(255, 255, 255, 0.9)", width: "20px", textAlign: "center", fontSize: "1rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} /><Typography variant="body2">{personalInfo.fullName}</Typography></Box>}
            {personalInfo.location && <Box sx={{ display: "flex", alignItems: "center" }}><LocationIcon sx={{ marginRight: "1rem", color: "rgba(255, 255, 255, 0.9)", width: "20px", textAlign: "center", fontSize: "1rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} /><Typography variant="body2">{personalInfo.location}</Typography></Box>}
            {personalInfo.phone && <Box sx={{ display: "flex", alignItems: "center" }}><PhoneIcon sx={{ marginRight: "1rem", color: "rgba(255, 255, 255, 0.9)", width: "20px", textAlign: "center", fontSize: "1rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} /><Link href={`tel:${personalInfo.phone}`} target="_blank" sx={{ color: "rgba(255, 255, 255, 0.9)", textDecoration: "none", "&:hover": { color: "#ffffff" } }}>{personalInfo.phone}</Link></Box>}
            {personalInfo.email && <Box sx={{ display: "flex", alignItems: "center" }}><EmailIcon sx={{ marginRight: "1rem", color: "rgba(255, 255, 255, 0.9)", width: "20px", textAlign: "center", fontSize: "1rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} /><Link href={`mailto:${personalInfo.email}`} target="_blank" sx={{ color: "rgba(255, 255, 255, 0.9)", textDecoration: "none", "&:hover": { color: "#ffffff" } }}>{personalInfo.email}</Link></Box>}
            {personalInfo.linkedin && <Box sx={{ display: "flex", alignItems: "center" }}><LinkedInIcon sx={{ marginRight: "1rem", color: "rgba(255, 255, 255, 0.9)", width: "20px", textAlign: "center", fontSize: "1rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} /><Link href={personalInfo.linkedin} target="_blank" sx={{ color: "rgba(255, 255, 255, 0.9)", textDecoration: "none", "&:hover": { color: "#ffffff" } }}>linkedin.com/in/{personalInfo.linkedin.split("/").pop()}</Link></Box>}
            {personalInfo.github && <Box sx={{ display: "flex", alignItems: "center" }}><GitHubIcon sx={{ marginRight: "1rem", color: "rgba(255, 255, 255, 0.9)", width: "20px", textAlign: "center", fontSize: "1rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} /><Link href={personalInfo.github} target="_blank" sx={{ color: "rgba(255, 255, 255, 0.9)", textDecoration: "none", "&:hover": { color: "#ffffff" } }}>github.com/{personalInfo.github.split("/").pop()}</Link></Box>}
            {personalInfo.portfolio && <Box sx={{ display: "flex", alignItems: "center" }}><LanguageIcon sx={{ marginRight: "1rem", color: "rgba(255, 255, 255, 0.9)", width: "20px", textAlign: "center", fontSize: "1rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} /><Link href={personalInfo.portfolio} target="_blank" sx={{ color: "rgba(255, 255, 255, 0.9)", textDecoration: "none", "&:hover": { color: "#ffffff" } }}>{personalInfo.portfolio.replace(/^(https?:\/\/)?(www\.)?/, "")}</Link></Box>}
        </Stack>
        {!isSectionEmpty("skills") && (
            <>
                <SectionTitle title="Skills" sectionName="skills" isSidebar />
                <Stack spacing={1}>
                    {skills.map((category, index) => (
                        <Box key={category.id || index}>
                            {category.name && <Typography variant="body2" sx={{ fontWeight: 500, color: "rgba(255,255,255,0.95)", marginBottom: "0.25rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>{category.name}</Typography>}
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {Array.isArray(category.skills) && category.skills.filter(Boolean).map((skill, idx) => (<Chip key={idx} label={skill.trim()} size="small" sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)", color: "#ffffff", fontWeight: 400, borderRadius: "0.25rem", fontSize: "0.8rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }} />))}
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </>
        )}
    </>
  ), [resumeData, starredSections, isSectionEmpty]);

  const rightContent = useMemo(() => ([
    personalInfo.summary && (
      <Box className="content-section">
        <SectionTitle title="Professional Summary" sectionName="personalInfo" icon={PersonIcon} />
        <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: "1.6", fontSize: "0.9rem" }}>{personalInfo.summary}</Typography>
      </Box>
    ),
    !isSectionEmpty("experience") && (
      <Box className="content-section">
        <SectionTitle title="Work Experience" sectionName="experience" icon={WorkIcon} />
        {experience.map((exp, index) => (
          <Box key={exp.id || index} sx={{ marginBottom: "1.5rem", pageBreakInside: "avoid", breakInside: "avoid" }}>
            <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#71717a", marginBottom: "0.5rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>{formatDate(exp.startDate) || "Start Date"} – {exp.current ? "Present" : formatDate(exp.endDate) || "End Date"}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50", fontSize: "1.05rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>{exp.position || "Position Title"}</Typography>
            <Typography variant="body2" sx={{ color: "#52525b", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{exp.company || "Company Name"}{exp.location && `, ${exp.location}`}</Typography>
            {exp.description && <Typography variant="body2" sx={{ mt: 1 }}>{exp.description}</Typography>}
            {Array.isArray(exp.responsibilities) && exp.responsibilities.filter(Boolean).length > 0 && (
                <Box component="ul" sx={{ listStyleType: "none", pl: 0, mt: 1, color: "#343a40" }}>
                    {exp.responsibilities.filter(Boolean).map((responsibility, idx) => (<Typography component="li" variant="body2" key={idx} sx={{ marginBottom: "0.375rem", paddingLeft: "0.75rem", position: "relative", fontSize: "0.9rem", lineHeight: 1.6, '&::before': { content: '"•"', color: "#43cea2", fontWeight: "bold", display: "inline-block", width: "1em", marginLeft: "-1.25em", position: "absolute", left: "0.75rem" } }}>{responsibility}</Typography>))}
                </Box>
            )}
          </Box>
        ))}
      </Box>
    ),
    !isSectionEmpty("education") && (
      <Box className="content-section">
        <SectionTitle title="Education and Training" sectionName="education" icon={SchoolIcon} />
        {education.map((edu, index) => (
          <Box key={edu.id || index} sx={{ marginBottom: "1rem", pageBreakInside: "avoid", breakInside: "avoid" }}>
            <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#71717a", marginBottom: "0.5rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>{formatDate(edu.startDate) || "Start Date"} – {formatDate(edu.endDate) || "End Date"}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>{edu.degree || "Degree"} {edu.field && ` / ${edu.field}`}</Typography>
            <Typography variant="body2" sx={{ color: "#475569", marginBottom: "0.25rem" }}>{edu.institution || "Institution Name"}{edu.location && `, ${edu.location}`}</Typography>
            {edu.description && <Typography variant="body2" sx={{ mt: 1, color: "#4b5563", fontSize: "0.9rem", lineHeight: 1.6 }}>{edu.description}</Typography>}
          </Box>
        ))}
      </Box>
    ),
    !isSectionEmpty("projects") && (
      <Box className="content-section">
        <SectionTitle title="Projects" sectionName="projects" icon={CodeIcon} />
        {projects.map((project, index) => (
          <Box key={project.id || index} sx={{ marginBottom: "1rem", pageBreakInside: "avoid", breakInside: "avoid" }}>
            <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#71717a", marginBottom: "0.5rem", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>{formatDate(project.startDate) || "Start Date"} – {project.current ? "Present" : formatDate(project.endDate) || "End Date"}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}>{project.title || "Project Title"}</Typography>
            {project.link && <Link href={project.link} target="_blank" underline="hover" variant="body2" sx={{ color: "#4f46e5", display: "block", marginBottom: "0.25rem" }}>{project.link}</Link>}
            {project.technologies && <Typography variant="body2" sx={{ fontStyle: "italic", color: "#475569", marginBottom: "0.25rem" }}>Technologies: {project.technologies}</Typography>}
            {project.description && <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.9rem", lineHeight: 1.6 }}>{project.description}</Typography>}
          </Box>
        ))}
      </Box>
    ),
    references.length > 0 && (
      <Box className="content-section">
        <SectionTitle title="References" sectionName="references" icon={PersonIcon} />
        {references.length > 0 ? (
            <Stack spacing={1} sx={{ color: "#4b5563" }}>
                {references.map((reference, index) => (
                    <Box key={reference.id || index} sx={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{reference.name}</Typography>
                        {reference.position && <Typography variant="body2">{reference.position}</Typography>}
                        {reference.company && <Typography variant="body2">{reference.company}</Typography>}
                        {reference.email && <Typography variant="body2">Email: {reference.email}</Typography>}
                        {reference.contact && <Typography variant="body2">Phone: {reference.contact}</Typography>}
                        {reference.relationship && <Typography variant="body2">Relationship: {reference.relationship}</Typography>}
                    </Box>
                ))}
            </Stack>
        ) : (
            <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.875rem" }}>Available upon request.</Typography>
        )}
      </Box>
    ),
  ].filter(Boolean)), [resumeData, starredSections, isSectionEmpty, formatDate]);

  
  const paginateContent = () => {
    setFirstPageItems([]);
    setRemainingItems([]);
    setOverflowPages([]);
    setTimeout(() => {
        if (!rightColumnRef.current || !overflowRef.current) return;
        const mainContentPaddingY = (theme.spacing(4).replace('px','') * 2);
        const MAX_PAGE_HEIGHT = A4_HEIGHT_PX - mainContentPaddingY;
        
        
        const rightColumnBlocks = Array.from(rightColumnRef.current.children);
        let usedHeight = 0;
        let firstPageCount = 0;
        for (let i = 0; i < rightColumnBlocks.length; i++) {
            if (usedHeight + rightColumnBlocks[i].offsetHeight <= MAX_PAGE_HEIGHT) {
                usedHeight += rightColumnBlocks[i].offsetHeight;
                firstPageCount++;
            } else { break; }
        }
        setFirstPageItems(rightContent.slice(0, firstPageCount));
        const remaining = rightContent.slice(firstPageCount);
        setRemainingItems(remaining);

        
        if (remaining.length > 0) {
            setTimeout(() => {
                if (!overflowRef.current) return;
                const overflowBlocks = Array.from(overflowRef.current.children);
                const pages = [];
                let currentPageItems = [], currentPageHeight = 0;
                for (let i = 0; i < overflowBlocks.length; i++) {
                    if (currentPageHeight + overflowBlocks[i].offsetHeight > MAX_PAGE_HEIGHT && currentPageItems.length > 0) {
                        pages.push(currentPageItems);
                        currentPageItems = [remaining[i]];
                        currentPageHeight = overflowBlocks[i].offsetHeight;
                    } else {
                        currentPageItems.push(remaining[i]);
                        currentPageHeight += overflowBlocks[i].offsetHeight;
                    }
                }
                if (currentPageItems.length > 0) pages.push(currentPageItems);
                setOverflowPages(pages);
            }, 0);
        }
    }, 0);
  };

  useEffect(paginateContent, [JSON.stringify(resumeData), fontFamily, starredSections]);

  return (
    <PreviewWrapper>
        {/* Hidden measurement divs */}
        <Box sx={{ position: 'absolute', top: -9999, visibility: 'hidden', height: 'auto', width: 'calc(210mm - 300px - 40px)', p:4, fontFamily: fontFamily }}>
            <div ref={rightColumnRef}>
                {rightContent.map((item, i) => <div key={i}>{item}</div>)}
            </div>
        </Box>
        <Box sx={{ position: 'absolute', top: -9999, visibility: 'hidden', height: 'auto', width: 'calc(210mm - 40px)', p:4, fontFamily: fontFamily }}>
            <div ref={overflowRef}>
                {remainingItems.map((item, i) => <div key={i}>{item}</div>)}
            </div>
        </Box>

        {/* Rendered Pages */}
        {firstPageItems.length > 0 && <Page isFirst={true} leftContent={leftContent} rightContentChildren={firstPageItems} />}
        {overflowPages.map((pageItems, idx) => (
            <Page key={`overflow-page-${idx}`} isFirst={false} rightContentChildren={pageItems} />
        ))}
    </PreviewWrapper>
  );
};

export default EuropassTemplate;