import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_PRESENTATION,
  DEFAULT_RESUME_DATA,
} from "../services/resumeModel";
import { saveResume, subscribeToResume } from "../services/resumeService";

const EMPTY_METADATA = {
  title: "Untitled Resume",
  createdAt: null,
  lastModified: null,
  shared: false,
  presentation: DEFAULT_PRESENTATION,
};
const clone = (value) => JSON.parse(JSON.stringify(value));
const storage = (action, key, value) => {
  try {
    return window.sessionStorage[action](key, value);
  } catch {
    return null;
  }
};

export const useResumeEditor = ({
  currentUser,
  resumeId,
  navigate,
  initialPreview = false,
}) => {
  const [document, setDocument] = useState({
    resumeData: DEFAULT_RESUME_DATA,
    resumeMetadata: EMPTY_METADATA,
    presentation: DEFAULT_PRESENTATION,
  });
  const latestRef = useRef(document);
  const [unsavedChanges, setDirty] = useState(false);
  const dirtyRef = useRef(false);
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
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });
  const history = useRef({ past: [], future: [], key: null, time: 0 });
  const saveRef = useRef(null);
  const version = useRef(0);
  const generation = useRef(0);
  const draftKey = `fortefolio:draft:${currentUser?.uid}:${resumeId}`;
  const refreshHistory = () =>
    setHistoryState({
      canUndo: history.current.past.length > 0,
      canRedo: history.current.future.length > 0,
    });
  const markDirty = useCallback(() => {
    version.current += 1;
    dirtyRef.current = true;
    setDirty(true);
  }, []);
  const commit = useCallback(
    (next, group = "change") => {
      if (JSON.stringify(next) === JSON.stringify(latestRef.current)) return;
      const h = history.current;
      if (h.key !== group || Date.now() - h.time > 700)
        h.past = [...h.past.slice(-49), clone(latestRef.current)];
      h.future = [];
      h.key = group;
      h.time = Date.now();
      latestRef.current = next;
      setDocument(next);
      markDirty();
      storage(
        "setItem",
        draftKey,
        JSON.stringify({ document: next, savedAt: Date.now() }),
      );
      refreshHistory();
    },
    [draftKey, markDirty],
  );

  useEffect(() => {
    const currentGeneration = ++generation.current;
    dirtyRef.current = false;
    saveRef.current = null;
    version.current = 0;
    setDirty(false);
    setIsSaving(false);
    setSaveError("");
    setError("");
    setIsLoading(true);
    history.current = { past: [], future: [], key: null, time: 0 };
    refreshHistory();
    if (!currentUser || !resumeId) {
      navigate("/dashboard");
      return;
    }
    let initialized = false;
    const unsubscribe = subscribeToResume(
      currentUser.uid,
      resumeId,
      (record) => {
        if (generation.current !== currentGeneration) return;
        if (!record) {
          setError("This resume was deleted or is no longer available.");
          setIsLoading(false);
          return;
        }
        if (!dirtyRef.current && !saveRef.current) {
          let next = {
            resumeData: { ...record.resumeData, id: record.id },
            resumeMetadata: record.metadata,
            presentation: record.metadata.presentation,
          };
          if (!initialized) {
            try {
              const draft = JSON.parse(storage("getItem", draftKey));
              if (
                draft?.document?.resumeData &&
                draft.savedAt > (record.metadata.lastModified || 0)
              ) {
                next = {
                  ...draft.document,
                  resumeMetadata: {
                    ...record.metadata,
                    title: draft.document.resumeMetadata.title,
                  },
                };
                markDirty();
                setNotification({
                  open: true,
                  message: "Recovered your unsaved edits from this tab.",
                  severity: "info",
                });
              } else storage("removeItem", draftKey);
            } catch {
              storage("removeItem", draftKey);
            }
          }
          latestRef.current = next;
          setDocument(next);
        }
        initialized = true;
        setIsLoading(false);
      },
      () => {
        setError(
          "Could not load your resume. Check your connection and try again.",
        );
        setIsLoading(false);
      },
    );
    return () => {
      generation.current += 1;
      unsubscribe();
    };
  }, [currentUser, resumeId, navigate, draftKey, markDirty]);

  const updateResumeData = useCallback(
    (key, data) =>
      commit(
        {
          ...latestRef.current,
          resumeData: { ...latestRef.current.resumeData, [key]: data },
        },
        key,
      ),
    [commit],
  );
  const updatePresentation = useCallback(
    (changes) =>
      commit(
        {
          ...latestRef.current,
          presentation: {
            ...latestRef.current.presentation,
            ...(typeof changes === "function"
              ? changes(latestRef.current.presentation)
              : changes),
          },
        },
        "presentation",
      ),
    [commit],
  );
  const updateTitle = useCallback(
    (title) =>
      commit(
        {
          ...latestRef.current,
          resumeMetadata: { ...latestRef.current.resumeMetadata, title },
        },
        "title",
      ),
    [commit],
  );
  const setResumeMetadata = useCallback(
    (change) =>
      commit(
        {
          ...latestRef.current,
          resumeMetadata:
            typeof change === "function"
              ? change(latestRef.current.resumeMetadata)
              : change,
        },
        "metadata",
      ),
    [commit],
  );
  const setResumeData = useCallback(
    (change) =>
      commit(
        {
          ...latestRef.current,
          resumeData:
            typeof change === "function"
              ? change(latestRef.current.resumeData)
              : change,
        },
        "replace",
      ),
    [commit],
  );
  const replaceResume = useCallback(
    (data, presentation, title) =>
      commit(
        {
          ...latestRef.current,
          resumeData: { ...data, id: resumeId },
          presentation: presentation || latestRef.current.presentation,
          resumeMetadata: {
            ...latestRef.current.resumeMetadata,
            ...(title ? { title } : {}),
          },
        },
        "import",
      ),
    [commit, resumeId],
  );
  const travel = (direction) => {
    const h = history.current;
    const source = direction === "undo" ? h.past : h.future;
    const target = direction === "undo" ? h.future : h.past;
    if (!source.length) return;
    target.push(clone(latestRef.current));
    const next = source.pop();
    // Sharing and server timestamps are not part of undo history.
    next.resumeMetadata = {
      ...latestRef.current.resumeMetadata,
      title: next.resumeMetadata.title,
    };
    latestRef.current = next;
    setDocument(next);
    h.key = null;
    markDirty();
    refreshHistory();
    storage(
      "setItem",
      draftKey,
      JSON.stringify({ document: next, savedAt: Date.now() }),
    );
  };

  const saveResumeData = useCallback(
    async function persist(showSuccess = true) {
      if (!currentUser || !resumeId) return false;
      if (!navigator.onLine) {
        setSaveError(
          "You're offline. Edits are kept in this tab and will sync when you reconnect.",
        );
        return false;
      }
      if (saveRef.current) {
        const success = await saveRef.current;
        return success && dirtyRef.current ? persist(showSuccess) : success;
      }
      const currentGeneration = generation.current;
      const savedVersion = version.current;
      const latest = latestRef.current;
      setIsSaving(true);
      setSaveError("");
      const operation = (async () => {
        try {
          await Promise.resolve().then(() =>
            saveResume(currentUser.uid, resumeId, {
              resumeData: latest.resumeData,
              title: latest.resumeMetadata.title,
              createdAt: latest.resumeMetadata.createdAt,
              presentation: latest.presentation,
            }),
          );
          if (generation.current !== currentGeneration) return false;
          if (savedVersion === version.current) {
            dirtyRef.current = false;
            setDirty(false);
            storage("removeItem", draftKey);
          }
          const next = {
            ...latestRef.current,
            resumeMetadata: {
              ...latestRef.current.resumeMetadata,
              createdAt: latest.resumeMetadata.createdAt || Date.now(),
              lastModified: Date.now(),
            },
          };
          latestRef.current = next;
          setDocument(next);
          if (showSuccess)
            setNotification({
              open: true,
              message: "Resume saved",
              severity: "success",
            });
          return true;
        } catch {
          if (generation.current === currentGeneration)
            setSaveError(
              "Cloud save failed. Your edits are kept in this tab. Try saving again.",
            );
          return false;
        } finally {
          if (generation.current === currentGeneration) {
            saveRef.current = null;
            setIsSaving(false);
          }
        }
      })();
      saveRef.current = operation;
      return operation;
    },
    [currentUser, resumeId, draftKey],
  );

  useEffect(() => {
    if (!unsavedChanges || isSaving || !isOnline || isLoading) return;
    const timer = window.setTimeout(() => saveResumeData(false), 5000);
    return () => window.clearTimeout(timer);
  }, [document, unsavedChanges, isSaving, isOnline, isLoading, saveResumeData]);
  useEffect(() => {
    const online = () => {
      setIsOnline(true);
      if (dirtyRef.current) saveResumeData(false);
    };
    const offline = () => setIsOnline(false);
    const leave = (e) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const shortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (window.document.activeElement?.isContentEditable)
          window.document.activeElement.blur();
        saveResumeData(true);
      }
    };
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    window.addEventListener("beforeunload", leave);
    window.addEventListener("keydown", shortcut);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      window.removeEventListener("beforeunload", leave);
      window.removeEventListener("keydown", shortcut);
    };
  }, [saveResumeData]);
  const navigateWithConfirmation = useCallback(
    (destination) => {
      if (dirtyRef.current) {
        setPendingNavigation(destination);
        setShowLeaveConfirmation(true);
      } else navigate(destination);
    },
    [navigate],
  );
  const handleConfirmedNavigation = useCallback(
    async (saveBeforeLeaving) => {
      const allowed =
        !saveBeforeLeaving || !dirtyRef.current || (await saveResumeData(true));
      if (allowed) {
        if (!saveBeforeLeaving) {
          dirtyRef.current = false;
          setDirty(false);
          storage("removeItem", draftKey);
        }
        setShowLeaveConfirmation(false);
        if (pendingNavigation) navigate(pendingNavigation);
        setPendingNavigation(null);
      }
    },
    [navigate, pendingNavigation, saveResumeData, draftKey],
  );
  const setUnsavedChanges = useCallback(
    (value) => {
      if (value) markDirty();
    },
    [markDirty],
  );
  return {
    shouldBlockNavigation: () => dirtyRef.current,
    discardDraft: () => {
      dirtyRef.current = false;
      setDirty(false);
      storage("removeItem", draftKey);
    },
    ...document,
    setResumeData,
    setResumeMetadata,
    replaceResume,
    updateTitle,
    updateResumeData,
    updatePresentation,
    unsavedChanges,
    setUnsavedChanges,
    isLoading,
    isSaving,
    isOnline,
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
    ...historyState,
    undo: () => travel("undo"),
    redo: () => travel("redo"),
  };
};
