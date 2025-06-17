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
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const VisaInterviewFormDialog = ({ open, onClose, onGenerate }) => {
  const [formData, setFormData] = useState({
    country: "USA",
    universityName: "",
    courseName: "",
    sponsorName: "",
    sponsorSalary: "",
    sponsorDesignation: "",
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
        Visa Interview Question Details
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Provide these details to generate interview questions tailored to
            your specific visa application.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                name="country"
                label="Target Country"
                value={formData.country}
                onChange={handleChange}
              >
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="UK">UK</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="universityName"
                label="University Name"
                value={formData.universityName}
                onChange={handleChange}
                placeholder="e.g., University of California"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="courseName"
                label="Specific Course/Program Name"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="e.g., M.S. in Data Science"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
                Sponsor Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="sponsorName"
                label="Sponsor's Full Name"
                value={formData.sponsorName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="sponsorDesignation"
                label="Sponsor's Designation"
                value={formData.sponsorDesignation}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="sponsorSalary"
                label="Sponsor's Annual Salary"
                value={formData.sponsorSalary}
                onChange={handleChange}
                placeholder="e.g., 120,000 USD"
                helperText="Please include the currency."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Generate Questions
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VisaInterviewFormDialog;
