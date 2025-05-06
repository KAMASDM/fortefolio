import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";
import {
  ref,
  onValue,
  off,
  push,
  serverTimestamp,
  set,
  remove,
} from "firebase/database";
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Tooltip,
  Grid,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  InputAdornment,
  ButtonGroup,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as DuplicateIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  ExitToApp as LogoutIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  AutoAwesome as AutoAwesomeIcon,
  AutoAwesomeMotion as AutoAwesomeMotionIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import CreateResumeDialog from "../components/DashboardPage/CreateResumeDialog";
import ForteFolioLogo from "../components/DashboardPage/ForteFolioLogo";
import AnimatedBackground from "../components/DashboardPage/AnimatedBackground";
import StatCard from "../components/DashboardPage/StatCard";
import FloatingElements from "../components/DashboardPage/FloatingElements";
import ResumeListItem from "../components/DashboardPage/ResumeListItem";
import ResumeCard from "../components/DashboardPage/ResumeCard";
import EmptyState from "../components/DashboardPage/EmptyState";

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

const initialResumeState = {
  personalInfo: {},
  education: [],
  experience: [],
  skills: [],
  projects: [],
};

function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("completion");
  const [sortDirection, setSortDirection] = useState("desc");
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    mouseX: null,
    mouseY: null,
    resumeId: null,
  });
  const [confirmation, setConfirmation] = useState({
    open: false,
    resumeId: null,
    title: "",
  });
  const [createDialog, setCreateDialog] = useState(false);
  const [newResumeName, setNewResumeName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [selectedColorScheme, setSelectedColorScheme] = useState("purple");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [stats, setStats] = useState({ total: 0, recent: 0, completed: 0 });
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    const resumesRef = ref(database, `users/${currentUser.uid}/resumes`);

    const listener = onValue(
      resumesRef,
      (snapshot) => {
        const data = snapshot.val();
        const loadedResumes = [];

        if (data) {
          Object.keys(data).forEach((key) => {
            const resumeEntry = data[key];
            const resumeData = resumeEntry.resumeData || initialResumeState;
            const metadata = resumeEntry.metadata || {};

            const sections = {
              hasPersonalInfo:
                resumeData.personalInfo &&
                Object.values(resumeData.personalInfo).some(
                  (v) => v && v.trim() !== ""
                ),
              hasEducation:
                resumeData.education && resumeData.education.length > 0,
              hasExperience:
                resumeData.experience && resumeData.experience.length > 0,
              hasSkills: resumeData.skills && resumeData.skills.length > 0,
              hasProjects:
                resumeData.projects && resumeData.projects.length > 0,
            };
            const totalSections = 5;
            const completedSections =
              Object.values(sections).filter(Boolean).length;
            const completionPercentage = Math.round(
              (completedSections / totalSections) * 100
            );

            loadedResumes.push({
              id: key,
              title: metadata.title || "Untitled Resume",
              lastModified: metadata.lastModified || null,
              createdAt: metadata.createdAt || null,
              template: metadata.template || "modern",
              colorScheme: metadata.colorScheme || "purple",
              shared: metadata.shared || false,
              completionPercentage,
              sections,
            });
          });
        }

        setResumes(loadedResumes);

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        setStats({
          total: loadedResumes.length,
          recent: loadedResumes.filter(
            (r) => r.lastModified && new Date(r.lastModified) > oneWeekAgo
          ).length,
          completed: loadedResumes.filter((r) => r.completionPercentage === 100)
            .length,
        });

        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching resumes:", err);
        setError("Could not load your resumes. Please try again later.");
        setIsLoading(false);
      }
    );

    return () => off(resumesRef, "value", listener);
  }, [currentUser]);

  useEffect(() => {
    if (isLoading || !resumes) return;

    let results = [...resumes];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter((resume) =>
        resume.title.toLowerCase().includes(search)
      );
    }

    results.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "title":
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        case "completion":
          valueA = a.completionPercentage || 0;
          valueB = b.completionPercentage || 0;
          break;
        case "createdAt":
        case "lastModified":
          valueA = a[sortBy] || 0;
          valueB = b[sortBy] || 0;
          break;
        default:
          valueA = a.lastModified || 0;
          valueB = b.lastModified || 0;
      }

      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });

    setFilteredResumes(results);
  }, [resumes, searchTerm, sortBy, sortDirection, isLoading]);

  const handleCreateDialogOpen = () => {
    const defaultName = `Resume - ${format(new Date(), "MMMM d, yyyy")}`;
    setNewResumeName(defaultName);
    setSelectedColorScheme("purple");
    setCreateDialog(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialog(false);
  };

  const handleCreateNew = async () => {
    if (!currentUser || !newResumeName.trim()) return;

    setIsCreating(true);

    const resumeName = newResumeName.trim();
    const resumesRef = ref(database, `users/${currentUser.uid}/resumes`);
    const newResumeRef = push(resumesRef);

    const newResumeData = {
      resumeData: initialResumeState,
      metadata: {
        title: resumeName,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
        template: selectedTemplate,
        colorScheme: selectedColorScheme,
        shared: false,
      },
    };

    try {
      await set(newResumeRef, newResumeData);
      setNotification({
        open: true,
        message: "Resume created successfully!",
        type: "success",
      });
      handleCreateDialogClose();
      navigate(`/resume/${newResumeRef.key}`);
    } catch (err) {
      console.error("Error creating new resume:", err);
      setNotification({
        open: true,
        message: "Failed to create resume. Please try again.",
        type: "error",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (resumeId) => navigate(`/resume/${resumeId}`);
  const handlePreview = (resumeId) =>
    navigate(`/resume/${resumeId}`, { state: { preview: true } });

  const handleDelete = async (resumeId) => {
    if (!currentUser || !resumeId) return;
    try {
      const resumeRef = ref(
        database,
        `users/${currentUser.uid}/resumes/${resumeId}`
      );
      await remove(resumeRef);
      setNotification({
        open: true,
        message: "Resume deleted successfully",
        type: "success",
      });
    } catch (err) {
      console.error("Error deleting resume:", err);
      setNotification({
        open: true,
        message: "Failed to delete resume",
        type: "error",
      });
    } finally {
      setConfirmation({ open: false, resumeId: null, title: "" });
    }
  };

  const handleDuplicate = async (resumeId) => {
    if (!currentUser || !resumeId) return;
    try {
      const originalResumeRef = ref(
        database,
        `users/${currentUser.uid}/resumes/${resumeId}`
      );
      const snapshot = await new Promise((resolve, reject) => {
        onValue(
          originalResumeRef,
          (snap) => resolve(snap),
          (err) => reject(err),
          { onlyOnce: true }
        );
      });

      const originalData = snapshot.val();
      if (!originalData) throw new Error("Resume not found");

      const resumesRef = ref(database, `users/${currentUser.uid}/resumes`);
      const newResumeRef = push(resumesRef);

      const duplicateData = {
        ...originalData,
        metadata: {
          ...(originalData.metadata || {}),
          title: `${originalData.metadata?.title || "Resume"} (Copy)`,
          createdAt: serverTimestamp(),
          lastModified: serverTimestamp(),
        },
      };

      await set(newResumeRef, duplicateData);
      setNotification({
        open: true,
        message: "Resume duplicated successfully",
        type: "success",
      });
    } catch (err) {
      console.error("Error duplicating resume:", err);
      setNotification({
        open: true,
        message: "Failed to duplicate resume",
        type: "error",
      });
    }
  };

  const handleSortMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleSortMenuClose = () => setAnchorEl(null);

  const handleSort = (field) => {
    setSortBy((prevSortBy) => {
      if (prevSortBy === field) {
        setSortDirection((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
      } else {
        setSortDirection("desc");
      }
      return field;
    });
    handleSortMenuClose();
  };

  const handleContextMenu = (event, resumeId) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      resumeId,
    });
  };

  const handleContextMenuClose = () =>
    setContextMenu({ mouseX: null, mouseY: null, resumeId: null });

  const handleConfirmationOpen = (resumeId, title) => {
    setConfirmation({ open: true, resumeId, title });
    handleContextMenuClose();
  };

  const handleConfirmationClose = () =>
    setConfirmation({ open: false, resumeId: null, title: "" });

  const handleRefresh = () => {
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      if (!error) setIsLoading(false);
    }, 500);
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      setNotification({
        open: true,
        message: "Logout failed. Please try again.",
        type: "error",
      });
    }
  };

  const renderSkeletonCards = (count = 6) =>
    Array(count)
      .fill(0)
      .map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
          <Skeleton
            variant="rounded"
            height={320}
            sx={{ borderRadius: 3, opacity: 1 - index * 0.1 }}
          />
        </Grid>
      ));

  const renderResumeList = () => {
    if (isLoading) {
      return (
        <Grid container spacing={3}>
          {renderSkeletonCards(viewMode === "grid" ? 6 : 3)}
        </Grid>
      );
    }

    if (error) {
      return (
        <Alert
          severity="error"
          sx={{
            m: 2,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "error.light",
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
              sx={{ fontWeight: 600 }}
            >
              {" "}
              Retry{" "}
            </Button>
          }
        >
          {" "}
          {error}{" "}
        </Alert>
      );
    }

    if (filteredResumes.length === 0) {
      if (resumes.length > 0) {
        return (
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            sx={{
              textAlign: "center",
              py: 6,
              px: 3,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              border: `1px solid ${lavenderPalette.soft}`,
            }}
          >
            <Box
              component={motion.div}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              sx={{ mb: 3, display: "inline-block" }}
            >
              <SearchIcon
                sx={{
                  fontSize: 70,
                  color: lavenderPalette.medium,
                  opacity: 0.7,
                }}
              />
            </Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 700, color: lavenderPalette.darkText }}
            >
              {" "}
              No matching resumes found{" "}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: lavenderPalette.text,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              {" "}
              Try different search terms or clear your search to see all of your
              resumes.{" "}
            </Typography>
            <Box
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                onClick={() => setSearchTerm("")}
                startIcon={<CloseIcon />}
                sx={{
                  borderRadius: 8,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  color: lavenderPalette.deep,
                  borderColor: lavenderPalette.medium,
                  "&:hover": {
                    borderColor: lavenderPalette.deep,
                    backgroundColor: alpha(lavenderPalette.medium, 0.1),
                  },
                }}
              >
                {" "}
                Clear search{" "}
              </Button>
            </Box>
          </Box>
        );
      } else {
        return <EmptyState onCreateNew={handleCreateDialogOpen} />;
      }
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === "grid" ? (
            <Grid container spacing={3}>
              {filteredResumes.map((resume) => (
                <Grid item xs={12} sm={6} md={4} key={resume.id}>
                  <ResumeCard
                    resume={resume}
                    onEdit={handleEdit}
                    onPreview={handlePreview}
                    onContextMenu={handleContextMenu}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              {filteredResumes.map((resume) => (
                <ResumeListItem
                  key={resume.id}
                  resume={resume}
                  onEdit={handleEdit}
                  onPreview={handlePreview}
                  onContextMenu={handleContextMenu}
                />
              ))}
            </Box>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <AnimatedBackground />
      <FloatingElements />
      <Box
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        sx={{}}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
            }}
          >
            <Box
              component={motion.div}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box
                component={motion.div}
                whileHover={{
                  rotate: [0, -10, 10, -5, 0],
                  transition: { duration: 0.5 },
                }}
                sx={{ mr: 1.5, display: "flex" }}
              >
                <ForteFolioLogo />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: lavenderPalette.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {" "}
                MakeMyForte{" "}
              </Typography>
            </Box>
            <Box
              component={motion.div}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              {currentUser && (
                <Box
                  component={motion.div}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    py: 0.5,
                    px: 1.5,
                    borderRadius: 6,
                    backgroundColor: alpha(lavenderPalette.light, 0.5),
                    border: `1px solid ${lavenderPalette.soft}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mr: 1, color: lavenderPalette.text, fontWeight: 500 }}
                    noWrap
                  >
                    {" "}
                    {currentUser.displayName || currentUser.email}{" "}
                  </Typography>
                  <Tooltip title={currentUser.email || ""}>
                    <Avatar
                      src={currentUser.photoURL || undefined}
                      sx={{
                        width: 32,
                        height: 32,
                        border: `2px solid ${lavenderPalette.medium}`,
                      }}
                    />
                  </Tooltip>
                </Box>
              )}
              <Tooltip title="Logout">
                <Box
                  component={motion.div}
                  whileHover={{
                    rotate: [0, 15, 0],
                    transition: { duration: 0.3 },
                  }}
                >
                  <IconButton
                    color="error"
                    onClick={handleLogout}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.8)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      border: "1px solid rgba(255,82,82,0.1)",
                      "&:hover": { backgroundColor: "rgba(255,82,82,0.05)" },
                    }}
                  >
                    {" "}
                    <LogoutIcon />{" "}
                  </IconButton>
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ pb: 8, position: "relative", zIndex: 1 }}>
        {!isMobile && (
          <Box
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ mb: 4, mt: 4 }}
          >
            <Grid container spacing={3}>
              <StatCard
                icon={<DescriptionIcon fontSize="large" />}
                title="Total Resumes"
                value={stats.total}
                delay={0.1}
                color={lavenderPalette.deep}
              />
              <StatCard
                icon={<CalendarIcon fontSize="large" />}
                title="Updated Recently"
                value={stats.recent}
                delay={0.2}
                color="#7c4dff"
              />
              <StatCard
                icon={<AutoAwesomeIcon fontSize="large" />}
                title="Completed"
                value={stats.completed}
                delay={0.3}
                color="#00bfa5"
              />
            </Grid>
          </Box>
        )}
        <Box
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          sx={{
            mb: 3,
            position: { xs: "sticky", sm: "static" },
            top: { xs: 0 },
            zIndex: { xs: 1100 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${lavenderPalette.soft}`,
              boxShadow: `0 8px 25px ${alpha(lavenderPalette.primary, 0.1)}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: lavenderPalette.darkText,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component={motion.div}
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    sx={{ display: { xs: "none", sm: "inline-block" }, mr: 1 }}
                  >
                    <AutoAwesomeMotionIcon
                      sx={{
                        color: lavenderPalette.deep,
                        verticalAlign: "middle",
                        fontSize: 20,
                      }}
                    />
                  </Box>{" "}
                  Your Resumes
                </Typography>
                {!isLoading && (
                  <Chip
                    label={filteredResumes.length}
                    size="small"
                    sx={{
                      backgroundColor: alpha(lavenderPalette.medium, 0.1),
                      color: lavenderPalette.deep,
                      fontWeight: 600,
                      borderRadius: 4,
                      border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}`,
                    }}
                  />
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 0.5, sm: 1.5 },
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <TextField
                  id="search-resumes"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          fontSize="small"
                          sx={{ color: lavenderPalette.primary }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm ? (
                      <InputAdornment position="end">
                        {" "}
                        <IconButton
                          aria-label="clear search"
                          onClick={() => setSearchTerm("")}
                          edge="end"
                          size="small"
                        >
                          {" "}
                          <CloseIcon fontSize="small" />{" "}
                        </IconButton>{" "}
                      </InputAdornment>
                    ) : null,
                    sx: {
                      borderRadius: 6,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&.Mui-focused": {
                        boxShadow: `0 0 0 3px ${alpha(
                          lavenderPalette.medium,
                          0.2
                        )}`,
                      },
                    },
                  }}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    order: { xs: 3, sm: 0 },
                  }}
                />
                <Button
                  size="small"
                  startIcon={<SortIcon />}
                  variant="outlined"
                  onClick={handleSortMenuOpen}
                  sx={{
                    borderRadius: 6,
                    textTransform: "none",
                    fontWeight: 500,
                    color: lavenderPalette.deep,
                    borderColor: lavenderPalette.medium,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    "&:hover": {
                      borderColor: lavenderPalette.deep,
                      backgroundColor: alpha(lavenderPalette.medium, 0.1),
                    },
                  }}
                >
                  {" "}
                  Sort{" "}
                </Button>
                <ButtonGroup
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 6,
                    overflow: "hidden",
                    "& .MuiButton-root": {
                      borderColor: lavenderPalette.medium,
                      color: lavenderPalette.text,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&:hover": {
                        borderColor: lavenderPalette.deep,
                        backgroundColor: alpha(lavenderPalette.medium, 0.1),
                      },
                      "&.Mui-selected, &.Mui-selected:hover": {
                        background: lavenderPalette.gradient,
                        color: "white",
                        borderColor: lavenderPalette.deep,
                      },
                    },
                  }}
                >
                  <Tooltip title="Grid View">
                    <Button
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? "Mui-selected" : ""}
                      sx={{
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                      }}
                    >
                      {" "}
                      <ListViewIcon />{" "}
                    </Button>
                  </Tooltip>
                  <Tooltip title="List View">
                    <Button
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? "Mui-selected" : ""}
                      sx={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
                    >
                      {" "}
                      <GridViewIcon />{" "}
                    </Button>
                  </Tooltip>
                </ButtonGroup>
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    order: { xs: 0, sm: 4 },
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateDialogOpen}
                    size="small"
                    sx={{
                      borderRadius: 6,
                      background: lavenderPalette.gradient,
                      boxShadow: `0 4px 12px ${alpha(
                        lavenderPalette.deep,
                        0.2
                      )}`,
                      textTransform: "none",
                      fontWeight: 600,
                      pl: 2,
                      pr: 2.5,
                      py: 1,
                      width: "100%",
                      "&:hover": {
                        boxShadow: `0 6px 16px ${alpha(
                          lavenderPalette.deep,
                          0.3
                        )}`,
                      },
                    }}
                  >
                    {" "}
                    Create New{" "}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
        <Box
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {renderResumeList()}
        </Box>
      </Container>
      <CreateResumeDialog
        open={createDialog}
        onClose={handleCreateDialogClose}
        onSubmit={handleCreateNew}
        isCreating={isCreating}
        initialName={newResumeName}
        handleNameChange={(e) => setNewResumeName(e.target.value)}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        selectedColorScheme={selectedColorScheme}
        setSelectedColorScheme={setSelectedColorScheme}
      />
      <Dialog
        open={confirmation.open}
        onClose={handleConfirmationClose}
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "#ffebee",
            color: "#d32f2f",
            fontWeight: 600,
            pb: 1,
          }}
        >
          {" "}
          Confirm Deletion{" "}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <DialogContentText>
            {" "}
            Are you sure you want to delete{" "}
            <span style={{ fontWeight: 600 }}>{confirmation.title}</span>? This
            cannot be undone.{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleConfirmationClose}
            sx={{
              color: lavenderPalette.text,
              "&:hover": {
                backgroundColor: alpha(lavenderPalette.medium, 0.1),
              },
            }}
          >
            {" "}
            Cancel{" "}
          </Button>
          <Box
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => handleDelete(confirmation.resumeId)}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: 6 }}
            >
              {" "}
              Delete{" "}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <Menu
        open={contextMenu.mouseY !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu.mouseY !== null && contextMenu.mouseX !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: `0 10px 30px ${alpha(lavenderPalette.medium, 0.2)}`,
            border: `1px solid ${lavenderPalette.soft}`,
            overflow: "hidden",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleEdit(contextMenu.resumeId);
            handleContextMenuClose();
          }}
          sx={{
            py: 1.5,
            "&:hover": { backgroundColor: alpha(lavenderPalette.medium, 0.1) },
          }}
        >
          {" "}
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: lavenderPalette.deep }} />
          </ListItemIcon>{" "}
          <ListItemText
            primary="Edit Resume"
            primaryTypographyProps={{
              fontWeight: 500,
              color: lavenderPalette.darkText,
            }}
          />{" "}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handlePreview(contextMenu.resumeId);
            handleContextMenuClose();
          }}
          sx={{
            py: 1.5,
            "&:hover": { backgroundColor: alpha(lavenderPalette.medium, 0.1) },
          }}
        >
          {" "}
          <ListItemIcon>
            <VisibilityIcon
              fontSize="small"
              sx={{ color: lavenderPalette.deep }}
            />
          </ListItemIcon>{" "}
          <ListItemText
            primary="Preview"
            primaryTypographyProps={{
              fontWeight: 500,
              color: lavenderPalette.darkText,
            }}
          />{" "}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDuplicate(contextMenu.resumeId);
            handleContextMenuClose();
          }}
          sx={{
            py: 1.5,
            "&:hover": { backgroundColor: alpha(lavenderPalette.medium, 0.1) },
          }}
        >
          {" "}
          <ListItemIcon>
            <DuplicateIcon
              fontSize="small"
              sx={{ color: lavenderPalette.deep }}
            />
          </ListItemIcon>{" "}
          <ListItemText
            primary="Duplicate"
            primaryTypographyProps={{
              fontWeight: 500,
              color: lavenderPalette.darkText,
            }}
          />{" "}
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={() => {
            const resume = resumes.find((r) => r.id === contextMenu.resumeId);
            if (resume)
              handleConfirmationOpen(contextMenu.resumeId, resume.title);
            else handleContextMenuClose();
          }}
          sx={{
            py: 1.5,
            "&:hover": { backgroundColor: "rgba(255,82,82,0.1)" },
          }}
        >
          {" "}
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>{" "}
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ color: "error.main", fontWeight: 500 }}
          />{" "}
        </MenuItem>
      </Menu>
      <Menu
        id="sort-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSortMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: `0 10px 30px ${alpha(lavenderPalette.medium, 0.2)}`,
            border: `1px solid ${lavenderPalette.soft}`,
            overflow: "hidden",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => handleSort("lastModified")}
          sx={{
            py: 1.5,
            backgroundColor:
              sortBy === "lastModified"
                ? alpha(lavenderPalette.medium, 0.1)
                : "transparent",
            "&:hover": { backgroundColor: alpha(lavenderPalette.medium, 0.1) },
          }}
        >
          {" "}
          <ListItemIcon>
            {sortBy === "lastModified" &&
              (sortDirection === "desc" ? (
                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{ color: lavenderPalette.deep }}
                />
              ) : (
                <KeyboardArrowUpIcon
                  fontSize="small"
                  sx={{ color: lavenderPalette.deep }}
                />
              ))}
          </ListItemIcon>{" "}
          <ListItemText
            primary="Last Modified"
            primaryTypographyProps={{
              fontWeight: sortBy === "lastModified" ? 600 : 400,
              color:
                sortBy === "lastModified"
                  ? lavenderPalette.darkText
                  : lavenderPalette.text,
            }}
          />{" "}
        </MenuItem>
        <MenuItem
          onClick={() => handleSort("title")}
          sx={{
            py: 1.5,
            backgroundColor:
              sortBy === "title"
                ? alpha(lavenderPalette.medium, 0.1)
                : "transparent",
            "&:hover": { backgroundColor: alpha(lavenderPalette.medium, 0.1) },
          }}
        >
          {" "}
          <ListItemIcon>
            {sortBy === "title" &&
              (sortDirection === "desc" ? (
                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{ color: lavenderPalette.deep }}
                />
              ) : (
                <KeyboardArrowUpIcon
                  fontSize="small"
                  sx={{ color: lavenderPalette.deep }}
                />
              ))}
          </ListItemIcon>{" "}
          <ListItemText
            primary="Name"
            primaryTypographyProps={{
              fontWeight: sortBy === "title" ? 600 : 400,
              color:
                sortBy === "title"
                  ? lavenderPalette.darkText
                  : lavenderPalette.text,
            }}
          />{" "}
        </MenuItem>
        <MenuItem
          onClick={() => handleSort("completion")}
          sx={{
            py: 1.5,
            backgroundColor:
              sortBy === "completion"
                ? alpha(lavenderPalette.medium, 0.1)
                : "transparent",
            "&:hover": { backgroundColor: alpha(lavenderPalette.medium, 0.1) },
          }}
        >
          {" "}
          <ListItemIcon>
            {sortBy === "completion" &&
              (sortDirection === "desc" ? (
                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{ color: lavenderPalette.deep }}
                />
              ) : (
                <KeyboardArrowUpIcon
                  fontSize="small"
                  sx={{ color: lavenderPalette.deep }}
                />
              ))}
          </ListItemIcon>{" "}
          <ListItemText
            primary="Completion"
            primaryTypographyProps={{
              fontWeight: sortBy === "completion" ? 600 : 400,
              color:
                sortBy === "completion"
                  ? lavenderPalette.darkText
                  : lavenderPalette.text,
            }}
          />{" "}
        </MenuItem>
        <MenuItem
          onClick={() => handleSort("createdAt")}
          sx={{
            py: 1.5,
            backgroundColor:
              sortBy === "createdAt"
                ? alpha(lavenderPalette.medium, 0.1)
                : "transparent",
            "&:hover": { backgroundColor: alpha(lavenderPalette.medium, 0.1) },
          }}
        >
          {" "}
          <ListItemIcon>
            {sortBy === "createdAt" &&
              (sortDirection === "desc" ? (
                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{ color: lavenderPalette.deep }}
                />
              ) : (
                <KeyboardArrowUpIcon
                  fontSize="small"
                  sx={{ color: lavenderPalette.deep }}
                />
              ))}
          </ListItemIcon>{" "}
          <ListItemText
            primary="Date Created"
            primaryTypographyProps={{
              fontWeight: sortBy === "createdAt" ? 600 : 400,
              color:
                sortBy === "createdAt"
                  ? lavenderPalette.darkText
                  : lavenderPalette.text,
            }}
          />{" "}
        </MenuItem>
      </Menu>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.type}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          }}
        >
          {" "}
          {notification.message}{" "}
        </Alert>
      </Snackbar>
    </>
  );
}

export default DashboardPage;
