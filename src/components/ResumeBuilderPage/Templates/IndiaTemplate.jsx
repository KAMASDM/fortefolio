import {
  Box,
  Typography,
  Link,
  Stack,
  Chip,
  Avatar,
  Grid,
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
  PersonOutline as PersonIcon,
} from "@mui/icons-material";

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
    console.log('section: ', section);
    console.log('resumeData[section]: ', resumeData[section]);
    if (!resumeData[section]) {
      return true;
    }
    return Array.isArray(resumeData[section]) ? resumeData[section].length === 0 : false;
  },
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
    references = [],
  } = resumeData;
  console.log('resumeData: ', resumeData);
  
  const pdfColorStyles = {
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
    colorAdjust: "exact",
  };
  
  const SectionTitle = ({ title, isSidebar = false, center = false }) => (
    <Box
    sx={{
      fontSize: isSidebar ? { xs: "0.9rem", sm: "1rem" } : { xs: "1rem", sm: "1.125rem" },
      fontWeight: 600,
      color: colorScheme.background,
      bgcolor: colorScheme.primary,
      py: { xs: 0.75, sm: 1 },
        mt: { xs: "1rem", sm: "1.5rem" },
        mb: isSidebar ? { xs: "0.5rem", sm: "0.75rem" } : { xs: "0.75rem", sm: "1rem" },
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        pl: center ? 0 : { xs: 1, sm: 2 },
        ...pdfColorStyles,
      }}
      >
      {title}
    </Box>
  );
  
  console.log('references: ', references);
  console.log('!isSectionEmpty("references"): ', !isSectionEmpty("references"));



  return (
    <Box sx={{ 
      fontFamily: fontFamily, 
      bgcolor: 'white',
      minHeight: { xs: 'auto', md: "29.7cm" }
    }}>
      <Grid container sx={{ 
        minHeight: { xs: 'auto', md: "29.7cm" },
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        {/* Sidebar */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, sm: 4, md: 6 },
            backgroundColor: "#e7ecef",
            display: "flex",
            flexDirection: "column",
            order: { xs: 2, md: 1 },
            ...pdfColorStyles,
          }}
        >
          {/* Profile Image */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: { xs: 150, sm: 180, md: 200 },
              mb: 2,
            }}
          >
            <Box
              sx={{
                borderRadius: "50%",
                padding: { xs: "10px", sm: "12px", md: "15px" },
                bgcolor: colorScheme.background,
                ...pdfColorStyles,
              }}
            >
              <Avatar
                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1aiuEE17HaLg6OeR3sPYuTDpqFgCCiXX3kw&s"}
                alt={personalInfo.fullName}
                sx={{ 
                  width: { xs: 100, sm: 120, md: 150 }, 
                  height: { xs: 100, sm: 120, md: 150 } 
                }}
              >
                <PersonIcon sx={{ fontSize: { xs: 50, sm: 60, md: 80 } }} />
              </Avatar>
            </Box>
          </Box>

          {/* Contact */}
          <Box>
            <SectionTitle title="CONTACT" center={true} isSidebar={true} />
            <Stack spacing={{ xs: 1.5, sm: 2 }}>
              {personalInfo.email && (
                <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1.5, color: colorScheme.primary, flexShrink: 0, ...pdfColorStyles }} />
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, wordBreak: "break-word" }}>
                    {personalInfo.email}
                  </Typography>
                </Box>
              )}
              {personalInfo.phone && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1.5, color: colorScheme.primary, flexShrink: 0, ...pdfColorStyles }} />
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    {personalInfo.phone}
                  </Typography>
                </Box>
              )}
              {personalInfo.location && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationIcon fontSize="small" sx={{ mr: 1.5, color: colorScheme.primary, flexShrink: 0, ...pdfColorStyles }} />
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
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
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, wordBreak: "break-word" }}
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
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, wordBreak: "break-word" }}
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
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, wordBreak: "break-word" }}
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
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, wordBreak: "break-word" }}
                  >
                    Website
                  </Link>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Skills */}
          {!isSectionEmpty("skills") && (
            <Box>
              <SectionTitle title="SKILLS" center={true} isSidebar={true} />
              <Stack spacing={{ xs: 1.5, sm: 2 }}>
                {skills.map((category) => (
                  <Box key={category.id}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600, 
                        color: colorScheme.secondary, 
                        mb: 1, 
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        ...pdfColorStyles 
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 0.5, sm: 0.75 } }}>
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
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                height: { xs: 24, sm: 28 },
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

          {/* Education */}
          {!isSectionEmpty("education") && (
            <Box>
              <SectionTitle title="EDUCATION" center={true} isSidebar={true} />
              <Stack spacing={{ xs: 2, sm: 2.5 }}>
                {education.map((edu) => (
                  <Box key={edu.id}>
                    <Typography 
                      sx={{ 
                        fontWeight: 600, 
                        color: colorScheme.secondary, 
                        fontSize: { xs: "0.875rem", sm: "1rem" },
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
                        fontSize: { xs: "0.75rem", sm: "0.875rem" }
                      }}
                    >
                      {edu.institution}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colorScheme.text, 
                        fontSize: { xs: "0.7rem", sm: "0.8rem" }
                      }}
                    >
                      {edu.location}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: colorScheme.text, 
                        display: 'block',
                        fontSize: { xs: "0.65rem", sm: "0.75rem" }
                      }}
                    >
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Typography>
                    {edu.description && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 0.5, 
                          fontSize: { xs: "0.7rem", sm: "0.8rem" },
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

           
        </Grid>

        {/* Main Content */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            px: { xs: 2, sm: 3, md: 5 },
            py: { xs: 3, sm: 4, md: 6 },
            backgroundColor: colorScheme.background,
            display: "flex",
            flexDirection: "column",
            order: { xs: 1, md: 2 },
          }}
        >
          {/* Header */}
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "center", md: "flex-start" } }}>
              <Typography 
                sx={{ 
                  fontSize: { xs: "28px", sm: "40px", md: "50px", lg: "60px" }, 
                  fontWeight: 700, 
                  textTransform: "uppercase", 
                  color: colorScheme.primary, 
                  letterSpacing: { xs: "2px", sm: "3px", md: "4px" }, 
                  lineHeight: { xs: 1.1, md: 1.2 },
                  textAlign: { xs: "center", md: "left" },
                  ...pdfColorStyles,
                }}
              >
                {personalInfo.fullName?.split(" ")[0]}
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: { xs: "24px", sm: "32px", md: "40px", lg: "50px" }, 
                  fontWeight: 500, 
                  textTransform: "uppercase", 
                  color: colorScheme.primary, 
                  letterSpacing: { xs: "4px", sm: "6px", md: "8px" }, 
                  lineHeight: { xs: 0.9, md: 1 },
                  textAlign: { xs: "center", md: "left" },
                  ...pdfColorStyles,
                }}
              >
                {personalInfo.fullName?.split(" ").slice(1).join(" ")}
              </Typography>
            </Box>
            <Typography 
              sx={{ 
                fontSize: { xs: "14px", sm: "16px", md: "18px", lg: "20px" }, 
                fontWeight: 400, 
                color: colorScheme.text, 
                textTransform: "capitalize", 
                letterSpacing: { xs: "1px", sm: "2px", md: "3px" }, 
                mt: 1,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {personalInfo.jobTitle}
            </Typography>
            {personalInfo.summary && (
              <Typography 
                sx={{ 
                  fontSize: { xs: "12px", sm: "13px", md: "14px" }, 
                  color: colorScheme.text, 
                  letterSpacing: "1px", 
                  mt: { xs: 1.5, sm: 2 }, 
                  textAlign: "justify",
                  lineHeight: 1.4
                }}
              >
                {personalInfo.summary}
              </Typography>
            )}
          </Box>

          {/* WORK EXPERIENCE */}
          {!isSectionEmpty("experience") && (
            <Box>
              <SectionTitle title="WORK EXPERIENCE" />
              {experience.map((exp) => (
                <Box key={exp.id} sx={{ mb: { xs: 2.5, sm: 3 } }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: colorScheme.secondary,
                      fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                      ...pdfColorStyles 
                    }}
                  >
                    {exp.position}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1, 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 0.5, sm: 0 }
                  }}>
                    <Typography 
                      variant="subtitle1"
                      sx={{ 
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        fontWeight: 500
                      }}
                    >
                      {exp.company} {exp.location && `(${exp.location})`}
                    </Typography>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontStyle: 'italic',
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        color: colorScheme.text
                      }}
                    >
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ pl: { xs: 1.5, sm: 2 }, mt: 1, mb: 0 }}>
                    {Array.isArray(exp.responsibilities) && exp.responsibilities.map((line, idx) => 
                      line && line.trim() && (
                        <Typography 
                          component="li" 
                          variant="body2" 
                          key={idx} 
                          sx={{ 
                            mb: 0.5,
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            lineHeight: 1.4
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
          )}

          {/* PROJECTS */}
          {!isSectionEmpty("projects") && (
            <Box>
              <SectionTitle title="PROJECTS" />
              {projects.map((project) => (
                <Box key={project.id} sx={{ mb: { xs: 2.5, sm: 3 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 0.5, sm: 0 }
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: colorScheme.secondary,
                        fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                        ...pdfColorStyles 
                      }}
                    >
                      {project.title}
                    </Typography>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontStyle: 'italic',
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                        fontSize: { xs: "0.8rem", sm: "0.9rem" }, 
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
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontWeight: 500,
                      color: colorScheme.secondary
                    }}
                  >
                    {project.technologies}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      lineHeight: 1.4,
                      textAlign: "justify"
                    }}
                  >
                    {project.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* References Section - Redesigned */}
          {isSectionEmpty("references") && (
            <Box>
              <SectionTitle title="REFERENCES" />
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {references.map((ref) => (
                  <Grid item xs={12} sm={6} key={ref.id}>
                    <Box
                      sx={{
                        p: { xs: 2, sm: 2.5 },
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
                            fontSize: { xs: "1rem", sm: "1.125rem" },
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
                            fontSize: { xs: "0.875rem", sm: "1rem" },
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
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            color: colorScheme.text,
                            fontWeight: 500,
                          }}
                        >
                          {ref.company}
                        </Typography>
                      </Box>

                      {/* Contact Information */}
                      <Stack spacing={0.8}>
                        {ref.email && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <EmailIcon
                              fontSize="small"
                              sx={{
                                mr: 1,
                                color: colorScheme.primary,
                                fontSize: { xs: "16px", sm: "18px" },
                                ...pdfColorStyles,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
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
                                fontSize: { xs: "16px", sm: "18px" },
                                ...pdfColorStyles,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
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
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default IndiaTemplate;