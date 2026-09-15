import { Component } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
export default class AppErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error("Application rendering failed", error);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <Box sx={{ maxWidth: 520, mx: "auto", py: 10, px: 3 }}>
        <Typography variant="h5" gutterBottom>
          Let's get you back to your resume
        </Typography>
        <Alert severity="info">
          This page couldn't load. Refresh to try again. Saved resumes stay in
          your account; recent edits may be recoverable in this tab.
        </Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Reload page
        </Button>
      </Box>
    );
  }
}
