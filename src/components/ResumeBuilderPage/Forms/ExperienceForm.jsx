import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  Tooltip,
  IconButton,
  Paper,
  Checkbox,
  FormControlLabel,
  Avatar,
  InputAdornment,
  Chip,
  Alert,
  Zoom,
  CircularProgress
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  Notes as NotesIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Business as CompanyIcon,
  Badge as PositionIcon,
  AutoAwesome as AiIcon
} from "@mui/icons-material";
import { getAISuggestion } from "../../../utils/openai";

const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
};

const defaultExperienceEntry = {
  id: 1,
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  responsibilities: [""],
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

const ExperienceForm = ({ data, updateData, nextStep }) => {
  const [experiences, setExperiences] = useState([defaultExperienceEntry]);
  const [lastSavedExperiences, setLastSavedExperiences] = useState(experiences);
  const [formComplete, setFormComplete] = useState(0);
  const [aiLoading, setAiLoading] = useState({});

  useEffect(() => {
    if (data && data.length > 0) {
      const sanitizedData = data.map((exp) => ({
        ...defaultExperienceEntry,
        ...exp,
        responsibilities:
          Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0
            ? exp.responsibilities
            : [""],
      }));
      setExperiences(sanitizedData);
    } else {
      setExperiences([defaultExperienceEntry]);
    }
  }, [data]);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(experiences) !== JSON.stringify(lastSavedExperiences);
    if (hasChanged) {
      const debounce = setTimeout(() => {
        updateData(experiences);
        setLastSavedExperiences(experiences);
      }, 1000);
      return () => clearTimeout(debounce);
    }
  }, [experiences, lastSavedExperiences, updateData]);

  useEffect(() => {
    const requiredFields = ["company", "position", "startDate"];
    let completed = 0;
    let total = 0;
    if (Array.isArray(experiences)) {
      experiences.forEach((exp) => {
        if (typeof exp === "object" && exp !== null) {
          total += requiredFields.length;
          requiredFields.forEach((field) => {
            if (exp[field] && String(exp[field]).trim() !== "") {
              completed++;
            }
          });
        }
      });
    }
    setFormComplete(total > 0 ? Math.round((completed / total) * 100) : 0);
  }, [experiences]);

  const handleChange = (id, field, value) => {
    setExperiences((prev) =>
      prev.map((exp) =>
        exp.id === id
          ? {
            ...exp,
            [field]: value,
            ...(field === "current" && value && { endDate: "" }),
          }
          : exp
      )
    );
  };

  const handleResponsibilityChange = (expId, index, value) => {
    setExperiences((prev) =>
      prev.map((exp) => {
        if (exp.id === expId) {
          const updatedResponsibilities = [...exp.responsibilities];
          updatedResponsibilities[index] = value;
          return { ...exp, responsibilities: updatedResponsibilities };
        }
        return exp;
      })
    );
  };

  const addResponsibility = (expId) => {
    setExperiences((prev) =>
      prev.map((exp) =>
        exp.id === expId
          ? { ...exp, responsibilities: [...exp.responsibilities, ""] }
          : exp
      )
    );
  };

  const removeResponsibility = (expId, index) => {
    setExperiences((prev) =>
      prev.map((exp) => {
        if (exp.id === expId && exp.responsibilities.length > 1) {
          const updatedResponsibilities = exp.responsibilities.filter(
            (_, i) => i !== index
          );
          return { ...exp, responsibilities: updatedResponsibilities };
        }
        return exp;
      })
    );
  };

  const addExperience = () => {
    const newId =
      experiences.length > 0
        ? Math.max(0, ...experiences.map((exp) => exp.id)) + 1
        : 1;
    setExperiences((prev) => [...prev, { ...defaultExperienceEntry, id: newId }]);
  };

  const removeExperience = (id) => {
    const updated = experiences.filter((exp) => exp.id !== id);
    setExperiences(updated.length > 0 ? updated : [defaultExperienceEntry]);
  };

  const handleAiSuggestion = async (expId, respIndex) => {
    const responsibilityText = experiences.find(exp => exp.id === expId).responsibilities[respIndex];
    if (!responsibilityText) return;

    setAiLoading(prev => ({ ...prev, [`${expId}-${respIndex}`]: true }));

    const prompt = `Rewrite the following resume bullet point to be more impactful and achievement-oriented. Focus on using strong action verbs and quantifying results where possible. Original bullet point: "${responsibilityText}"`;

    try {
        // Use secure Firebase Function instead of direct API call
        const suggestion = await getAISuggestion(prompt, 60);
        handleResponsibilityChange(expId, respIndex, suggestion);
    } catch (error) {
        console.error("Error getting AI suggestion:", error);
        alert("Failed to get AI suggestion. Please try again.");
    } finally {
        setAiLoading(prev => ({ ...prev, [`${expId}-${respIndex}`]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = experiences.filter(
      (exp) =>
        exp.company && exp.position && exp.startDate
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
            <WorkIcon />
          </Avatar>
          <Typography
            variant="h5"
            component="h2"
            sx={{ color: lavenderPalette.text }}
          >
            Work Experience
          </Typography>
        </Box>
        <Chip
          label={`${formComplete}% Complete`}
          icon={formComplete === 100 ? <CheckCircleIcon /> : undefined}
          variant="outlined"
          sx={{
            borderColor: lavenderPalette.primary,
            color: lavenderPalette.primary,
            "& .MuiChip-icon": { color: lavenderPalette.primary },
          }}
        />
      </Box>

      {experiences.length === 1 && !experiences[0].company && (
        <Alert
          severity="info"
          icon={<InfoIcon />}
          sx={{ mb: 3, borderRadius: 2, background: lavenderPalette.light }}
        >
          Detail your professional history to give employers a clear view of your expertise.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {experiences.map((experience, index) => (
          <Zoom
            in
            key={experience.id}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <Paper elevation={2} sx={sectionStyle}>
              {experiences.length > 1 && (
                <Tooltip title="Remove this experience entry">
                  <IconButton
                    color="error"
                    onClick={() => removeExperience(experience.id)}
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <SectionTitle icon={<WorkIcon />} label="Experience Entry" />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Company"
                    value={experience.company}
                    onChange={(e) => handleChange(experience.id, "company", e.target.value)}
                    placeholder="Company Name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CompanyIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Position"
                    value={experience.position}
                    onChange={(e) => handleChange(experience.id, "position", e.target.value)}
                    placeholder="Job Title"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PositionIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={experience.location}
                    onChange={(e) => handleChange(experience.id, "location", e.target.value)}
                    placeholder="City, State/Country"
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
                    label="Start Date"
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => handleChange(experience.id, "startDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
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
                    label="End Date"
                    type="month"
                    value={experience.endDate}
                    onChange={(e) => handleChange(experience.id, "endDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={experience.current}
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={experience.current}
                        onChange={(e) => handleChange(experience.id, "current", e.target.checked)}
                        sx={{ color: lavenderPalette.primary, '&.Mui-checked': { color: lavenderPalette.deep } }}
                      />
                    }
                    label="I currently work here"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", color: lavenderPalette.text, mt: 2 }}
                  >
                    <NotesIcon sx={{ mr: 1, color: lavenderPalette.primary }} />
                    Responsibilities & Achievements
                  </Typography>
                  {experience.responsibilities.map((resp, respIndex) => (
                    <Box
                      key={respIndex}
                      sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                    >
                      <TextField
                        fullWidth
                        value={resp}
                        onChange={(e) => handleResponsibilityChange(experience.id, respIndex, e.target.value)}
                        placeholder={`Responsibility #${respIndex + 1}`}
                        variant="outlined"
                        size="small"
                        multiline
                      />
                      <Tooltip title="Get AI suggestions for this bullet point">
                        <span>
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleAiSuggestion(experience.id, respIndex)}
                                disabled={aiLoading[`${experience.id}-${respIndex}`]}
                                sx={{ ml: 1 }}
                            >
                                {aiLoading[`${experience.id}-${respIndex}`] ? <CircularProgress size={20} /> : <AiIcon fontSize="small" />}
                            </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Remove responsibility">
                        <span>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => removeResponsibility(experience.id, respIndex)}
                            disabled={experience.responsibilities.length <= 1}
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addResponsibility(experience.id)}
                    size="small"
                    sx={{ mt: 1, color: lavenderPalette.primary }}
                  >
                    Add Responsibility
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Zoom>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={addExperience}
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
            Add Another Experience
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ExperienceForm;