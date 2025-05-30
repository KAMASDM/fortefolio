import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Grid,
  Box,
  Card,
  CardContent,
  Avatar,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Alert,
  Stack,
  Fade,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
  Lightbulb as LightbulbIcon,
  PermIdentity as PermIdentityIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Contacts as ContactIcon,
} from "@mui/icons-material";

const titleSuggestions = [];

const summaryExamples = [];

const defaultPersonalInfo = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
};

const PersonalInfoForm = ({ data, updateData, nextStep }) => {
  const [formData, setFormData] = useState(defaultPersonalInfo);

  const [errors, setErrors] = useState({});
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showSummaryExamples, setShowSummaryExamples] = useState(false);
  const [summaryWordCount, setSummaryWordCount] = useState(0);
  const [summaryOptimal, setSummaryOptimal] = useState(false);
  const [formComplete, setFormComplete] = useState(0);

  useEffect(() => {
    if (data && typeof data === "object" && Object.keys(data).length > 0) {
      setFormData(() => ({ ...defaultPersonalInfo, ...data }));
    } else if (
      data &&
      typeof data === "object" &&
      Object.keys(data).length === 0
    ) {
      setFormData(defaultPersonalInfo);
    }
  }, [data]);

  useEffect(() => {
    const requiredFields = ["fullName", "email"];
    const optionalFields = [
      "jobTitle",
      "phone",
      "location",
      "linkedin",
      "github",
      "portfolio",
      "summary",
    ];

    let completed = 0;
    const allFields = [...requiredFields, ...optionalFields];
    let total = allFields.length;

    allFields.forEach((field) => {
      if (
        formData &&
        formData[field] &&
        String(formData[field]).trim() !== ""
      ) {
        completed++;
      }
    });

    setFormComplete(total > 0 ? Math.round((completed / total) * 100) : 0);

    if (formData && formData.summary) {
      const words = formData.summary.trim().split(/\s+/).filter(Boolean);
      setSummaryWordCount(words.length);
      setSummaryOptimal(words.length >= 50 && words.length <= 200);
    } else {
      setSummaryWordCount(0);
      setSummaryOptimal(false);
    }
  }, [formData]);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    updateData(updated);
  };

  const selectTitleSuggestion = (title) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      jobTitle: title,
    }));
    setShowTitleSuggestions(false);
  };

  const selectSummaryExample = (summary) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      summary: summary,
    }));
    setShowSummaryExamples(false);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData || !formData.fullName || !formData.fullName.trim()) {
      formErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData || !formData.email || !formData.email.trim()) {
      formErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email is invalid";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      updateData(formData);
      nextStep();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ bgcolor: "primary.light", color: "primary.main", mr: 2 }}
          >
            <PersonIcon />
          </Avatar>
          <Typography variant="h5" component="h2">
            Personal Information
          </Typography>
        </Box>
        <Chip
          label={`${formComplete}% Complete`}
          color={formComplete === 100 ? "success" : "primary"}
          variant={formComplete === 100 ? "filled" : "outlined"}
          icon={formComplete === 100 ? <CheckCircleIcon /> : undefined}
        />
      </Box>
      {formComplete < 30 && (
        <Alert
          severity="info"
          icon={<InfoIcon />}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Start by filling out your basic contact information.
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <PermIdentityIcon sx={{ mr: 1, color: "primary.main" }} />
            Basic Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                id="fullName"
                name="fullName"
                label="Full Name"
                value={formData.fullName || ""}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                placeholder="John Doe"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="jobTitle"
                name="jobTitle"
                label="Professional Title (Optional)"
                value={formData.jobTitle || ""}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PermIdentityIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              {showTitleSuggestions && (
                <Fade in>
                  <Card
                    variant="outlined"
                    sx={{ mt: 1, maxHeight: 150, overflow: "auto" }}
                  >
                    <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {titleSuggestions.map((title, index) => (
                          <Chip
                            key={index}
                            label={title}
                            onClick={() => selectTitleSuggestion(title)}
                            color="primary"
                            variant="outlined"
                            clickable
                            size="small"
                            sx={{ mb: 0.5, mr: 0.5 }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              )}
            </Grid>
          </Grid>
        </Paper>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <ContactIcon sx={{ mr: 1, color: "primary.main" }} />
            Contact Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="john.doe@example.com"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone (Optional)"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="(123) 456-7890"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Location (Optional)"
                value={formData.location || ""}
                onChange={handleChange}
                placeholder="City, State/Country"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <LanguageIcon sx={{ mr: 1, color: "primary.main" }} />
            Online Presence (Optional)
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="linkedin"
                name="linkedin"
                label="LinkedIn URL"
                value={formData.linkedin || ""}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkedInIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="github"
                name="github"
                label="GitHub URL"
                value={formData.github || ""}
                onChange={handleChange}
                placeholder="https://github.com/..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GitHubIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="portfolio"
                name="portfolio"
                label="Portfolio/Website URL"
                value={formData.portfolio || ""}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <DescriptionIcon sx={{ mr: 1, color: "primary.main" }} />
              Professional Summary (Optional)
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                size="small"
                label={`${summaryWordCount} words`}
                color={summaryOptimal ? "success" : "default"}
                variant={summaryWordCount > 0 ? "outlined" : "filled"}
              />
            </Box>
          </Box>
          <TextField
            fullWidth
            id="summary"
            name="summary"
            value={formData.summary || ""}
            onChange={handleChange}
            placeholder="Write a brief 2-4 sentence summary highlighting your key skills, experience, and career objective..."
            variant="outlined"
            multiline
            rows={5}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Tip: Tailor this summary to the specific job you're applying for.
            (Aim for 50-200 words)
          </Typography>
        </Paper>
      </form>
    </Box>
  );
};

export default PersonalInfoForm;
