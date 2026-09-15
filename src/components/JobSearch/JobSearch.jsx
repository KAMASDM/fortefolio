import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";

export default function JobSearch({ resumeTitle = "", resumeData }) {
  const [keywords, setKeywords] = useState(
    resumeData?.personalInfo?.jobTitle || resumeTitle,
  );
  const [location, setLocation] = useState(
    resumeData?.personalInfo?.location || "",
  );
  const query = encodeURIComponent(keywords.trim());
  const place = encodeURIComponent(location.trim());
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        Find an opportunity to tailor for
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Open a job board, then paste a relevant description above.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
        <TextField
          size="small"
          label="Job title or keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          fullWidth
        />
        <TextField
          size="small"
          label="Job location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
        />
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
        <Button
          component="a"
          disabled={!keywords.trim()}
          href={`https://www.linkedin.com/jobs/search/?keywords=${query}&location=${place}`}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNew />}
        >
          Search LinkedIn
        </Button>
        <Button
          component="a"
          disabled={!keywords.trim()}
          href={`https://www.indeed.com/jobs?q=${query}&l=${place}`}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNew />}
        >
          Search Indeed
        </Button>
      </Stack>
    </Box>
  );
}
