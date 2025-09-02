import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Paper,
  Container
} from "@mui/material";
import { ResumeTemplateContent } from "../components/ResumeBuilderPage/DisplayResume/ResumeTemplateContent";
import { constants } from "../components/ResumeBuilderPage/ResumePreview/constants";
import { formatDate, isSectionEmpty, getInitials } from "../components/ResumeBuilderPage/utils/resumeUtils";
import app from "../firebaseConfig";

const { TEMPLATES, FONTS, COLOR_SCHEMES } = constants;

const PortfolioPage = () => {
  const { userId, resumeId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      if (!userId || !resumeId) {
        setError("User ID or Resume ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const db = getDatabase(app);
        const resumeRef = ref(db, `users/${userId}/resumes/${resumeId}`);
        const snapshot = await get(resumeRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = {
            id: resumeId,
            personalInfo: data.resumeData?.personalInfo || {},
            education: data.resumeData?.education || [],
            experience: data.resumeData?.experience || [],
            skills: data.resumeData?.skills || [],
            projects: data.resumeData?.projects || [],
            references: data.resumeData?.references || [],
            activeTemplate: data.metadata?.template || TEMPLATES.MODERN,
            fontFamily: data.metadata?.font || FONTS.POPPINS,
            colorScheme: data.metadata?.color || COLOR_SCHEMES.BLUE,
          };
          setResumeData(formattedData);
        } else {
          setError("Resume not found.");
        }
      } catch (err) {
        console.error("Firebase fetch error:", err);
        setError("Failed to fetch resume data.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [userId, resumeId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Portfolio...</Typography>
      </Box>
    );
  }

  if (error || !resumeData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error || "Portfolio data not found."}
        </Typography>
        <Typography variant="body1">
          Please check the URL or contact the owner of the portfolio.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
            <ResumeTemplateContent
                resumeData={resumeData}
                activeTemplate={resumeData.activeTemplate}
                fontFamily={resumeData.fontFamily}
                colorScheme={resumeData.colorScheme}
                isSectionEmpty={(section) => isSectionEmpty(section, resumeData)}
                getInitials={getInitials}
                formatDate={formatDate}
                isMobile={isMobile}
                isSmallMobile={isSmallMobile}
                starredSections={[]}
                toggleStarSection={() => {}}
            />
        </Paper>
    </Container>
  );
};

export default PortfolioPage;