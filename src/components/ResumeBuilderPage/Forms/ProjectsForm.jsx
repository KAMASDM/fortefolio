import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  IconButton,
  Paper,
  Checkbox,
  FormControlLabel,
  Avatar,
  InputAdornment,
  Chip,
  Alert,
  Zoom,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Build as BuildIcon,
  CalendarMonth as CalendarIcon,
  Notes as NotesIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

// Shared color palette for consistency
const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
};

const defaultProjectEntry = {
  id: 1,
  title: "",
  link: "",
  description: "",
  technologies: "",
  startDate: "",
  endDate: "",
  current: false,
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

const ProjectsForm = ({ data, updateData, nextStep }) => {
  const [projects, setProjects] = useState([defaultProjectEntry]);
  const [lastSavedProjects, setLastSavedProjects] = useState(projects);
  const [formComplete, setFormComplete] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      setProjects(data);
    } else {
      setProjects([defaultProjectEntry]);
    }
  }, [data]);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(projects) !== JSON.stringify(lastSavedProjects);
    if (hasChanged) {
      const debounce = setTimeout(() => {
        updateData(projects);
        setLastSavedProjects(projects);
      }, 1000);
      return () => clearTimeout(debounce);
    }
  }, [projects, lastSavedProjects, updateData]);

  useEffect(() => {
    const requiredFields = ["title"];
    let completed = 0;
    let total = 0;
    if (Array.isArray(projects)) {
      projects.forEach((proj) => {
        if (typeof proj === "object" && proj !== null) {
          total += requiredFields.length;
          requiredFields.forEach((field) => {
            if (proj[field] && String(proj[field]).trim() !== "") {
              completed++;
            }
          });
        }
      });
    }
    setFormComplete(total > 0 ? Math.round((completed / total) * 100) : 0);
  }, [projects]);

  const handleChange = (id, field, value) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
            ...project,
            [field]: value,
            ...(field === "current" && value && { endDate: "" }),
          }
          : project
      )
    );
  };

  const addProject = () => {
    const newId =
      projects.length > 0
        ? Math.max(0, ...projects.map((p) => p.id)) + 1
        : 1;
    setProjects((prev) => [...prev, { ...defaultProjectEntry, id: newId }]);
  };

  const removeProject = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated.length > 0 ? updated : [defaultProjectEntry]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = projects.filter((proj) => proj.title?.trim() !== "");
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
          <Avatar sx={{ bgcolor: lavenderPalette.light, color: lavenderPalette.primary, mr: 2 }}>
            <CodeIcon />
          </Avatar>
          <Typography variant="h5" component="h2" sx={{ color: lavenderPalette.text }}>
            Projects
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

      {projects.length === 1 && !projects[0].title && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3, borderRadius: 2, background: lavenderPalette.light }}>
          Showcase your work by adding personal or academic projects.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {projects.map((project, index) => (
          <Zoom in key={project.id} style={{ transitionDelay: `${index * 50}ms` }}>
            <Paper elevation={2} sx={sectionStyle}>
              {projects.length > 1 && (
                <Tooltip title="Remove this project entry">
                  <IconButton
                    color="error"
                    onClick={() => removeProject(project.id)}
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <SectionTitle icon={<CodeIcon />} label="Project Entry" />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Project Title"
                    value={project.title}
                    onChange={(e) => handleChange(project.id, "title", e.target.value)}
                    placeholder="My Awesome Project"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CodeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Project Link (Optional)"
                    value={project.link}
                    onChange={(e) => handleChange(project.id, "link", e.target.value)}
                    placeholder="https://github.com/user/repo"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Technologies Used (Comma-separated)"
                    value={project.technologies}
                    onChange={(e) => handleChange(project.id, "technologies", e.target.value)}
                    placeholder="e.g., React, Node.js, Firebase"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BuildIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Start Date (Optional)"
                    type="month"
                    value={project.startDate}
                    onChange={(e) => handleChange(project.id, "startDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="End Date (Optional)"
                    type="month"
                    value={project.endDate}
                    onChange={(e) => handleChange(project.id, "endDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    disabled={project.current}
                  />
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={project.current}
                        onChange={(e) => handleChange(project.id, "current", e.target.checked)}
                        sx={{ color: lavenderPalette.primary, '&.Mui-checked': { color: lavenderPalette.deep } }}
                      />
                    }
                    label="Ongoing"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Project Description (Optional)"
                    value={project.description}
                    onChange={(e) => handleChange(project.id, "description", e.taget.value)}
                    placeholder="Describe the project, its purpose, key features, and your contributions."
                    multiline
                    rows={4}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ alignItems: 'flex-start', mt: 1.5 }}
                        >
                          <NotesIcon color="action" />
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
            onClick={addProject}
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
            Add Another Project
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProjectsForm;