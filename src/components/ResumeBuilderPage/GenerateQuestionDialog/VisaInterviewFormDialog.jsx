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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";

const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
};

const StyledTextField = (props) => (
  <TextField
    {...props}
    variant="outlined"
    sx={{
      "& .MuiInputLabel-root": { color: lavenderPalette.text },
      "& .MuiOutlinedInput-root": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: lavenderPalette.soft,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: lavenderPalette.medium,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: lavenderPalette.primary,
          borderWidth: "2px",
        },
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: lavenderPalette.primary,
      },
      ...props.sx,
    }}
  />
);

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${lavenderPalette.soft}`,
          bgcolor: '#FBFAFF',
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          color: lavenderPalette.darkText,
          borderBottom: `1px solid ${lavenderPalette.soft}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        Visa Interview Question Details
        <IconButton
          onClick={onClose}
          sx={{
            color: lavenderPalette.text,
            "&:hover": { color: lavenderPalette.deep },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            overflow: "hidden",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Typography variant="body2" color={lavenderPalette.text} sx={{ mb: 3 }}>
            Provide these details to generate interview questions tailored to your specific visa application.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
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
              </StyledTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
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
              <StyledTextField
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
              <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 500, color: lavenderPalette.text }}>
                Sponsor Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                required
                name="sponsorName"
                label="Sponsor's Full Name"
                value={formData.sponsorName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
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
              <StyledTextField
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

        <DialogActions sx={{ p: 2, borderTop: `1px solid ${lavenderPalette.soft}` }}>
          <Button
            onClick={onClose}
            sx={{
              color: lavenderPalette.text,
              "&:hover": {
                backgroundColor: lavenderPalette.light,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<AssignmentIcon />}
            sx={{
              bgcolor: lavenderPalette.primary,
              "&:hover": { bgcolor: lavenderPalette.deep },
            }}
          >
            Generate Questions
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VisaInterviewFormDialog;
