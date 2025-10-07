import React, { useEffect, useState, useCallback } from "react";
import {
  CircularProgress,
  Skeleton,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Divider,
  InputAdornment,
  Alert
} from "@mui/material";
import { Search as SearchIcon, LocationOn as LocationIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

// --- Helper component for a single job listing ---
const JobListing = ({ job }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      mb: 2,
      transition: "box-shadow 0.3s",
      "&:hover": {
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      },
    }}
  >
    <Link
      href={job.applicationInfo?.uris?.[0] || '#'}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      color="inherit"
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#2E2152" }}>
        {job.title}
      </Typography>
    </Link>
    <Typography variant="body1" sx={{ color: "#4A3B77", fontWeight: 500 }}>
      {job.companyDisplayName}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {(job.addresses || []).join(', ')}
    </Typography>
    <Typography
        variant="body2"
        sx={{ color: "#4A3B77", mb: 2, maxHeight: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}
        dangerouslySetInnerHTML={{ __html: job.descriptionSnippet || 'No description available.' }}
    />
    <Button
      variant="contained"
      href={job.applicationInfo?.uris?.[0] || '#'}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        bgcolor: "#9D88D9",
        "&:hover": { bgcolor: "#7F68C9" },
      }}
    >
      Apply Now
    </Button>
  </Paper>
);


// --- Main JobSearch Component ---
const JobSearch = ({ resumeTitle, resumeData }) => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for user filters
  const [keywords, setKeywords] = useState(resumeTitle || "");
  const [location, setLocation] = useState("");

  // Backend API URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Extract skills from resume data for better job matching
  const extractSkillsFromResume = () => {
    const skills = [];
    
    // Get skills from resume
    if (resumeData?.skills && Array.isArray(resumeData.skills)) {
      skills.push(...resumeData.skills.map(s => s.name || s));
    }
    
    return skills.filter(Boolean);
  };

  const fetchJobs = useCallback(async () => {
    if (!keywords.trim() && !location.trim()) {
      setError("Please enter job keywords or location to search.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract skills from resume for better matching
      const resumeSkills = extractSkillsFromResume();
      
      const response = await fetch(`${API_BASE_URL}/api/jobs/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: keywords.trim(),
          location: location.trim(),
          userId: currentUser?.uid || 'anonymous',
          resumeSkills: resumeSkills,
          experienceLevel: resumeData?.experienceLevel || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.success) {
        setJobs(data.jobs || []);
        if (data.jobs.length === 0) {
          setError("No jobs found matching your criteria. Try different keywords or location.");
        }
      } else {
        throw new Error(data.error || 'Failed to fetch jobs');
      }

    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(`Failed to fetch jobs: ${err.message}. Make sure the backend server is running on ${API_BASE_URL}`);
    } finally {
      setLoading(false);
    }
  }, [keywords, location, currentUser, resumeData, API_BASE_URL]);


  const handleSearch = () => {
      fetchJobs();
  };

  // Run initial search on component mount
  useEffect(() => {
    handleSearch();
  }, []);


  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#2E2152' }}>
        Find Your Next Job
      </Typography>

      {/* --- Filter Inputs --- */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <TextField
          label="Job Title / Keywords"
          variant="outlined"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Location (e.g., City, State, Country)"
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
           InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          sx={{
            bgcolor: "#9D88D9",
            "&:hover": { bgcolor: "#7F68C9" },
            py: 1.5
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Search Jobs"}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* --- Job Listings --- */}
       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && !error && jobs.length === 0 && (
        <Typography sx={{ textAlign: 'center', mt: 4 }}>No jobs found. Try adjusting your search.</Typography>
      )}
      
      <Box sx={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto', pr: 1 }}>
        {loading
          ? Array(5).fill(0).map((_, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="rectangular" height={60} />
              </Box>
            ))
          : jobs.map((job, index) => <JobListing key={job.name || `job-${index}`} job={job} />)}
      </Box>
    </Box>
  );
};

export default JobSearch;