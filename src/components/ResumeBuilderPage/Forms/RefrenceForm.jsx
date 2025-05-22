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
} from "@mui/icons-material";
import { Zoom } from "@mui/material";

const defaultReferenceEntry = {
  id: 1,
  name: "",
  position: "",
  company: "",
  contact: "",
  email: "",
  relationship: "",
};

const ReferenceForm = ({ data, updateData, nextStep }) => {
  const [references, setReferences] = useState([defaultReferenceEntry]);
  const [lastSavedReferences, setLastSavedReferences] = useState(references);

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setReferences(data);
    } else if (data && Array.isArray(data) && data.length === 0) {
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

  const handleChange = (id, field, value) => {
    setReferences((prevReferences) =>
      prevReferences.map((reference) =>
        reference.id === id ? { ...reference, [field]: value } : reference
      )
    );
  };

  const addReference = () => {
    const newId = new Date().getTime();
    setReferences((prevReferences) => [
      ...prevReferences,
      {
        ...defaultReferenceEntry,
        id: newId,
      },
    ]);
  };

  const removeReference = (id) => {
    setReferences((prevReferences) => {
      const updatedReferences = prevReferences.filter(
        (reference) => reference.id !== id
      );
      if (updatedReferences.length === 0) {
        return [defaultReferenceEntry];
      }
      return updatedReferences;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = references.filter(
      (ref) =>
        !(
          ref.id === 1 &&
          !ref.name &&
          !ref.position &&
          !ref.company &&
          !ref.contact &&
          !ref.email &&
          !ref.relationship
        )
    );
    updateData(dataToSave);
    nextStep();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main", mr: 2 }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="h5" component="h2">
          References
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide professional references who can speak to your skills and
        experience.
      </Typography>

      <form onSubmit={handleSubmit}>
        {Array.isArray(references) &&
          references.map((reference, index) => (
            <Zoom
              in
              key={reference.id || index}
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
                  {references.length > 1 && (
                    <Tooltip title="Remove this reference">
                      <IconButton
                        color="error"
                        onClick={() => removeReference(reference.id)}
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
                      id={`ref-name-${reference.id}`}
                      label="Reference Name"
                      value={reference.name || ""}
                      onChange={(e) =>
                        handleChange(reference.id, "name", e.target.value)
                      }
                      placeholder="John Smith"
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
                      id={`ref-position-${reference.id}`}
                      label="Position Title"
                      value={reference.position || ""}
                      onChange={(e) =>
                        handleChange(reference.id, "position", e.target.value)
                      }
                      placeholder="Software Engineering Manager"
                      variant="outlined"
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
                      id={`ref-company-${reference.id}`}
                      label="Company Name"
                      value={reference.company || ""}
                      onChange={(e) =>
                        handleChange(reference.id, "company", e.target.value)
                      }
                      placeholder="Tech Solutions Inc."
                      variant="outlined"
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
                      id={`ref-contact-${reference.id}`}
                      label="Contact Phone (Optional)"
                      value={reference.contact || ""}
                      onChange={(e) =>
                        handleChange(reference.id, "contact", e.target.value)
                      }
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id={`ref-email-${reference.id}`}
                      label="Reference Email (Optional)"
                      type="email"
                      value={reference.email || ""}
                      onChange={(e) =>
                        handleChange(reference.id, "email", e.target.value)
                      }
                      placeholder="john.smith@example.com"
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
                      id={`ref-relationship-${reference.id}`}
                      label="Relationship with Reference (Optional)"
                      value={reference.relationship || ""}
                      onChange={(e) =>
                        handleChange(
                          reference.id,
                          "relationship",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Former Manager, Colleague"
                      variant="outlined"
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
            Add Another Reference
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ReferenceForm;
