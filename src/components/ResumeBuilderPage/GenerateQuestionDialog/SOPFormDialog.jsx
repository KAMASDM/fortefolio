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
import SchoolIcon from "@mui/icons-material/School";

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2, // Reduced from 4
          border: `1px solid ${lavenderPalette.soft}`,
          bgcolor: "#FBFAFF",
          overflow: "hidden", // Hide scrollbars on outer container
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
        SOP Generation Details
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
          <Typography
            variant="body2"
            color={lavenderPalette.text}
            sx={{ mb: 3 }}
          >
            Please provide the following details to tailor your Statement of
            Purpose accurately.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
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
              <StyledTextField
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
              <StyledTextField
                fullWidth
                name="universityWebsite"
                label="University Website (Optional)"
                value={formData.universityWebsite}
                onChange={handleChange}
                helperText="For context only, will not be mentioned in the SOP."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                name="campusLocation"
                label="Campus Location (Optional)"
                value={formData.campusLocation}
                onChange={handleChange}
                placeholder="e.g., Stanford, California"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
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
              </StyledTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
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
              <StyledTextField
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
        <DialogActions
          sx={{
            p: 2,
            borderTop: `1px solid ${lavenderPalette.soft}`,
          }}
        >
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
            sx={{
              bgcolor: lavenderPalette.primary,
              "&:hover": { bgcolor: lavenderPalette.deep },
            }}
            startIcon={<SchoolIcon />}
          >
            Generate SOP
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SOPFormDialog;
