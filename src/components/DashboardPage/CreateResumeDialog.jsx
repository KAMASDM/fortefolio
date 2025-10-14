import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Grow,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  NoteAdd as NoteAddIcon,
  Style as StyleIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const lavenderPalette = {
  light: "#EAE4F7",
  soft: "#D8CCF0",
  medium: "#B9A5E3",
  primary: "#9D88D9",
  deep: "#7F68C9",
  text: "#4A3B77",
  darkText: "#2E2152",
  gradient: "linear-gradient(135deg, #B9A5E3 0%, #7F68C9 100%)",
  accentGradient: "linear-gradient(45deg, #A190DD 30%, #7F68C9 90%)",
};

const CreateResumeDialog = ({
  open,
  onClose,
  onSubmit,
  isCreating,
  initialName,
  handleNameChange,
  selectedTemplate,
  setSelectedTemplate,
  selectedColorScheme,
  setSelectedColorScheme,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      elevation: 24,
      sx: {
        borderRadius: 4,
        overflow: "hidden",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: `0 25px 50px -12px ${alpha(lavenderPalette.deep, 0.25)}`,
      },
    }}
    TransitionComponent={Grow}
    TransitionProps={{ timeout: 600 }}
  >
    <Box
      sx={{
        background: lavenderPalette.gradient,
        pt: 3,
        pb: 2,
        px: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        component={motion.div}
        animate={{ rotate: [0, 360], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "loop" }}
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          zIndex: 0,
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <NoteAddIcon sx={{ color: "white", mr: 1 }} />
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 600, color: "white" }}
          >
            {" "}
            Create New Resume{" "}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)" }}>
          {" "}
          Get started with your professional resume in just a few clicks.{" "}
        </Typography>
      </Box>
    </Box>
    <DialogContent sx={{ p: 3 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 3 }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: lavenderPalette.darkText,
            display: "flex",
            alignItems: "center",
            "&::after": {
              content: '""',
              display: "block",
              height: "2px",
              background: lavenderPalette.gradient,
              flexGrow: 1,
              ml: 2,
            },
          }}
        >
          {" "}
          Resume Name{" "}
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Give your resume a name"
          type="text"
          fullWidth
          variant="outlined"
          value={initialName}
          onChange={handleNameChange}
          InputProps={{
            sx: {
              borderRadius: 2,
              "&.Mui-focused": {
                boxShadow: `0 0 0 3px ${alpha(lavenderPalette.medium, 0.2)}`,
              },
            },
          }}
          sx={{ mt: 2 }}
        />
      </Box>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        sx={{ mb: 3 }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: lavenderPalette.darkText,
            display: "flex",
            alignItems: "center",
            "&::after": {
              content: '""',
              display: "block",
              height: "2px",
              background: lavenderPalette.gradient,
              flexGrow: 1,
              ml: 2,
            },
          }}
        >
          {" "}
          Choose Template{" "}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {[
            { id: "modern", name: "Modern" },
            { id: "minimal", name: "Minimal" },
            { id: "creative", name: "Creative" },
            { id: "professional", name: "Professional" },
            { id: "sidebar", name: "Sidebar" },
            { id: "canada", name: "Canada" },
            { id: "europass", name: "Europass" },
            { id: "europe", name: "Europe" },
            { id: "australia", name: "Australia" },
            { id: "usa", name: "USA" },
            { id: "india", name: "India" },
          ].map((template) => (
            <Grid item xs={6} sm={3} key={template.id}>
              <Box
                component={motion.div}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paper
                  elevation={0}
                  onClick={() => setSelectedTemplate(template.id)}
                  sx={{
                    p: 1,
                    border:
                      selectedTemplate === template.id
                        ? `2px solid ${lavenderPalette.deep}`
                        : `1px solid ${lavenderPalette.soft}`,
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor:
                      selectedTemplate === template.id
                        ? alpha(lavenderPalette.medium, 0.1)
                        : "white",
                    boxShadow:
                      selectedTemplate === template.id
                        ? `0 5px 15px ${alpha(lavenderPalette.deep, 0.2)}`
                        : `0 2px 8px ${alpha(lavenderPalette.medium, 0.1)}`,
                  }}
                >
                  <Box
                    sx={{
                      height: 80,
                      bgcolor:
                        selectedTemplate === template.id
                          ? alpha(lavenderPalette.medium, 0.1)
                          : alpha(lavenderPalette.light, 0.5),
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    <StyleIcon
                      sx={{
                        fontSize: 40,
                        color:
                          selectedTemplate === template.id
                            ? lavenderPalette.deep
                            : lavenderPalette.medium,
                        opacity: 0.8,
                      }}
                    />
                  </Box>
                  <Typography
                    align="center"
                    variant="body2"
                    sx={{
                      fontWeight: selectedTemplate === template.id ? 600 : 400,
                      color:
                        selectedTemplate === template.id
                          ? lavenderPalette.darkText
                          : lavenderPalette.text,
                    }}
                  >
                    {" "}
                    {template.name}{" "}
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: lavenderPalette.darkText,
            display: "flex",
            alignItems: "center",
            "&::after": {
              content: '""',
              display: "block",
              height: "2px",
              background: lavenderPalette.gradient,
              flexGrow: 1,
              ml: 2,
            },
          }}
        >
          {" "}
          Select Color Scheme{" "}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
          {[
            { id: "purple", name: "Purple", color: "#7b68ee" },
            { id: "blue", name: "Blue", color: "#1976d2" },
            { id: "teal", name: "Teal", color: "#009688" },
            { id: "charcoal", name: "Charcoal", color: "#455a64" },
          ].map((color) => (
            <Box key={color.id} sx={{ textAlign: "center" }}>
              <Box
                component={motion.div}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedColorScheme(color.id)}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: color.color,
                  borderRadius: "50%",
                  cursor: "pointer",
                  mx: "auto",
                  border:
                    selectedColorScheme === color.id
                      ? "3px solid white"
                      : "3px solid transparent",
                  outline:
                    selectedColorScheme === color.id
                      ? `2px solid ${color.color}`
                      : "none",
                  boxShadow:
                    selectedColorScheme === color.id
                      ? `0 5px 12px ${alpha(color.color, 0.4)}`
                      : `0 2px 8px ${alpha(color.color, 0.2)}`,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 1,
                  fontWeight: selectedColorScheme === color.id ? 600 : 400,
                  color:
                    selectedColorScheme === color.id
                      ? lavenderPalette.darkText
                      : lavenderPalette.text,
                }}
              >
                {" "}
                {color.name}{" "}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button
        onClick={onClose}
        disabled={isCreating}
        sx={{
          color: lavenderPalette.text,
          "&:hover": { backgroundColor: alpha(lavenderPalette.medium, 0.1) },
        }}
      >
        {" "}
        Cancel{" "}
      </Button>
      <Box
        component={motion.div}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isCreating || !initialName.trim()}
          startIcon={
            isCreating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <AddIcon />
            )
          }
          sx={{
            px: 3,
            py: 1,
            ml: 1,
            borderRadius: 6,
            background: lavenderPalette.gradient,
            boxShadow: `0 5px 15px ${alpha(lavenderPalette.deep, 0.2)}`,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              boxShadow: `0 8px 20px ${alpha(lavenderPalette.deep, 0.3)}`,
            },
          }}
        >
          {" "}
          {isCreating ? "Creating..." : "Create & Edit"}{" "}
        </Button>
      </Box>
    </DialogActions>
  </Dialog>
);

export default CreateResumeDialog;
