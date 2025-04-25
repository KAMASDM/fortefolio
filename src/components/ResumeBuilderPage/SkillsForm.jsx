import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Divider,
  Paper,
  Avatar,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Psychology as PsychologyIcon,
  Category as CategoryIcon,
  CheckCircleOutline as SkillIcon,
} from "@mui/icons-material";
import { Zoom, Tooltip } from "@mui/material";

const defaultSkillCategories = [
  {
    id: 1,
    name: "Technical Skills",
    skills: [""],
  },
  {
    id: 2,
    name: "Soft Skills",
    skills: [""],
  },
];

const SkillsForm = ({ data, updateData, nextStep }) => {
  const [skillCategories, setSkillCategories] = useState([
    defaultSkillCategories,
  ]);
  const [lastSavedskillCategories, setLastSavedskillCategories] =
    useState(skillCategories);

  useEffect(() => {
    if (data && data.length > 0) {
      setSkillCategories(data);
    } else if (data && data.length === 0) {
      setSkillCategories([defaultSkillCategories]);
    }
  }, [data]);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(skillCategories) !==
      JSON.stringify(lastSavedskillCategories);

    if (hasChanged) {
      const debounce = setTimeout(() => {
        updateData(skillCategories);
        setLastSavedskillCategories(skillCategories);
      }, 1000);

      return () => clearTimeout(debounce);
    }
  }, [skillCategories, lastSavedskillCategories]);

  useEffect(() => {
    if (data && data.length > 0) {
      const sanitizedData = data.map((cat) => ({
        ...cat,
        skills: Array.isArray(cat.skills) ? cat.skills : [""],
      }));
      setSkillCategories(sanitizedData);
    } else if (data && data.length === 0) {
      setSkillCategories(defaultSkillCategories);
    }
  }, [data]);

  const handleCategoryNameChange = (id, name) => {
    setSkillCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id ? { ...category, name: name } : category
      )
    );
  };

  const handleSkillChange = (categoryId, index, value) => {
    setSkillCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === categoryId) {
          const currentSkills = Array.isArray(category.skills)
            ? category.skills
            : [];
          const updatedSkills = [...currentSkills];
          updatedSkills[index] = value;
          return { ...category, skills: updatedSkills };
        }
        return category;
      })
    );
  };

  const addSkill = (categoryId) => {
    setSkillCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === categoryId) {
          const currentSkills = Array.isArray(category.skills)
            ? category.skills
            : [];
          return {
            ...category,
            skills: [...currentSkills, ""],
          };
        }
        return category;
      })
    );
  };

  const removeSkill = (categoryId, index) => {
    setSkillCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === categoryId) {
          const currentSkills = Array.isArray(category.skills)
            ? category.skills
            : [];
          if (currentSkills.length > 1) {
            const updatedSkills = [...currentSkills];
            updatedSkills.splice(index, 1);
            return { ...category, skills: updatedSkills };
          } else {
            return { ...category, skills: [""] };
          }
        }
        return category;
      })
    );
  };

  const addCategory = () => {
    const newId =
      skillCategories.length > 0
        ? Math.max(0, ...skillCategories.map((category) => category.id)) + 1
        : 1;

    setSkillCategories((prevCategories) => [
      ...prevCategories,
      {
        id: newId,
        name: `New Category ${newId}`,
        skills: [""],
      },
    ]);
  };

  const removeCategory = (id) => {
    setSkillCategories((prevCategories) => {
      if (prevCategories.length <= 1) return prevCategories;

      const updatedCategories = prevCategories.filter(
        (category) => category.id !== id
      );
      return updatedCategories;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredData = skillCategories
      .map((category) => ({
        ...category,
        name:
          category.name && category.name.trim()
            ? category.name.trim()
            : `Category ${category.id}`,
        skills: Array.isArray(category.skills)
          ? category.skills.map((s) => s.trim()).filter((skill) => skill !== "")
          : [],
      }))
      .filter((category) => category.name && category.skills.length > 0);

    updateData(filteredData);
    nextStep();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main", mr: 2 }}>
          <PsychologyIcon />
        </Avatar>
        <Typography variant="h5" component="h2">
          Skills
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        List your relevant skills, grouping them into categories (e.g.,
        Programming Languages, Tools, Soft Skills).
      </Typography>

      <form onSubmit={handleSubmit}>
        {Array.isArray(skillCategories) &&
          skillCategories.map((category, categoryIndex) => (
            <Zoom
              in
              key={category.id || categoryIndex}
              style={{ transitionDelay: `${categoryIndex * 50}ms` }}
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <TextField
                    label="Skill Category Name"
                    required
                    value={category.name || ""}
                    onChange={(e) =>
                      handleCategoryNameChange(category.id, e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    sx={{ flexGrow: 1, mr: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Tooltip title="Remove this category">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => removeCategory(category.id)}
                        size="small"
                        disabled={skillCategories.length <= 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>

                {Array.isArray(category.skills) &&
                  category.skills.map((skill, skillIndex) => (
                    <Box
                      key={skillIndex}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1.5,
                        pl: 1,
                      }}
                    >
                      <SkillIcon
                        color="action"
                        sx={{ mr: 1.5, fontSize: "1.2rem" }}
                      />
                      <TextField
                        fullWidth
                        value={skill || ""}
                        onChange={(e) =>
                          handleSkillChange(
                            category.id,
                            skillIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Enter skill #${skillIndex + 1}`}
                        variant="standard"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Remove skill">
                        <span>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => removeSkill(category.id, skillIndex)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addSkill(category.id)}
                  size="small"
                  sx={{ mt: 2, ml: 1 }}
                >
                  Add Skill to Category
                </Button>
              </Paper>
            </Zoom>
          ))}

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4, mt: 4 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={addCategory}
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
            Add Skill Category
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SkillsForm;
