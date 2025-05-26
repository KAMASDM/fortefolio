import React from "react";
import {
  Typography,
  Box,
  Grid,
  CardContent,
  useTheme,
  alpha,
  Button,
  useMediaQuery,
  TextField,
  Paper,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import { useFormik } from "formik";
import * as Yup from "yup";
import AnimatedBackground from "../DashboardPage/AnimatedBackground";
import FloatingElements from "../DashboardPage/FloatingElements";

const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
};

const contactDetails = [
  {
    icon: <LocationOnIcon sx={{ color: lavenderPalette.primary }} />,
    info: "1C, Satyam Apartment Aradhana Society, Vishwas Colony, Alkapuri Vadodara, Gujarat 390005",
    label: "Our Office",
  },
  {
    icon: <EmailIcon sx={{ color: lavenderPalette.primary }} />,
    info: "support@anantsoftcomputing.com",
    label: "Email Us",
  },
  {
    icon: <PhoneIcon sx={{ color: lavenderPalette.primary }} />,
    info: "+91 96385 44455",
    label: "Call Us",
  },
];

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionButton = motion(Button);

const ContactUs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      subject: Yup.string().required("Subject is required"),
      message: Yup.string()
        .min(10, "Message is too short (minimum 10 characters)")
        .required("Message is required"),
    }),
    onSubmit: (values, { resetForm, setSubmitting }) => {
      console.log("Form submitted:", values);
      setTimeout(() => {
        alert("Message Sent! We'll get back to you soon.");
        resetForm();
        setSubmitting(false);
      }, 1000);
    },
  });

  const textFieldStyles = {
    "& label.Mui-focused": {
      color: lavenderPalette.primary,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: lavenderPalette.medium,
      },
      "&:hover fieldset": {
        borderColor: lavenderPalette.primary,
      },
      "&.Mui-focused fieldset": {
        borderColor: lavenderPalette.primary,
      },
      "& input, & textarea": {
        color: lavenderPalette.darkText,
      },
    },
    "& .MuiInputLabel-root": {
      color: lavenderPalette.text,
    },
    "& .MuiFormHelperText-root": {
      color: lavenderPalette.deep,
    },
  };

  return (
    <>
      <AnimatedBackground />
      <FloatingElements />
      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 2, py: { xs: 3, md: 5 } }}
      >
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ mb: 3 }}
        >
          <Button
            variant="outlined"
            onClick={handleBackClick}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: lavenderPalette.primary,
              color: lavenderPalette.primary,
              bgcolor: alpha(lavenderPalette.light, 0.3),
              backdropFilter: "blur(5px)",
              "&:hover": {
                bgcolor: alpha(lavenderPalette.primary, 0.15),
                borderColor: lavenderPalette.deep,
              },
            }}
          >
            Back to Dashboard
          </Button>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          textAlign="center"
          mb={{ xs: 4, md: 6 }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            component="h1"
            fontWeight={700}
            sx={{ color: lavenderPalette.darkText }}
            gutterBottom
          >
            Get in Touch
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            sx={{ color: lavenderPalette.text, maxWidth: 700, mx: "auto" }}
          >
            Have questions about building your resume or our services? We're
            here to help!
          </Typography>
        </MotionBox>

        <Grid container spacing={isMobile ? 3 : 5} justifyContent="center">
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <MotionPaper
              elevation={3}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              sx={{
                p: { xs: 2.5, sm: 4 },
                borderRadius: 4,
                height: "100%",
                backgroundColor: alpha(lavenderPalette.light, 0.7),
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: lavenderPalette.darkText, mb: 3 }}
                >
                  Contact Information
                </Typography>
                {contactDetails.map((detail, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 2,
                      my: 3,
                      alignItems: "center",
                    }}
                  >
                    {detail.icon}
                    <Box>
                      <Typography
                        fontWeight={600}
                        sx={{ color: lavenderPalette.darkText }}
                      >
                        {detail.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: lavenderPalette.text }}
                      >
                        {detail.info}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </MotionPaper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <MotionPaper
              elevation={3}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              sx={{
                p: { xs: 2.5, sm: 4 },
                borderRadius: 4,
                height: "100%",
                backgroundColor: alpha(lavenderPalette.light, 0.7),
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: lavenderPalette.darkText, mb: 2 }}
                >
                  Send Us a Message
                </Typography>
                <Box
                  component="form"
                  onSubmit={formik.handleSubmit}
                  sx={{ mt: 2 }}
                >
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="name"
                        label="Your Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={formik.touched.name && formik.errors.name}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="email"
                        label="Your Email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="subject"
                        label="Subject"
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.subject &&
                          Boolean(formik.errors.subject)
                        }
                        helperText={
                          formik.touched.subject && formik.errors.subject
                        }
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="message"
                        label="Your Message"
                        multiline
                        rows={isMobile ? 3 : 4}
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.message &&
                          Boolean(formik.errors.message)
                        }
                        helperText={
                          formik.touched.message && formik.errors.message
                        }
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MotionButton
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={formik.isSubmitting}
                        endIcon={<SendIcon />}
                        sx={{
                          py: 1.5,
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "1rem",
                          color: "#fff",
                          backgroundColor: lavenderPalette.primary,
                          "&:hover": {
                            backgroundColor: lavenderPalette.deep,
                          },
                          "&.Mui-disabled": {
                            backgroundColor: alpha(
                              lavenderPalette.primary,
                              0.5
                            ),
                          },
                        }}
                        whileHover={{ scale: formik.isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: formik.isSubmitting ? 1 : 0.98 }}
                      >
                        {formik.isSubmitting ? "Sending..." : "Send Message"}
                      </MotionButton>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </MotionPaper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ContactUs;
