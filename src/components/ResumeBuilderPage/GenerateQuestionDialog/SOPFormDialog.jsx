import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SOPFormDialog = ({ open, onClose, onGenerate }) => {
  const [formData, setFormData] = useState({
    targetCountry: "",
    universityName: "",
    universityWebsite: "",
    campusLocation: "",
    courseLevel: "Master's",
    courseName: "",
    additionalAccomplishments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        SOP Generation Details
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please provide the following details to tailor your Statement of
            Purpose accurately.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="targetCountry"
                label="Target Country for Application"
                value={formData.targetCountry}
                onChange={handleChange}
                placeholder="e.g., United States"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="universityName"
                label="College/University Name"
                value={formData.universityName}
                onChange={handleChange}
                placeholder="e.g., Stanford University"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="universityWebsite"
                label="University Website (Optional)"
                value={formData.universityWebsite}
                onChange={handleChange}
                helperText="For context only, will not be mentioned in the SOP."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="campusLocation"
                label="Campus Location (Optional)"
                value={formData.campusLocation}
                onChange={handleChange}
                placeholder="e.g., Stanford, California"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                name="courseLevel"
                label="Course Level"
                value={formData.courseLevel}
                onChange={handleChange}
              >
                <MenuItem value="Bachelor's">Bachelor's</MenuItem>
                <MenuItem value="Master's">Master's</MenuItem>
                <MenuItem value="PhD">PhD</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="courseName"
                label="Specific Course/Program Name"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="e.g., M.S. in Computer Science"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="additionalAccomplishments"
                label="Additional Accomplishments (Optional)"
                value={formData.additionalAccomplishments}
                onChange={handleChange}
                helperText="List any significant achievements, experiences, or skills not on your resume."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Generate SOP
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SOPFormDialog;
