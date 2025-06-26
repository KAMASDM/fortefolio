import {
  Box,
  Typography,
  Link,
  Stack,
  Chip,
  Avatar,
  Grid,
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
 

const IndiaTemplate = ({
  resumeData,
  formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  colorScheme = {
    primary: '#2c5530',
    secondary: '#1a472a',
    background: '#ffffff',
    text: '#333333',
    accent: '#f0f8f0'
  },
  fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  isSectionEmpty = (section) => {
    if (!resumeData[section]) {
      return true;
    }
    return Array.isArray(resumeData[section]) ? resumeData[section].length === 0 : false;
  },
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

  const SectionTitle = ({ title, isSidebar = false, center = false }) => (
    <Box
      sx={{
        fontSize: isSidebar ? "1rem" : "1.125rem",
        fontWeight: 600,
        color: colorScheme.background,
        bgcolor: colorScheme.primary,
        py: 1,
        mt: "1.5rem",
        mb: isSidebar ? "0.75rem" : "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        pl: center ? 0 : 2,
        ...pdfColorStyles,
      }}
    >
      {title}
    </Box>
  );

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
              backgroundColor: "#e7ecef",
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
          mb: 2,
        }}
      >
        <Box
          sx={{
            borderRadius: "50%",
            padding: "15px",
            bgcolor: colorScheme.background,
            ...pdfColorStyles,
          }}
        >
          <Avatar
            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1aiuEE17HaLg6OeR3sPYuTDpqFgCCiXX3kw&s"}
            alt={personalInfo.fullName}
            sx={{
              width: 120,
              height: 120
            }}
          >
            <PersonIcon sx={{ fontSize: 80 }} />
          </Avatar>
        </Box>
      </Box>

      {/* Contact */}
      <Box>
        <SectionTitle title="CONTACT" center={true} isSidebar={true} />
        <Stack spacing={2}>
          {personalInfo.email && (
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              <EmailIcon fontSize="small" sx={{ mr: 1.5, color: colorScheme.primary, flexShrink: 0, ...pdfColorStyles }} />
              <Typography variant="body2" sx={{ fontSize: "0.875rem", wordBreak: "break-word" }}>
                {personalInfo.email}
              </Typography>
            </Box>
          )}
          {personalInfo.phone && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1.5, color: colorScheme.primary, flexShrink: 0, ...pdfColorStyles }} />
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                {personalInfo.phone}
              </Typography>
            </Box>
          )}
          {personalInfo.location && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationIcon fontSize="small" sx={{ mr: 1.5, color: colorScheme.primary, flexShrink: 0, ...pdfColorStyles }} />
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                {personalInfo.location}
              </Typography>
            </Box>
          )}
          {personalInfo.linkedin && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LinkedInIcon fontSize="small" sx={{ mr: 1.5, color: colorScheme.primary, flexShrink: 0, ...pdfColorStyles }} />
              <Link
                href={personalInfo.linkedin}
                target="_blank"
                variant="body2"
                underline="hover"
                color="inherit"
                sx={{ fontSize: "0.875rem", wordBreak: "break-word" }}
              >
                LinkedIn
              </Link>
            </Box>
          )}
          {personalInfo.github && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <GitHubIcon fontSize="small" sx={{ mr: 1.5, color: colorScheme.primary, flexShrink: 0, ...pdfColorStyles }} />
              <Link
                href={personalInfo.github}
                target="_blank"
                variant="body2"
                underline="hover"
                color="inherit"
                sx={{ fontSize: "0.875rem", wordBreak: "break-word" }}
              >
                GitHub
              </Link>
            </Box>
          )}
          {personalInfo.portfolio && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon fontSize="small" sx={{ mr: 1.5, color: colorScheme.primary, flexShrink: 0, ...pdfColorStyles }} />
              <Link
                href={personalInfo.portfolio}
                target="_blank"
                variant="body2"
                underline="hover"
                color="inherit"
                sx={{ fontSize: "0.875rem", wordBreak: "break-word" }}
              >
                Portfolio
              </Link>
            </Box>
          )}
          {personalInfo.website && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LanguageIcon fontSize="small" sx={{ mr: 1.5, color: colorScheme.primary, flexShrink: 0, ...pdfColorStyles }} />
              <Link
                href={personalInfo.website}
                target="_blank"
                variant="body2"
                underline="hover"
                color="inherit"
                sx={{ fontSize: "0.875rem", wordBreak: "break-word" }}
              >
                Website
              </Link>
            </Box>
          )}
        </Stack>
      </Box>

      {!isSectionEmpty("skills") && (
        <Box>
          <SectionTitle title="SKILLS" center={true} isSidebar={true} />
          <Stack spacing={2}>
            {skills.map((category) => (
              <Box key={category.id}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.secondary,
                    mb: 1,
                    fontSize: "1rem",
                    ...pdfColorStyles
                  }}
                >
                  {category.name}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {Array.isArray(category.skills) &&
                    category.skills.map((skill, idx) =>
                      skill.trim() && (
                        <Chip
                          key={idx}
                          label={skill.trim()}
                          size="small"
                          sx={{
                            bgcolor: colorScheme.accent,
                            color: colorScheme.secondary,
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            height: 28,
                            ...pdfColorStyles
                          }}
                        />
                      )
                    )}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {!isSectionEmpty("education") && (
        <Box>
          <SectionTitle title="EDUCATION" center={true} isSidebar={true} />
          <Stack spacing={2.5}>
            {education.map((edu) => (
              <Box key={edu.id}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.secondary,
                    fontSize: "1rem",
                    lineHeight: 1.3,
                    ...pdfColorStyles
                  }}
                >
                  {edu.degree} in {edu.field}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: 'italic',
                    fontSize: "0.875rem"
                  }}
                >
                  {edu.institution}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: colorScheme.text,
                    fontSize: "0.8rem"
                  }}
                >
                  {edu.location}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: colorScheme.text,
                    display: 'block',
                    fontSize: "0.75rem"
                  }}
                >
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Typography>
                {edu.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      fontSize: "0.8rem",
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

  const rightContent = useMemo(() => ([
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <Typography
        sx={{
          fontSize: "60px",
          fontWeight: 700,
          textTransform: "uppercase",
          color: colorScheme.primary,
          letterSpacing: "4px",
          lineHeight: 1.2,
          textAlign: "left",
          ...pdfColorStyles,
        }}
      >
        {personalInfo.fullName?.split(" ")[0]}
      </Typography>
      <Typography
        sx={{
          fontSize: "50px",
          fontWeight: 500,
          textTransform: "uppercase",
          color: colorScheme.primary,
          letterSpacing: "8px",
          lineHeight: 1,
          textAlign: "left",
          ...pdfColorStyles,
        }}
      >
        {personalInfo.fullName?.split(" ").slice(1).join(" ")}
      </Typography>
    </Box>
    <Typography
      sx={{
        fontSize: "20px",
        fontWeight: 400,
        color: colorScheme.text,
        textTransform: "capitalize",
        letterSpacing: "3px",
        mt: 1,
        textAlign: "left",
      }}
    >
      {personalInfo.jobTitle}
    </Typography>
    {personalInfo.summary && (
      <Typography
        sx={{
          fontSize: "14px",
          color: colorScheme.text,
          letterSpacing: "1px",
          mt: 2,
          textAlign: "justify",
          lineHeight: 1.4
        }}
      >
        {personalInfo.summary}
      </Typography>
    )}
  </Box>,

  !isSectionEmpty("experience") && (
    <Box>
      <SectionTitle title="WORK EXPERIENCE" />
      {experience.map((exp) => (
        <Box key={exp.id} sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: colorScheme.secondary,
              fontSize: "1.25rem",
              ...pdfColorStyles
            }}
          >
            {exp.position}
          </Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
            flexDirection: 'row',
            gap: 0
          }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                color: colorScheme.text
              }}
            >
              {exp.company} {exp.location && `(${exp.location})`}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontStyle: 'italic',
                fontSize: "0.875rem",
                color: colorScheme.text
              }}
            >
              {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
            </Typography>
          </Box>
          <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
            {Array.isArray(exp.responsibilities) && exp.responsibilities.map((line, idx) =>
              line && line.trim() && (
                <Typography
                  component="li"
                  variant="body2"
                  key={idx}
                  sx={{
                    mb: 0.5,
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                    color: colorScheme.text
                  }}
                >
                  {line.replace(/\n/g, '')}
                </Typography>
              )
            )}
          </Box>
        </Box>
      ))}
    </Box>
  ),

  !isSectionEmpty("projects") && (
    <Box>
      <SectionTitle title="PROJECTS" />
      {projects.map((project) => (
        <Box key={project.id} sx={{ mb: 3 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 0
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: colorScheme.secondary,
                fontSize: "1.25rem",
                ...pdfColorStyles
              }}
            >
              {project.title}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontStyle: 'italic',
                fontSize: "0.875rem",
                color: colorScheme.text
              }}
            >
              {formatDate(project.startDate)} - {project.current ? "Present" : formatDate(project.endDate)}
            </Typography>
          </Box>
          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              underline="hover"
              sx={{
                fontSize: "0.9rem",
                color: colorScheme.primary,
                display: "block",
                mb: 0.5,
                wordBreak: "break-word",
                ...pdfColorStyles
              }}
            >
              View Project
            </Link>
          )}
          <Typography
            variant="subtitle1"
            sx={{
              fontStyle: 'italic',
              my: 1,
              fontSize: "1rem",
              fontWeight: 500,
              color: colorScheme.secondary
            }}
          >
            {project.technologies}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.875rem",
              lineHeight: 1.4,
              textAlign: "justify",
              color: colorScheme.text
            }}
          >
            {project.description}
          </Typography>
        </Box>
      ))}
    </Box>
  ),

  isSectionEmpty("references") && (
    <Box>
      <SectionTitle title="REFERENCES" />
      <Grid container spacing={3}>
        {references.map((ref) => (
          <Grid item xs={12} sm={6} key={ref.id}>
            <Box
              sx={{
                p: 2.5,
                border: `2px solid ${colorScheme.accent}`,
                borderRadius: 2,
                backgroundColor: colorScheme.background,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: colorScheme.primary,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
                ...pdfColorStyles,
              }}
            >
              {/* Reference Header */}
              <Box sx={{ mb: 1.5 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: colorScheme.primary,
                    fontSize: "1.125rem",
                    lineHeight: 1.2,
                    ...pdfColorStyles,
                  }}
                >
                  {ref.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: colorScheme.secondary,
                    fontSize: "1rem",
                    mt: 0.5,
                    ...pdfColorStyles,
                  }}
                >
                  {ref.position}
                </Typography>
              </Box>

              {/* Company */}
              <Box sx={{ mb: 1.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.875rem",
                    color: colorScheme.text,
                    fontWeight: 500,
                  }}
                >
                  {ref.company}
                </Typography>
              </Box>

              <Stack spacing={0.8}>
                {ref.email && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmailIcon
                      fontSize="small"
                      sx={{
                        mr: 1,
                        color: colorScheme.primary,
                        fontSize: "18px",
                        ...pdfColorStyles,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        color: colorScheme.text,
                        wordBreak: "break-word",
                        lineHeight: 1.3,
                      }}
                    >
                      {ref.email}
                    </Typography>
                  </Box>
                )}
                {ref.contact && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon
                      fontSize="small"
                      sx={{
                        mr: 1,
                        color: colorScheme.primary,
                        fontSize: "18px",
                        ...pdfColorStyles,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        color: colorScheme.text,
                        lineHeight: 1.3,
                      }}
                    >
                      {ref.contact}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  ),

].filter(Boolean)), [personalInfo, experience, projects, references, colorScheme, pdfColorStyles, isSectionEmpty, formatDate]);

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
      <Box sx={{
        position: 'absolute',
        top: -9999,
        visibility: 'hidden',
        height: 'auto',
        width: `${RIGHT_COL_WIDTH_PX}px`,
        padding: '48px 80px 64px 80px',
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
        padding: '48px 80px 64px 80px',
        boxSizing: 'border-box',
      }}>
        <div className="measure measure-100" ref={measure100Ref}>
          {remainingItems.map((item, i) => (
            <div key={`measure-100-${i}`} className="content-block">{item}</div>
          ))}
        </div>
      </Box>

      <Page isFirst={true} leftContent={leftContent} rightContentChildren={firstPageItems} />
      {overflowPages.map((pageItems, idx) => (
        <Page key={`overflow-page-${idx}`} isFirst={false} rightContentChildren={pageItems} />
      ))}
    </PreviewWrapper>
  );
};

export default IndiaTemplate;