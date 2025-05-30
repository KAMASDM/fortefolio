import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Button,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AnimatedBackground from "../../AnimatedBackground";
import FloatingElements from "../../FloatingElements";

const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
  gradient: "linear-gradient(135deg, #B9A5E3 0%, #7F68C9 100%)",
  accentGradient: "linear-gradient(45deg, #A190DD 30%, #7F68C9 90%)",
};

const blogPosts = [
  {
    slug: "how-to-write-a-killer-resume-in-2025",
    title: "How to Write a Killer Resume in 2025",
    excerpt:
      "Learn the key ingredients for a standout resume that grabs the attention of recruiters and hiring managers in today's competitive job market.",
    imageUrl: "https://source.unsplash.com/random/800x600?resume,document",
    author: {
      name: "David Chen",
      avatarUrl: "https://source.unsplash.com/random/100x100?man,professional",
    },
    publicationDate: "2025-05-22",
    tags: ["Resume", "Job Application", "Career"],
    readTime: 7,
  },
  {
    slug: "ats-friendly-resume-beating-the-bots",
    title: "The ATS-Friendly Resume: Beating the Bots",
    excerpt:
      "Over 75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human sees them. Here's how to format yours to pass the test.",
    imageUrl: "https://source.unsplash.com/random/800x600?robot,technology",
    author: {
      name: "Maria Garcia",
      avatarUrl: "https://source.unsplash.com/random/100x100?woman,tech",
    },
    publicationDate: "2025-05-18",
    tags: ["ATS", "Resume", "Tech"],
    readTime: 8,
  },
  {
    slug: "building-your-personal-brand-beyond-resume",
    title: "Beyond the Resume: Building Your Personal Brand",
    excerpt:
      "Your resume is just one piece of the puzzle. Discover how to build a strong personal brand on platforms like LinkedIn to supercharge your career.",
    imageUrl:
      "https://source.unsplash.com/random/800x600?branding,social-media",
    author: {
      name: "Sarah Jenkins",
      avatarUrl: "https://source.unsplash.com/random/100x100?woman,creative",
    },
    publicationDate: "2025-05-12",
    tags: ["Branding", "LinkedIn", "Networking"],
    readTime: 9,
  },
  {
    slug: "top-10-power-words-for-your-resume",
    title: "Top 10 Power Words to Supercharge Your Resume",
    excerpt:
      "Swap out boring words for impactful verbs that showcase your achievements. We list the top 10 words that will make your resume more dynamic.",
    imageUrl: "https://source.unsplash.com/random/800x600?writing,inspiration",
    author: {
      name: "Alex Johnson",
      avatarUrl: "https://source.unsplash.com/random/100x100?developer,face",
    },
    publicationDate: "2025-05-07",
    tags: ["Writing", "Career", "Tips"],
    readTime: 5,
  },
];

const Blogs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleReadMore = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <AnimatedBackground />
      <FloatingElements />
      <Box
        sx={{
          bgcolor: lavenderPalette.light,
          backgroundImage: `radial-gradient(${alpha(
            lavenderPalette.soft,
            0.2
          )} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          py: { xs: 4, md: 6 },
          minHeight: "100vh",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Container maxWidth="xl">
            <Box sx={{ textAlign: "left", mb: 3 }}>
              <Button
                variant="outlined"
                onClick={handleBackClick}
                sx={{
                  borderColor: lavenderPalette.primary,
                  color: lavenderPalette.primary,
                  "&:hover": {
                    bgcolor: alpha(lavenderPalette.primary, 0.08),
                    borderColor: alpha(lavenderPalette.primary, 0.7),
                  },
                }}
                size="small"
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
            </Box>
          </Container>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: lavenderPalette.darkText,
              background: lavenderPalette.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 2,
            }}
          >
            Our Blogs
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography
            variant={isMobile ? "body1" : "h6"}
            align="center"
            sx={{
              color: lavenderPalette.text,
              mb: { xs: 4, md: 6 },
              maxWidth: 700,
              mx: "auto",
              px: 2,
            }}
          >
            Insights and advice to help you build a standout resume and advance
            your career.
          </Typography>
        </motion.div>
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 3, sm: 4 },
            py: { xs: 4, md: 6 },
            px: { xs: 2, sm: 4, md: 6 },
          }}
        >
          {blogPosts.map((post) => (
            <motion.div
              key={post.slug}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  borderRadius: 4,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  backgroundColor: alpha(lavenderPalette.light, 0.5),
                }}
              >
                <CardMedia
                  component="img"
                  image={post.imageUrl}
                  alt={post.title}
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        mb: 1.5,
                      }}
                    >
                      {post.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          sx={{
                            backgroundColor: alpha(
                              lavenderPalette.primary,
                              0.1
                            ),
                            color: lavenderPalette.primary,
                            fontWeight: 600,
                          }}
                          size="small"
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: lavenderPalette.darkText,
                        mb: 1,
                        cursor: "pointer",
                        "&:hover": { color: lavenderPalette.primary },
                      }}
                      onClick={() => handleReadMore(post.slug)}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: lavenderPalette.text,
                        mb: 2,
                        minHeight: 60,
                      }}
                    >
                      {post.excerpt}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: lavenderPalette.soft,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ color: lavenderPalette.darkText }}
                        >
                          {post.author.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: lavenderPalette.text }}
                        >
                          {new Date(post.publicationDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      onClick={() => handleReadMore(post.slug)}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ color: lavenderPalette.primary }}
                    >
                      Read
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Blogs;
