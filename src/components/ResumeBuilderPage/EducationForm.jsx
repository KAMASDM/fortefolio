import React, { useState, useEffect } from "react";
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
  Card,
  CardContent,
  Stack,
  Fade,
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

const degreeSuggestions = [
];

const fieldSuggestions = [
  /* ... */
];

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

const EducationForm = ({ data, updateData, nextStep }) => {
  const [educations, setEducations] = useState([defaultEducationEntry]);
  const [lastSavedEducations, setLastSavedEducations] = useState(educations);

  const [showDegreeSuggestions, setShowDegreeSuggestions] = useState(null);
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(null);
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
    setEducations((prevEducations) => {
      const updatedEducations = prevEducations.filter((edu) => edu.id !== id);
      if (updatedEducations.length === 0) {
        return [defaultEducationEntry];
      }
      return updatedEducations;
    });
  };

  const selectDegreeSuggestion = (eduId, degree) => {
    handleChange(eduId, "degree", degree);
    setShowDegreeSuggestions(null);
  };

  const selectFieldSuggestion = (eduId, field) => {
    handleChange(eduId, "field", field);
    setShowFieldSuggestions(null);
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
            sx={{ bgcolor: "primary.light", color: "primary.main", mr: 2 }}
          >
            <SchoolIcon />
          </Avatar>
          <Typography variant="h5" component="h2">
            Education
          </Typography>
        </Box>
        <Chip
          label={`${formComplete}% Complete`}
          color={formComplete === 100 ? "success" : "primary"}
          variant={formComplete === 100 ? "filled" : "outlined"}
          icon={formComplete === 100 ? <CheckCircleIcon /> : undefined}
        />
      </Box>

      {educations.length === 1 && !educations[0].institution && (
        <Alert
          severity="info"
          icon={<InfoIcon />}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Add your educational background to showcase your academic
          qualifications
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {Array.isArray(educations) &&
          educations.map((education, index) => (
            <Zoom
              in
              key={education.id || index}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 4,
                  borderRadius: 3,
                  position: "relative",
                  overflow: "visible",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "box-shadow 0.3s ease",
                }}
              >




                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 1,
                    mt: -1,
                    mr: -1,
                  }}
                >
                  {educations.length > 1 && (
                    <Tooltip title="Remove this education entry">
                      <IconButton
                        color="error"
                        onClick={() => removeEducation(education.id)}
                        size="small"
                        sx={{}}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      id={`institution-${education.id}`}
                      label="Institution"
                      value={education.institution || ""}
                      onChange={(e) =>
                        handleChange(
                          education.id,
                          "institution",
                          e.target.value
                        )
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
                      id={`degree-${education.id}`}
                      label="Degree"
                      value={education.degree || ""}
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
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="View degree suggestions">
                              <IconButton
                                onClick={() =>
                                  setShowDegreeSuggestions(
                                    education.id === showDegreeSuggestions
                                      ? null
                                      : education.id
                                  )
                                }
                                edge="end"
                                size="small"
                              >
                                <InfoIcon
                                  color={
                                    showDegreeSuggestions === education.id
                                      ? "primary"
                                      : "action"
                                  }
                                  fontSize="small"
                                />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {showDegreeSuggestions === education.id && (
                      <Fade in>
                        <Card
                          variant="outlined"
                          sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}
                        >
                          <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              useFlexGap
                            >
                              {degreeSuggestions.map((degree, i) => (
                                <Chip
                                  key={i}
                                  label={degree}
                                  onClick={() =>
                                    selectDegreeSuggestion(education.id, degree)
                                  }
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id={`field-${education.id}`}
                      label="Field of Study"
                      value={education.field || ""}
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
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="View field suggestions">
                              <IconButton
                                onClick={() =>
                                  setShowFieldSuggestions(
                                    education.id === showFieldSuggestions
                                      ? null
                                      : education.id
                                  )
                                }
                                edge="end"
                                size="small"
                              >
                                <InfoIcon
                                  color={
                                    showFieldSuggestions === education.id
                                      ? "primary"
                                      : "action"
                                  }
                                  fontSize="small"
                                />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {showFieldSuggestions === education.id && (
                      <Fade in>
                        <Card
                          variant="outlined"
                          sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}
                        >
                          <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              useFlexGap
                            >
                              {fieldSuggestions.map((field, i) => (
                                <Chip
                                  key={i}
                                  label={field}
                                  onClick={() =>
                                    selectFieldSuggestion(education.id, field)
                                  }
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id={`location-${education.id}`}
                      label="Location"
                      value={education.location || ""}
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
                      id={`startDate-${education.id}`}
                      label="Start Date"
                      type="month"
                      value={education.startDate || ""}
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
                      id={`endDate-${education.id}`}
                      label="End Date (or Expected)"
                      type="month"
                      value={education.endDate || ""}
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
                      id={`description-${education.id}`}
                      label="Description (Optional)"
                      value={education.description || ""}
                      onChange={(e) =>
                        handleChange(
                          education.id,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Notable accomplishments, relevant coursework, thesis, GPA (if high), etc."
                      variant="outlined"
                      multiline
                      rows={3}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ mt: -2, mr: 1, alignSelf: "flex-start" }}
                          >
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
            color="primary"
            sx={{
              borderRadius: 30,
              px: 3,
              py: 1,
              borderStyle: "dashed",
              borderWidth: 2,
              "&:hover": {
                transform: "none",
                boxShadow: "none",
                background: "rgba(147, 112, 219, 0.04)",
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
