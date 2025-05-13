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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Build as BuildIcon,
  CalendarMonth as CalendarIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";
import { Zoom, Tooltip } from "@mui/material";

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

const ProjectsForm = ({ data, updateData, nextStep }) => {
  const [projects, setProjects] = useState([defaultProjectEntry]);
  const [lastSavedProjects, setLastSavedProjects] = useState(projects);

  useEffect(() => {
    if (data && data.length > 0) {
      setProjects(data);
    } else if (data && data.length === 0) {
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
    if (data && data.length > 0) {
      setProjects(data);
    } else if (data && data.length === 0) {
      setProjects([defaultProjectEntry]);
    }
  }, [data]);

  const handleChange = (id, field, value) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const handleCurrentProjectChange = (id, checked) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === id
          ? {
              ...project,
              current: checked,
              endDate: checked ? "" : project.endDate,
            }
          : project
      )
    );
  };

  const addProject = () => {
    const newId =
      projects.length > 0
        ? Math.max(0, ...projects.map((project) => project.id)) + 1
        : 1;
    setProjects((prevProjects) => [
      ...prevProjects,
      {
        ...defaultProjectEntry,
        id: newId,
      },
    ]);
  };

  const removeProject = (id) => {
    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.filter(
        (project) => project.id !== id
      );
      if (updatedProjects.length === 0) {
        return [defaultProjectEntry];
      }
      return updatedProjects;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = projects.filter(
      (proj) =>
        !(
          proj.id === 1 &&
          !proj.title &&
          !proj.link &&
          !proj.description &&
          !proj.technologies &&
          !proj.startDate &&
          !proj.endDate &&
          !proj.current
        )
    );
    updateData(dataToSave);
    nextStep();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main", mr: 2 }}>
          <CodeIcon />
        </Avatar>
        <Typography variant="h5" component="h2">
          Projects
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        {Array.isArray(projects) &&
          projects.map((project, index) => (
            <Zoom
              in
              key={project.id || index}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 4,
                  borderRadius: 3,
                  position: "relative",
                  border: "1px solid",
                  borderColor: "divider",
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
                  {projects.length > 1 && (
                    <Tooltip title="Remove this project entry">
                      <IconButton
                        color="error"
                        onClick={() => removeProject(project.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      id={`title-${project.id}`}
                      label="Project Title"
                      value={project.title || ""}
                      onChange={(e) =>
                        handleChange(project.id, "title", e.target.value)
                      }
                      placeholder="My Awesome Project"
                      variant="outlined"
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
                      id={`link-${project.id}`}
                      label="Project Link (Optional)"
                      value={project.link || ""}
                      onChange={(e) =>
                        handleChange(project.id, "link", e.target.value)
                      }
                      placeholder="https://github.com/user/repo or https://live-demo.com"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id={`technologies-${project.id}`}
                      label="Technologies Used (Optional)"
                      value={project.technologies || ""}
                      onChange={(e) =>
                        handleChange(project.id, "technologies", e.target.value)
                      }
                      placeholder="e.g., React, Node.js, Firebase, CSS"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BuildIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id={`startDate-${project.id}`}
                      label="Start Date (Optional)"
                      type="month"
                      value={project.startDate || ""}
                      onChange={(e) =>
                        handleChange(project.id, "startDate", e.target.value)
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
                  <Grid item xs={12} container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!project.current}
                            onChange={(e) =>
                              handleCurrentProjectChange(
                                project.id,
                                e.target.checked
                              )
                            }
                            name={`current-${project.id}`}
                            color="primary"
                          />
                        }
                        label="This is an ongoing project"
                      />
                    </Grid>
                    {!project.current && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id={`endDate-${project.id}`}
                          label="End Date (Optional)"
                          type="month"
                          value={project.endDate || ""}
                          onChange={(e) =>
                            handleChange(project.id, "endDate", e.target.value)
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
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id={`description-${project.id}`}
                      label="Project Description (Optional)"
                      value={project.description || ""}
                      onChange={(e) =>
                        handleChange(project.id, "description", e.target.value)
                      }
                      placeholder="Describe the project, its purpose, key features, and your contributions."
                      variant="outlined"
                      multiline
                      rows={4}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ mt: -4, mr: 1, alignSelf: "flex-start" }}
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
            Add Another Project
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProjectsForm;
