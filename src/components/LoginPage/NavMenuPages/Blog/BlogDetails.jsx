import React from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  Button,
  useTheme,
  alpha,
  Stack,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
};

const blogPosts = [
  {
    slug: "how-to-write-a-killer-resume-in-2025",
    title: "How to Write a Killer Resume in 2025",
    excerpt:
      "Learn the key ingredients for a standout resume that grabs the attention of recruiters and hiring managers in today's competitive job market.",
    content: `
      <p>Crafting a compelling resume is the first and most crucial step in your job search. It's your personal marketing document. In 2025, a 'killer' resume is clean, targeted, and showcases quantifiable achievements.</p>
      <h3>1. The Header: Make it Easy to Contact You</h3>
      <p>Your name should be prominent, followed by your phone number, professional email, and a link to your LinkedIn profile. Avoid including a full physical address; city and state are sufficient.</p>
      <h3>2. The Professional Summary: Your Elevator Pitch</h3>
      <p>Right below the header, write a 2-4 sentence summary highlighting your years of experience, key skills, and career goals. Tailor this for every job application to match the role's requirements.</p>
      <h3>3. The Experience Section: Show, Don't Just Tell</h3>
      <p>Use reverse-chronological order. For each role, use bullet points with action verbs to describe your accomplishments. For example, instead of 'Responsible for sales,' write 'Increased quarterly sales by 15% through strategic client outreach.'</p>
      <h3>4. Skills & Education</h3>
      <p>Include a dedicated skills section with relevant hard and soft skills. List your highest degree, university, and graduation date. Certifications and other training can also go here.</p>
    `,
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
    content: `
      <p>An Applicant Tracking System (ATS) is software used by recruiters to filter candidates. To ensure your resume gets seen by a human, you need to optimize it for these bots.</p>
      <h3>1. Keyword Optimization is Crucial</h3>
      <p>Carefully read the job description and incorporate relevant keywords and phrases naturally throughout your resume, especially in the summary and experience sections. If the description mentions "project management" and "agile methodologies," make sure those terms are in your resume.</p>
      <h3>2. Use Standard Formatting</h3>
      <p>Stick to a clean, simple layout. Use standard fonts like Arial, Calibri, or Times New Roman. Avoid tables, columns, headers, and footers, as many ATS systems cannot parse them correctly.</p>
      <h3>3. Submit the Right File Type</h3>
      <p>Unless the application specifies otherwise, submit your resume as a .docx or .pdf file. PDFs are great for preserving formatting, but some older ATS systems prefer .docx files.</p>
    `,
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
    content: `
      <p>In the digital age, your personal brand is your professional reputation. It's how you present yourself to the world and what sets you apart. A strong brand can open doors to opportunities you never thought possible.</p>
      <h3>1. Optimize Your LinkedIn Profile</h3>
      <p>Your LinkedIn profile is often the first result when someone googles your name. Use a professional headshot, write a compelling headline, and ensure your 'About' section tells your career story.</p>
      <h3>2. Network Authentically</h3>
      <p>Engage with content in your field. Share insightful articles, comment on posts from industry leaders, and connect with peers. The goal is to build relationships, not just collect contacts.</p>
      <h3>3. Showcase Your Expertise</h3>
      <p>Consider starting a blog, contributing to industry publications, or speaking at events. Creating content demonstrates your knowledge and establishes you as a thought leader in your space.</p>
    `,
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
    content: `
      <p>The words you choose on your resume can dramatically alter its impact. Replacing passive phrases with strong action verbs makes you sound more capable and accomplished.</p>
      <h3>Here are 10 power words to get you started:</h3>
      <ul>
        <li><strong>Orchestrated:</strong> Great for showing leadership and organizational skills. (e.g., "Orchestrated a company-wide transition to a new software system.")</li>
        <li><strong>Spearheaded:</strong> Implies you took the lead on a project.</li>
        <li><strong>Accelerated:</strong> Shows you improved the speed of a process or growth.</li>
        <li><strong>Engineered:</strong> Perfect for technical or problem-solving roles.</li>
        <li><strong>Negotiated:</strong> Demonstrates communication and business skills.</li>
        <li><strong>Maximized:</strong> Shows you improved efficiency or output.</li>
        <li><strong>Streamlined:</strong> Highlights your ability to simplify complex processes.</li>
        <li><strong>Quantified:</strong> Use this to introduce a data-backed achievement.</li>
        <li><strong>Innovated:</strong> Shows creativity and forward-thinking.</li>
        <li><strong>Mentored:</strong> Demonstrates leadership and team-building skills.</li>
      </ul>
    `,
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

const MotionPaper = motion(Paper);

const BlogDetails = () => {
  const { slug } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const blog = blogPosts.find((post) => post.slug === slug);

  if (!blog) {
    return (
      <Container>
        <Typography variant="h5" color="error" mt={4}>
          Blog post not found.
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <FloatingElements />
      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 2, py: { xs: 4, md: 6 } }}
      >
        <MotionPaper
          elevation={4}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            backgroundColor: alpha("#ffffff", 0.85),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(lavenderPalette.primary, 0.2)}`,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/blogs")}
            sx={{
              mb: 3,
              color: lavenderPalette.primary,
              borderColor: lavenderPalette.primary,
              "&:hover": {
                bgcolor: alpha(lavenderPalette.primary, 0.08),
              },
            }}
          >
            Back to Blogs
          </Button>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            fontWeight={700}
            gutterBottom
            sx={{ color: lavenderPalette.darkText }}
          >
            {blog.title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Avatar
              src={blog.author.avatarUrl}
              alt={blog.author.name}
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ color: lavenderPalette.darkText }}
              >
                {blog.author.name}
              </Typography>
              <Typography variant="body2" sx={{ color: lavenderPalette.text }}>
                {new Date(blog.publicationDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                • {blog.readTime} min read
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
            {blog.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                sx={{
                  backgroundColor: alpha(lavenderPalette.primary, 0.1),
                  color: lavenderPalette.primary,
                  fontWeight: 600,
                }}
                size="small"
              />
            ))}
          </Stack>
          <Box
            component="img"
            src={blog.imageUrl}
            alt={blog.title}
            sx={{
              width: "100%",
              height: { xs: 220, md: 400 },
              objectFit: "cover",
              borderRadius: 3,
              mb: 4,
            }}
          />
          <Box
            component="div"
            sx={{
              color: lavenderPalette.text,
              lineHeight: 1.8,
              fontSize: { xs: "1rem", md: "1.1rem" },
              "& ul, & ol": { pl: 3, mb: 2 },
              "& li": { mb: 1 },
              "& h3": {
                mt: 3.5,
                mb: 1.5,
                fontWeight: "bold",
                color: lavenderPalette.darkText,
              },
              "& p": { mb: 2 },
              "& strong": { color: lavenderPalette.darkText },
              "& a": {
                color: lavenderPalette.deep,
                textDecoration: "underline",
              },
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </MotionPaper>
      </Container>
    </>
  );
};

export default BlogDetails;
