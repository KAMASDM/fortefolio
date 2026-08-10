import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_PRESENTATION,
  DEFAULT_RESUME_DATA,
} from "../services/resumeModel";
import {
  saveResume,
  subscribeToResume,
} from "../services/resumeService";

const EMPTY_METADATA = {
  title: "Untitled Resume",
  createdAt: null,
  lastModified: null,
  shared: false,
  presentation: DEFAULT_PRESENTATION,
};

export const useResumeEditor = ({
  currentUser,
  resumeId,
  navigate,
  initialPreview = false,
}) => {
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA);
  const [resumeMetadata, setResumeMetadata] = useState(EMPTY_METADATA);
  const [presentation, setPresentation] = useState(DEFAULT_PRESENTATION);
  const [unsavedChanges, setUnsavedChangesState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const dirtyRef = useRef(false);
  const savingRef = useRef(false);
  const activeSaveRef = useRef(null);
  const changeVersionRef = useRef(0);
  const latestRef = useRef({
    resumeData,
    resumeMetadata,
    presentation,
  });

  useEffect(() => {
    dirtyRef.current = unsavedChanges;
  }, [unsavedChanges]);

  useEffect(() => {
    latestRef.current = { resumeData, resumeMetadata, presentation };
  }, [resumeData, resumeMetadata, presentation]);

  useEffect(() => {
    if (!currentUser || !resumeId) {
      navigate("/dashboard");
      return undefined;
    }

    setIsLoading(true);
    setError("");
    return subscribeToResume(
      currentUser.uid,
      resumeId,
      (record) => {
        if (!record) {
          setError(`Resume with ID ${resumeId} not found.`);
        } else if (!dirtyRef.current && !savingRef.current) {
          setResumeData({ id: record.id, ...record.resumeData });
          setResumeMetadata(record.metadata);
          setPresentation(record.metadata.presentation);
        }
        setIsLoading(false);
      },
      (subscriptionError) => {
        console.error("Error fetching resume:", subscriptionError);
        setError("Could not load resume data. Check connection or permissions.");
        setIsLoading(false);
      }
    );
  }, [currentUser, resumeId, navigate]);

  const markDirty = useCallback(() => {
    changeVersionRef.current += 1;
    dirtyRef.current = true;
    setUnsavedChangesState(true);
  }, []);

  const setUnsavedChanges = useCallback((nextValue) => {
    const resolved =
      typeof nextValue === "function"
        ? nextValue(dirtyRef.current)
        : nextValue;
    if (resolved) changeVersionRef.current += 1;
    dirtyRef.current = Boolean(resolved);
    setUnsavedChangesState(Boolean(resolved));
  }, []);

  const updateResumeData = useCallback(
    (sectionKey, data) => {
      setResumeData((previous) => ({ ...previous, [sectionKey]: data }));
      markDirty();
    },
    [markDirty]
  );

  const updatePresentation = useCallback(
    (changes) => {
      setPresentation((previous) => ({
        ...previous,
        ...(typeof changes === "function" ? changes(previous) : changes),
      }));
      markDirty();
    },
    [markDirty]
  );

  const updateTitle = useCallback(
    (title) => {
      setResumeMetadata((previous) => ({ ...previous, title }));
      markDirty();
    },
    [markDirty]
  );

  const saveResumeData = useCallback(
    async function persistResume(showSuccessNotification = true) {
      if (!currentUser || !resumeId) return false;
      if (activeSaveRef.current) {
        const previousSaveSucceeded = await activeSaveRef.current;
        if (!previousSaveSucceeded) return false;
        return dirtyRef.current
          ? persistResume(showSuccessNotification)
          : true;
      }

      savingRef.current = true;
      setIsSaving(true);
      setSaveError("");
      const latest = latestRef.current;
      const savedVersion = changeVersionRef.current;

      const saveOperation = (async () => {
        try {
          await saveResume(currentUser.uid, resumeId, {
            resumeData: latest.resumeData,
            title: latest.resumeMetadata.title,
            createdAt: latest.resumeMetadata.createdAt,
            presentation: latest.presentation,
          });
          if (changeVersionRef.current === savedVersion) {
            dirtyRef.current = false;
            setUnsavedChangesState(false);
          }
          setResumeMetadata((previous) => ({
            ...previous,
            lastModified: Date.now(),
            presentation: latest.presentation,
          }));
          if (showSuccessNotification) {
            setNotification({
              open: true,
              message: "Resume saved successfully!",
              severity: "success",
            });
          }
          return true;
        } catch (saveFailure) {
          console.error("Firebase save error:", saveFailure);
          setSaveError("Failed to save. Please check connection and try again.");
          setNotification({
            open: true,
            message: "Failed to save changes",
            severity: "error",
          });
          return false;
        } finally {
          savingRef.current = false;
          activeSaveRef.current = null;
          setIsSaving(false);
        }
      })();

      activeSaveRef.current = saveOperation;
      return saveOperation;
    },
    [currentUser, resumeId]
  );

  useEffect(() => {
    if (!unsavedChanges || isSaving) return undefined;
    const debounce = window.setTimeout(() => saveResumeData(false), 5000);
    return () => window.clearTimeout(debounce);
  }, [
    resumeData,
    resumeMetadata.title,
    presentation,
    saveResumeData,
    unsavedChanges,
    isSaving,
  ]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const navigateWithConfirmation = useCallback(
    (destination) => {
      if (dirtyRef.current) {
        setPendingNavigation(destination);
        setShowLeaveConfirmation(true);
      } else {
        navigate(destination);
      }
    },
    [navigate]
  );

  const handleConfirmedNavigation = useCallback(
    async (saveBeforeLeaving) => {
      setShowLeaveConfirmation(false);
      const canNavigate =
        !saveBeforeLeaving || !dirtyRef.current
          ? true
          : await saveResumeData(true);

      if (canNavigate && pendingNavigation) navigate(pendingNavigation);
      setPendingNavigation(null);
    },
    [navigate, pendingNavigation, saveResumeData]
  );

  return {
    resumeData,
    setResumeData,
    resumeMetadata,
    setResumeMetadata,
    presentation,
    updatePresentation,
    updateTitle,
    updateResumeData,
    unsavedChanges,
    setUnsavedChanges,
    isLoading,
    isSaving,
    error,
    saveError,
    notification,
    setNotification,
    showLeaveConfirmation,
    setShowLeaveConfirmation,
    navigateWithConfirmation,
    handleConfirmedNavigation,
    saveResumeData,
    initialPreview,
  };
};
