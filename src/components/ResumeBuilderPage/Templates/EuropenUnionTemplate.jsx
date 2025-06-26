import {
  Box,
  Typography,
  Link,
  Stack,
  Chip,
  Avatar,
  Grid,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  PersonOutline as PersonIcon,
} from "@mui/icons-material";
import { useEffect, useRef, useState, useMemo } from 'react';
import PreviewWrapper from './PreviewWrapper';

const EuropeanUnionTemplate = ({
  resumeData,
  formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  colorScheme = {
    primary: '#4f46e5',
    secondary: '#312e81',
    background: '#ffffff',
    text: '#111827',
    accent: '#e0f2fe',
    sidebar: '#f8fafc'
  },
  fontFamily = '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  isSectionEmpty = (section) => {
    if (!resumeData[section]) {
      return true;
    }
    return Array.isArray(resumeData[section]) ? resumeData[section].length === 0 : false;
  },
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

  const SectionTitle = ({ title, isSidebar = false }) => (
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        fontSize: isSidebar ? "1rem" : "1.125rem",
        color: isSidebar ? colorScheme.secondary : colorScheme.secondary,
        borderBottom: isSidebar ? "none" : `2px solid ${colorScheme.primary}`,
        pb: isSidebar ? 0 : 0.5,
        mb: isSidebar ? "0.75rem" : "1rem",
        mt: isSidebar ? "1.5rem" : "1.5rem",
        ...pdfColorStyles,
      }}
    >
      {title}
    </Typography>
  );

  const SidebarItem = ({ icon: Icon, text, href }) => {
    if (!text) return null;
    return (
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Icon sx={{ fontSize: 16, color: colorScheme.primary, ...pdfColorStyles }} />
        {href ? (
          <Link
            href={href}
            target="_blank"
            rel="noopener"
            sx={{ 
              fontSize: "0.875rem", 
              color: colorScheme.text,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {text}
          </Link>
        ) : (
          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
            {text}
          </Typography>
        )}
      </Stack>
    );
  };

  function Page({ isFirst, leftContent, rightContentChildren }) {
    return (
      <Box
        className={`page with-border ${isFirst ? 'first-page' : 'full-page'}`}
        sx={{
          fontFamily: fontFamily,
          bgcolor: 'white',
          boxSizing: "border-box",
          margin: "0 auto",
          overflow: "hidden",
          display: 'flex',
          flexDirection: 'row',
          '@media print': {
            boxShadow: 'none',
            margin: 0,
          },
          ...(isFirst === false && {
            flexDirection: 'column',
            px: 5,
            py: 6,
          })
        }}
      >
        {isFirst && (
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              px: 4,
              py: 6,
              backgroundColor: colorScheme.sidebar,
              display: "flex",
              flexDirection: "column",
              ...pdfColorStyles,
              width: '33.33%',
              boxSizing: "border-box",
            }}
          >
            {leftContent}
          </Grid>
        )}
       
        <Grid
          item
          xs={12}
          md={isFirst ? 8 : 12}
          sx={{
            px: isFirst ? 5 : 0,
            py: isFirst ? 6 : 0,
            backgroundColor: colorScheme.background,
            display: "flex",
            flexDirection: "column",
            order: 2,
            width: isFirst ? '66.66%' : '100%',
            boxSizing: "border-box",
            ...(isFirst === false && {
              px: 0,
              py: 0,
            })
          }}
        >
          {rightContentChildren.map((item, idx) => (
            <div key={idx} className="content-block">{item}</div>
          ))}
        </Grid>
      </Box>
    );
  }

  const A4_HEIGHT_PX = 1123;
  const RIGHT_COL_WIDTH_PX = (70*1122)/100;

  const measure70Ref = useRef(null);
  const measure100Ref = useRef(null);

  const [firstPageItems, setFirstPageItems] = useState([]);
  const [remainingItems, setRemainingItems] = useState([]);
  const [overflowPages, setOverflowPages] = useState([]);

  const leftContent = useMemo(() => (
    <>
      {/* Profile Section */}
      <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Avatar
          src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1aiuEE17HaLg6OeR3sPYuTDpqFgCCiXX3kw&s"}
          alt={personalInfo.fullName}
          sx={{
            width: 120,
            height: 120,
            fontSize: 48,
            bgcolor: colorScheme.accent,
            color: colorScheme.primary,
            ...pdfColorStyles
          }}
        >
          {(personalInfo.fullName || "A")[0]}
        </Avatar>
        <Typography 
          variant="h6" 
          fontWeight="bold"
          sx={{
            fontSize: "1.125rem",
            color: colorScheme.text,
            textAlign: 'center'
          }}
        >
          {personalInfo.fullName || "Professional Name"}
        </Typography>
        {personalInfo.jobTitle && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: colorScheme.primary,
              fontSize: "1rem",
              textAlign: 'center',
              fontWeight: 500,
              ...pdfColorStyles
            }}
          >
            {personalInfo.jobTitle}
          </Typography>
        )}
      </Stack>

      <Divider sx={{ mb: 2, bgcolor: colorScheme.primary, ...pdfColorStyles }} />

      {/* Contact Information */}
      <Stack spacing={1} sx={{ mb: 3 }}>
        <SidebarItem icon={LocationIcon} text={personalInfo.location} />
        <SidebarItem
          icon={PhoneIcon}
          text={personalInfo.phone}
          href={personalInfo.phone ? `tel:${personalInfo.phone}` : null}
        />
        <SidebarItem
          icon={EmailIcon}
          text={personalInfo.email}
          href={personalInfo.email ? `mailto:${personalInfo.email}` : null}
        />
        <SidebarItem
          icon={LinkedInIcon}
          text={personalInfo.linkedin?.replace(/^https?:\/\/(www\.)?/, "")}
          href={personalInfo.linkedin}
        />
        <SidebarItem
          icon={GitHubIcon}
          text={personalInfo.github?.replace(/^https?:\/\/(www\.)?/, "")}
          href={personalInfo.github}
        />
        <SidebarItem
          icon={LanguageIcon}
          text={personalInfo.portfolio?.replace(/^https?:\/\/(www\.)?/, "")}
          href={personalInfo.portfolio}
        />
        <SidebarItem
          icon={LanguageIcon}
          text={personalInfo.website?.replace(/^https?:\/\/(www\.)?/, "")}
          href={personalInfo.website}
        />
      </Stack>

      {/* Skills */}
      {!isSectionEmpty("skills") && (
        <Box>
          <SectionTitle title="Skills" isSidebar={true} />
          <Stack spacing={2}>
            {skills.map((group, idx) => (
              <Box key={idx}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ 
                    color: colorScheme.secondary, 
                    mb: 0.5,
                    fontSize: "0.875rem",
                    ...pdfColorStyles
                  }}
                >
                  {group.name}
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                  {Array.isArray(group.skills) && group.skills.map((skill, i) => (
                    <Chip
                      key={i}
                      label={skill}
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        backgroundColor: colorScheme.accent,
                        color: colorScheme.primary,
                        height: 24,
                        ...pdfColorStyles
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Education in Sidebar */}
      {!isSectionEmpty("education") && (
        <Box>
          <SectionTitle title="Education" isSidebar={true} />
          <Stack spacing={2}>
            {education.map((edu, idx) => (
              <Box key={idx}>
                <Typography
                  fontWeight="bold"
                  sx={{
                    fontSize: "0.875rem",
                    color: colorScheme.text,
                    lineHeight: 1.3
                  }}
                >
                  {edu.degree} in {edu.field}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: "0.75rem", 
                    color: colorScheme.text,
                    opacity: 0.8
                  }}
                >
                  {edu.institution}
                </Typography>
                {edu.location && (
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontSize: "0.75rem", 
                      color: colorScheme.text,
                      opacity: 0.7
                    }}
                  >
                    {edu.location}
                  </Typography>
                )}
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontSize: "0.7rem", 
                    color: colorScheme.text,
                    opacity: 0.6
                  }}
                >
                  {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                </Typography>
                {edu.description && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 0.5,
                      fontSize: "0.75rem",
                      color: colorScheme.text,
                      lineHeight: 1.3
                    }}
                  >
                    {edu.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </>
  ), [personalInfo, skills, education, colorScheme, pdfColorStyles, isSectionEmpty, formatDate]);

  // Right main content
  const rightContent = useMemo(() => ([
    // Professional Summary
    personalInfo.summary && (
      <Box sx={{ mb: 3 }}>
        <SectionTitle title="Professional Summary" />
        <Typography 
          variant="body2" 
          sx={{ 
            color: colorScheme.text,
            fontSize: "1rem",
            lineHeight: 1.5,
            textAlign: "justify"
          }}
        >
          {personalInfo.summary}
        </Typography>
      </Box>
    ),

    // Work Experience
    !isSectionEmpty("experience") && (
      <Box>
        <SectionTitle title="Work Experience" />
        {experience.map((exp, idx) => (
          <Box key={idx} sx={{ mb: 3 }}>
            <Typography 
              fontWeight="bold"
              sx={{
                fontSize: "1.125rem",
                color: colorScheme.text,
                mb: 0.5
              }}
            >
              {exp.position} @ {exp.company}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: "0.875rem", 
                color: colorScheme.text,
                opacity: 0.7,
                mb: 0.5
              }}
            >
              {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
            </Typography>
            {exp.location && (
              <Typography 
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  color: colorScheme.text,
                  opacity: 0.8,
                  mb: 1
                }}
              >
                {exp.location}
              </Typography>
            )}
            {exp.description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1,
                  fontSize: "1rem",
                  color: colorScheme.text,
                  lineHeight: 1.4
                }}
              >
                {exp.description}
              </Typography>
            )}
            {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
              <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                {exp.responsibilities.map((item, i) => 
                  item && item.trim() && (
                    <Typography
                      component="li"
                      variant="body2"
                      key={i}
                      sx={{
                        mb: 0.5,
                        fontSize: "0.875rem",
                        lineHeight: 1.4,
                        color: colorScheme.text
                      }}
                    >
                      {item.replace(/\n/g, '')}
                    </Typography>
                  )
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    ),

    // Projects
    !isSectionEmpty("projects") && (
      <Box>
        <SectionTitle title="Projects" />
        {projects.map((project, idx) => (
          <Box key={idx} sx={{ mb: 3 }}>
            <Typography 
              fontWeight="bold"
              sx={{
                fontSize: "1.125rem",
                color: colorScheme.text
              }}
            >
              {project.title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: "0.875rem", 
                color: colorScheme.text,
                opacity: 0.7,
                mb: 0.5
              }}
            >
              {formatDate(project.startDate)} – {project.current ? "Present" : formatDate(project.endDate)}
            </Typography>
            {project.link && (
              <Link
                href={project.link}
                target="_blank"
                underline="hover"
                sx={{ 
                  fontSize: "0.875rem", 
                  color: colorScheme.primary,
                  display: "block",
                  mb: 0.5,
                  ...pdfColorStyles
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
                  color: colorScheme.text,
                  opacity: 0.8,
                  mb: 0.5,
                  fontSize: "0.875rem"
                }}
              >
                Technologies: {project.technologies}
              </Typography>
            )}
            {project.description && (
              <Typography 
                variant="body2"
                sx={{
                  fontSize: "1rem",
                  color: colorScheme.text,
                  lineHeight: 1.4,
                  textAlign: "justify"
                }}
              >
                {project.description}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    ),

    // References
    isSectionEmpty("references") && (
      <Box>
        <SectionTitle title="References" />
        <Grid container spacing={3}>
          {references.map((ref, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Box
                sx={{
                  p: 2.5,
                  border: `1px solid ${colorScheme.accent}`,
                  borderRadius: 2,
                  backgroundColor: colorScheme.background,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  ...pdfColorStyles
                }}
              >
                <Typography 
                  fontWeight="bold"
                  sx={{
                    fontSize: "1rem",
                    color: colorScheme.text,
                    mb: 0.5
                  }}
                >
                  {ref.name}
                </Typography>
                {ref.position && (
                  <Typography 
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: colorScheme.text,
                      opacity: 0.8
                    }}
                  >
                    {ref.position}
                  </Typography>
                )}
                {ref.company && (
                  <Typography 
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: colorScheme.text,
                      opacity: 0.8
                    }}
                  >
                    {ref.company}
                  </Typography>
                )}
                {ref.email && (
                  <Typography 
                    variant="body2"
                    sx={{
                      fontSize: "0.8rem",
                      color: colorScheme.text,
                      opacity: 0.7
                    }}
                  >
                    Email: {ref.email}
                  </Typography>
                )}
                {ref.contact && (
                  <Typography 
                    variant="body2"
                    sx={{
                      fontSize: "0.8rem",
                      color: colorScheme.text,
                      opacity: 0.7
                    }}
                  >
                    Phone: {ref.contact}
                  </Typography>
                )}
                {ref.relationship && (
                  <Typography 
                    variant="body2"
                    sx={{
                      fontSize: "0.8rem",
                      color: colorScheme.text,
                      opacity: 0.7
                    }}
                  >
                    Relationship: {ref.relationship}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    ),

  ].filter(Boolean)), [personalInfo, experience, projects, references, colorScheme, pdfColorStyles, isSectionEmpty, formatDate]);

  // Pagination logic (same as India template)
  const paginateContent = () => {
    setFirstPageItems([]);
    setRemainingItems([]);
    setOverflowPages([]);

    setTimeout(() => {
      if (!measure70Ref.current || !measure100Ref.current) return;

      const blocks70 = Array.from(measure70Ref.current.children);
      let usedHeight70 = 0;
      let firstPageRightContentCount = 0;

      const MAX_FIRST_PAGE_RIGHT_HEIGHT = A4_HEIGHT_PX - (6 * 16 * 2);

      for (let i = 0; i < blocks70.length; i++) {
        const blockHeight = blocks70[i].offsetHeight;
        if (usedHeight70 + blockHeight <= MAX_FIRST_PAGE_RIGHT_HEIGHT) {
          usedHeight70 += blockHeight;
          firstPageRightContentCount++;
        } else {
          break;
        }
      }

      const firstPageRight = rightContent.slice(0, firstPageRightContentCount);
      const remaining = rightContent.slice(firstPageRightContentCount);

      setFirstPageItems(firstPageRight);
      setRemainingItems(remaining);

      if (remaining.length > 0) {
        setTimeout(() => {
          if (!measure100Ref.current) return;

          const blocks100 = Array.from(measure100Ref.current.children);
          const pages = [];
          let currentPageItems = [];
          let currentPageHeight = 0;

          const MAX_FULL_PAGE_HEIGHT = A4_HEIGHT_PX - (6 * 16 * 2);

          for (let i = 0; i < blocks100.length; i++) {
            const blockHeight = blocks100[i].offsetHeight;

            if (currentPageHeight + blockHeight > MAX_FULL_PAGE_HEIGHT) {
              if (currentPageItems.length > 0) {
                pages.push(currentPageItems);
              }
              currentPageItems = [remaining[i]];
              currentPageHeight = blockHeight;
            } else {
              currentPageItems.push(remaining[i]);
              currentPageHeight += blockHeight;
            }
          }

          if (currentPageItems.length > 0) {
            pages.push(currentPageItems);
          }
          setOverflowPages(pages);
        }, 0);
      }
    }, 0);
  };

  useEffect(() => {
    paginateContent();
  }, [resumeData, colorScheme]);

  return (
    <PreviewWrapper>
      {/* Hidden measuring blocks */}
      <Box sx={{
        position: 'absolute',
        top: -9999,
        visibility: 'hidden',
        height: 'auto',
        width: `${RIGHT_COL_WIDTH_PX}px`,
        padding: theme.spacing(3, 5, 4, 5),
        boxSizing: 'border-box',
      }}>
        <div className="measure measure-70" ref={measure70Ref}>
          {rightContent.map((item, i) => (
            <div key={`measure-70-${i}`} className="content-block">{item}</div>
          ))}
        </div>
      </Box>

      <Box sx={{
        position: 'absolute',
        top: -9999,
        visibility: 'hidden',
        height: 'auto',
        width: '21cm',
        padding: theme.spacing(3, 5, 4, 5),
        boxSizing: 'border-box',
      }}>
        <div className="measure measure-100" ref={measure100Ref}>
          {remainingItems.map((item, i) => (
            <div key={`measure-100-${i}`} className="content-block">{item}</div>
          ))}
        </div>
      </Box>

      {/* Render Pages */}
      <Page isFirst={true} leftContent={leftContent} rightContentChildren={firstPageItems} />
      {overflowPages.map((pageItems, idx) => (
        <Page key={`overflow-page-${idx}`} isFirst={false} rightContentChildren={pageItems} />
      ))}
    </PreviewWrapper>
  );
};

export default EuropeanUnionTemplate;