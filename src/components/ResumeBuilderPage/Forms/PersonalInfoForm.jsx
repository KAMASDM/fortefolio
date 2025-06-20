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
  Contacts as ContactIcon,
} from "@mui/icons-material";

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
    } else if (data && typeof data === "object") {
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

    if (!formData.fullName?.trim()) {
      formErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email?.trim()) {
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
            sx={{
              bgcolor: lavenderPalette.light,
              color: lavenderPalette.primary,
              mr: 2,
            }}
          >
            <PersonIcon />
          </Avatar>
          <Typography variant="h5" component="h2" sx={{ color: lavenderPalette.text }}>
            Personal Information
          </Typography>
        </Box>
        <Chip
          label={`${formComplete}% Complete`}
          icon={formComplete === 100 ? <CheckCircleIcon /> : undefined}
          variant="outlined"
          sx={{
            borderColor: lavenderPalette.primary,
            color: lavenderPalette.primary,
            "& .MuiChip-icon": {
              color: lavenderPalette.primary,
            },
          }}
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
        <Paper elevation={2} sx={sectionStyle}>
          <SectionTitle icon={<PermIdentityIcon />} label="Basic Information" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="fullName"
                label="Full Name"
                value={formData.fullName}
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
                name="jobTitle"
                label="Professional Title (Optional)"
                value={formData.jobTitle}
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
                    <CardContent sx={{ p: 1 }}>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {titleSuggestions.map((title, index) => (
                          <Chip
                            key={index}
                            label={title}
                            onClick={() => selectTitleSuggestion(title)}
                            color="primary"
                            variant="outlined"
                            clickable
                            size="small"
                            sx={{
                              color: lavenderPalette.primary,
                              borderColor: lavenderPalette.primary,
                            }}
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

        <Paper elevation={2} sx={sectionStyle}>
          <SectionTitle icon={<ContactIcon />} label="Contact Information" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="email"
                label="Email"
                type="email"
                value={formData.email}
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
                name="phone"
                label="Phone (Optional)"
                value={formData.phone}
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
                name="location"
                label="Location (Optional)"
                value={formData.location}
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

        <Paper elevation={2} sx={sectionStyle}>
          <SectionTitle icon={<LanguageIcon />} label="Online Presence (Optional)" />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="linkedin"
                label="LinkedIn URL"
                value={formData.linkedin}
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
                name="github"
                label="GitHub URL"
                value={formData.github}
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
                name="portfolio"
                label="Portfolio/Website URL"
                value={formData.portfolio}
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

        <Paper elevation={2} sx={sectionStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <SectionTitle icon={<DescriptionIcon />} label="Professional Summary (Optional)" />
            <Chip
              size="small"
              label={`${summaryWordCount} words`}
              variant={summaryWordCount > 0 ? "outlined" : "filled"}
              sx={{
                borderColor: lavenderPalette.primary,
                color: lavenderPalette.primary,
                "& .MuiChip-icon": { color: lavenderPalette.primary },
              }}
            />
          </Box>
          <TextField
            fullWidth
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Write a brief 2–4 sentence summary..."
            variant="outlined"
            multiline
            rows={5}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Tip: Tailor this summary to the job you're applying for. (50–200 words)
          </Typography>
        </Paper>
      </form>
    </Box>
  );
};

const sectionStyle = {
  p: 3,
  mb: 4,
  borderRadius: 2,
  border: "1px solid",
  borderColor: lavenderPalette.primary,
  backgroundColor: "#fff",
  transition: "border-color 0.3s ease",
  "&:hover": {
    borderColor: lavenderPalette.deep,
  },
};

const SectionTitle = ({ icon, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 1,
        width: 28,
        height: 28,
        color: lavenderPalette.primary,
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="subtitle1"
      fontWeight="bold"
      sx={{ color: lavenderPalette.primary }}
    >
      {label}
    </Typography>
  </Box>
);


export default PersonalInfoForm;
