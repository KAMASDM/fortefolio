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
  Avatar,
  InputAdornment,
  Chip,
  Alert,
  Zoom,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PersonOutline as PersonIcon,
  WorkOutline as WorkIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  FavoriteBorder as RelationshipIcon,
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
};

const defaultReferenceEntry = {
  id: 1,
  name: "",
  position: "",
  company: "",
  contact: "",
  email: "",
  relationship: "",
};

const sectionStyle = {
  p: 3,
  mb: 4,
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
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

const ReferenceForm = ({ data, updateData, nextStep }) => {
  const [references, setReferences] = useState([defaultReferenceEntry]);
  const [lastSavedReferences, setLastSavedReferences] = useState(references);
  const [formComplete, setFormComplete] = useState(0);

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setReferences(data);
    } else {
      setReferences([defaultReferenceEntry]);
    }
  }, [data]);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(references) !== JSON.stringify(lastSavedReferences);
    if (hasChanged) {
      const debounce = setTimeout(() => {
        updateData(references);
        setLastSavedReferences(references);
      }, 1000);
      return () => clearTimeout(debounce);
    }
  }, [references, lastSavedReferences, updateData]);

  useEffect(() => {
    const requiredFields = ["name"];
    let completed = 0;
    let total = 0;
    if (Array.isArray(references)) {
      references.forEach((ref) => {
        if (typeof ref === "object" && ref !== null) {
          total += requiredFields.length;
          requiredFields.forEach((field) => {
            if (ref[field] && String(ref[field]).trim() !== "") {
              completed++;
            }
          });
        }
      });
    }
    setFormComplete(total > 0 ? Math.round((completed / total) * 100) : 0);
  }, [references]);


  const handleChange = (id, field, value) => {
    setReferences((prev) =>
      prev.map((ref) =>
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    );
  };

  const addReference = () => {
    const newId = new Date().getTime(); // Simple unique ID
    setReferences((prev) => [
      ...prev,
      { ...defaultReferenceEntry, id: newId },
    ]);
  };

  const removeReference = (id) => {
    const updated = references.filter((ref) => ref.id !== id);
    setReferences(updated.length > 0 ? updated : [defaultReferenceEntry]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = references.filter((ref) => ref.name?.trim() !== "");
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
            <PersonIcon />
          </Avatar>
          <Typography variant="h5" component="h2" sx={{ color: lavenderPalette.text }}>
            References
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

      {references.length === 1 && !references[0].name && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3, borderRadius: 2, background: lavenderPalette.light }}>
          Provide professional references who can speak to your skills and experience.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {references.map((reference, index) => (
          <Zoom
            in
            key={reference.id}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <Paper elevation={2} sx={sectionStyle}>
              {references.length > 1 && (
                <Tooltip title="Remove this reference">
                  <IconButton
                    color="error"
                    onClick={() => removeReference(reference.id)}
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <SectionTitle icon={<PersonIcon />} label="Reference Entry" />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Reference Name"
                    value={reference.name}
                    onChange={(e) => handleChange(reference.id, "name", e.target.value)}
                    placeholder="John Smith"
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
                    label="Position Title"
                    value={reference.position}
                    onChange={(e) => handleChange(reference.id, "position", e.target.value)}
                    placeholder="Software Engineering Manager"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={reference.company}
                    onChange={(e) => handleChange(reference.id, "company", e.target.value)}
                    placeholder="Tech Solutions Inc."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Phone (Optional)"
                    value={reference.contact}
                    onChange={(e) => handleChange(reference.id, "contact", e.target.value)}
                    placeholder="(123) 456-7890"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Reference Email (Optional)"
                    type="email"
                    value={reference.email}
                    onChange={(e) => handleChange(reference.id, "email", e.target.value)}
                    placeholder="john.smith@example.com"
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
                    label="Relationship (Optional)"
                    value={reference.relationship}
                    onChange={(e) => handleChange(reference.id, "relationship", e.target.value)}
                    placeholder="e.g., Former Manager, Colleague"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RelationshipIcon color="action" />
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
            onClick={addReference}
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
            Add Another Reference
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ReferenceForm;