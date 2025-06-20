import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Paper,
  Avatar,
  InputAdornment,
  Grid,
  Chip,
  Alert,
  Zoom,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Psychology as PsychologyIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
};

const defaultSkillCategories = [
  { id: 1, name: "Technical Skills", skills: [""] },
  { id: 2, name: "Soft Skills", skills: [""] },
];

const sectionStyle = {
  p: 3,
  mb: 4,
  borderRadius: 2,
  border: "1px solid",
  borderColor: lavenderPalette.primary,
  position: "relative",
};

const SkillsForm = ({ data, updateData, nextStep }) => {
  const [skillCategories, setSkillCategories] = useState(defaultSkillCategories);
  const [lastSavedSkillCategories, setLastSavedSkillCategories] = useState(skillCategories);
  const [formComplete, setFormComplete] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      const sanitizedData = data.map((cat) => ({
        ...cat,
        skills: Array.isArray(cat.skills) && cat.skills.length > 0 ? cat.skills : [""],
      }));
      setSkillCategories(sanitizedData);
    } else {
      setSkillCategories(defaultSkillCategories);
    }
  }, [data]);

  useEffect(() => {
    const hasChanged = JSON.stringify(skillCategories) !== JSON.stringify(lastSavedSkillCategories);
    if (hasChanged) {
      const debounce = setTimeout(() => {
        updateData(skillCategories);
        setLastSavedSkillCategories(skillCategories);
      }, 1000);
      return () => clearTimeout(debounce);
    }
  }, [skillCategories, lastSavedSkillCategories, updateData]);

  useEffect(() => {
    let completed = 0;
    const total = skillCategories.length;

    if (Array.isArray(skillCategories)) {
      skillCategories.forEach((cat) => {
        const hasName = cat.name && cat.name.trim() !== "";
        const hasSkills = Array.isArray(cat.skills) && cat.skills.some(s => s && s.trim() !== "");
        if (hasName && hasSkills) {
          completed++;
        }
      });
    }
    setFormComplete(total > 0 ? Math.round((completed / total) * 100) : 0);
  }, [skillCategories]);

  const handleCategoryNameChange = (id, name) => {
    setSkillCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name } : cat))
    );
  };

  const handleSkillChange = (categoryId, index, value) => {
    setSkillCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const updatedSkills = [...cat.skills];
          updatedSkills[index] = value;
          return { ...cat, skills: updatedSkills };
        }
        return cat;
      })
    );
  };

  const addSkill = (categoryId) => {
    setSkillCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, skills: [...cat.skills, ""] } : cat
      )
    );
  };

  const removeSkill = (categoryId, index) => {
    setSkillCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          if (cat.skills.length > 1) {
            const updatedSkills = cat.skills.filter((_, i) => i !== index);
            return { ...cat, skills: updatedSkills };
          }
          return { ...cat, skills: [""] }; 
        }
        return cat;
      })
    );
  };

  const addCategory = () => {
    const newId = skillCategories.length > 0 ? Math.max(0, ...skillCategories.map((c) => c.id)) + 1 : 1;
    setSkillCategories((prev) => [
      ...prev,
      { id: newId, name: "", skills: [""] },
    ]);
  };

  const removeCategory = (id) => {
    if (skillCategories.length <= 1) return; 
    setSkillCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredData = skillCategories
      .map((category) => ({
        ...category,
        name: category.name?.trim() || "",
        skills: category.skills.map((s) => s.trim()).filter((s) => s !== ""),
      }))
      .filter((category) => category.name && category.skills.length > 0);
    updateData(filteredData);
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
            <PsychologyIcon />
          </Avatar>
          <Typography variant="h5" component="h2" sx={{ color: lavenderPalette.text }}>
            Skills
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

      {formComplete < 10 && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3, borderRadius: 2, background: lavenderPalette.light }}>
          List your skills in categories like "Programming Languages" or "Design Tools".
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {skillCategories.map((category, index) => (
          <Zoom in key={category.id} style={{ transitionDelay: `${index * 50}ms` }}>
            <Paper elevation={2} sx={sectionStyle}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <TextField
                    fullWidth
                    label="Skill Category Name"
                    required
                    value={category.name}
                    onChange={(e) => handleCategoryNameChange(category.id, e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs="auto">
                  <Tooltip title="Remove this category">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => removeCategory(category.id)}
                        disabled={skillCategories.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, pl: 1 }}>
                {category.skills.map((skill, skillIndex) => (
                  <Box key={skillIndex} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TextField
                      fullWidth
                      value={skill}
                      onChange={(e) => handleSkillChange(category.id, skillIndex, e.target.value)}
                      placeholder={`Skill #${skillIndex + 1}`}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PsychologyIcon sx={{ fontSize: '1.2rem', color: 'action.active' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Tooltip title="Remove skill">
                      <span>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => removeSkill(category.id, skillIndex)}
                          disabled={category.skills.length <= 1 && skill === ""}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                ))}
              </Box>

              <Button
                startIcon={<AddIcon />}
                onClick={() => addSkill(category.id)}
                size="small"
                sx={{ mt: 1, ml: 1, color: lavenderPalette.primary }}
              >
                Add Skill
              </Button>
            </Paper>
          </Zoom>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={addCategory}
            variant="outlined"
            sx={{
              borderRadius: 30,
              px: 3,
              py: 1,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: lavenderPalette.primary,
              color: lavenderPalette.primary,
              "&:hover": { backgroundColor: lavenderPalette.light, borderWidth: 2 },
            }}
          >
            Add Skill Category
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SkillsForm;