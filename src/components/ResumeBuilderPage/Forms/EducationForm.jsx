import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  IconButton,
  Paper,
  Avatar,
  InputAdornment,
  Chip,
  Tooltip,
  Alert,
  Zoom,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  BookmarkBorder as DegreeIcon,
  Psychology as FieldIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
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

const defaultEducationEntry = {
  id: 1,
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  location: "",
  description: "",
};

const sectionStyle = {
  p: 3,
  mb: 4,
  borderRadius: 2,
  border: "1px solid",
  borderColor: lavenderPalette.primary,
  position: "relative",
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

const EducationForm = ({ data, updateData, nextStep }) => {
  const [educations, setEducations] = useState([defaultEducationEntry]);
  const [lastSavedEducations, setLastSavedEducations] = useState(educations);
  const [formComplete, setFormComplete] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      setEducations(data);
    } else if (data && data.length === 0) {
      setEducations([defaultEducationEntry]);
    }
  }, [data]);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(educations) !== JSON.stringify(lastSavedEducations);

    if (hasChanged) {
      const debounce = setTimeout(() => {
        updateData(educations);
        setLastSavedEducations(educations);
      }, 1000);

      return () => clearTimeout(debounce);
    }
  }, [educations, lastSavedEducations, updateData]);

  useEffect(() => {
    const requiredFields = ["institution", "degree", "startDate"];
    let completed = 0;
    let total = 0;
    if (Array.isArray(educations)) {
      educations.forEach((edu) => {
        if (typeof edu === "object" && edu !== null) {
          total += requiredFields.length;
          requiredFields.forEach((field) => {
            if (edu[field] && String(edu[field]).trim() !== "") {
              completed++;
            }
          });
        }
      });
    }
    setFormComplete(total > 0 ? Math.round((completed / total) * 100) : 0);
  }, [educations]);

  const handleChange = (id, field, value) => {
    setEducations((prevEducations) =>
      prevEducations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const addEducation = () => {
    const newId =
      educations.length > 0
        ? Math.max(0, ...educations.map((edu) => edu.id)) + 1
        : 1;
    setEducations((prevEducations) => [
      ...prevEducations,
      {
        ...defaultEducationEntry,
        id: newId,
      },
    ]);
  };

  const removeEducation = (id) => {
    const updated = educations.filter((edu) => edu.id !== id);
    setEducations(updated.length > 0 ? updated : [defaultEducationEntry]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSave = educations.filter(
      (edu) =>
        !(
          edu.id === 1 &&
          !edu.institution &&
          !edu.degree &&
          !edu.field &&
          !edu.startDate &&
          !edu.endDate &&
          !edu.location &&
          !edu.description
        )
    );
    updateData(dataToSave);
    nextStep();
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
            <SchoolIcon />
          </Avatar>
          <Typography
            variant="h5"
            component="h2"
            sx={{ color: lavenderPalette.text }}
          >
            Education
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

      {educations.length === 1 && !educations[0].institution && (
        <Alert
          severity="info"
          icon={<InfoIcon />}
          sx={{ mb: 3, borderRadius: 2, background: lavenderPalette.light }}
        >
          Add your educational background to showcase your academic
          qualifications.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {educations.map((education, index) => (
          <Zoom
            in
            key={education.id}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <Paper elevation={2} sx={sectionStyle}>
              {educations.length > 1 && (
                <Tooltip title="Remove this education entry">
                  <IconButton
                    color="error"
                    onClick={() => removeEducation(education.id)}
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <SectionTitle icon={<SchoolIcon />} label="Education Entry" />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Institution"
                    value={education.institution}
                    onChange={(e) =>
                      handleChange(education.id, "institution", e.target.value)
                    }
                    placeholder="University or School Name"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SchoolIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Degree"
                    value={education.degree}
                    onChange={(e) =>
                      handleChange(education.id, "degree", e.target.value)
                    }
                    placeholder="e.g. Bachelor of Science"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DegreeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Field of Study"
                    value={education.field}
                    onChange={(e) =>
                      handleChange(education.id, "field", e.target.value)
                    }
                    placeholder="e.g. Computer Science"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FieldIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={education.location}
                    onChange={(e) =>
                      handleChange(education.id, "location", e.target.value)
                    }
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
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    required
                    type="month"
                    label="Start Date"
                    value={education.startDate}
                    onChange={(e) =>
                      handleChange(education.id, "startDate", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="month"
                    label="End Date (or Expected)"
                    value={education.endDate}
                    onChange={(e) =>
                      handleChange(education.id, "endDate", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description (Optional)"
                    value={education.description}
                    onChange={(e) =>
                      handleChange(education.id, "description", e.target.value)
                    }
                    placeholder="Notable accomplishments, coursework, GPA, etc."
                    variant="outlined"
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Zoom>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={addEducation}
            variant="outlined"
            sx={{
              borderRadius: 30,
              px: 3,
              py: 1,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: lavenderPalette.primary,
              color: lavenderPalette.primary,
              "&:hover": {
                backgroundColor: lavenderPalette.light,
                borderWidth: 2,
              },
            }}
          >
            Add Another Education
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EducationForm;
