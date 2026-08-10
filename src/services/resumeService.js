import {
  get,
  off,
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from "firebase/database";
import { database } from "../firebaseConfig";
import {
  createPublicResumeSnapshot,
  DEFAULT_PRESENTATION,
  DEFAULT_RESUME_DATA,
  normalizeResumeRecord,
} from "./resumeModel";

export const resumePath = (userId, resumeId) =>
  `users/${userId}/resumes/${resumeId}`;

export const publicResumePath = (userId, resumeId) =>
  `publicResumes/${userId}/${resumeId}`;

export const subscribeToResume = (userId, resumeId, onData, onError) => {
  const resumeRef = ref(database, resumePath(userId, resumeId));
  const listener = onValue(
    resumeRef,
    (snapshot) => {
      onData(
        snapshot.exists()
          ? normalizeResumeRecord(snapshot.val(), snapshot.key)
          : null
      );
    },
    onError
  );

  return () => off(resumeRef, "value", listener);
};

export const subscribeToResumes = (userId, onData, onError) => {
  const resumesRef = ref(database, `users/${userId}/resumes`);
  const listener = onValue(
    resumesRef,
    (snapshot) => {
      const records = snapshot.val() || {};
      onData(
        Object.entries(records).map(([resumeId, record]) =>
          normalizeResumeRecord(record, resumeId)
        )
      );
    },
    onError
  );

  return () => off(resumesRef, "value", listener);
};

export const createResume = async (
  userId,
  { title, template = "modern", colorScheme = "blue" }
) => {
  const newResumeRef = push(ref(database, `users/${userId}/resumes`));
  const presentation = {
    ...DEFAULT_PRESENTATION,
    template,
    colorScheme,
  };

  await set(newResumeRef, {
    resumeData: DEFAULT_RESUME_DATA,
    metadata: {
      title,
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp(),
      shared: false,
      presentation,
    },
  });

  return newResumeRef.key;
};

export const saveResume = async (
  userId,
  resumeId,
  { resumeData, title, createdAt, presentation }
) => {
  const persistedResumeData = { ...resumeData };
  delete persistedResumeData.id;
  const updates = {
    resumeData: persistedResumeData,
    "metadata/title": title,
    "metadata/lastModified": serverTimestamp(),
    "metadata/presentation": presentation,
  };

  if (createdAt == null) {
    updates["metadata/createdAt"] = serverTimestamp();
  }

  await update(ref(database, resumePath(userId, resumeId)), updates);
};

export const deleteResume = (userId, resumeId) =>
  Promise.all([
    remove(ref(database, resumePath(userId, resumeId))),
    remove(ref(database, publicResumePath(userId, resumeId))),
  ]);

export const duplicateResume = async (userId, resumeId) => {
  const originalSnapshot = await get(
    ref(database, resumePath(userId, resumeId))
  );
  if (!originalSnapshot.exists()) {
    throw new Error("Resume not found");
  }

  const original = originalSnapshot.val();
  const copyRef = push(ref(database, `users/${userId}/resumes`));
  await set(copyRef, {
    ...original,
    metadata: {
      ...(original.metadata || {}),
      title: `${original.metadata?.title || "Resume"} (Copy)`,
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp(),
      shared: false,
    },
  });
  return copyRef.key;
};

export const publishResume = async (userId, resumeId) => {
  const privateRef = ref(database, resumePath(userId, resumeId));
  const privateSnapshot = await get(privateRef);
  if (!privateSnapshot.exists()) {
    throw new Error("Resume not found");
  }

  const snapshot = createPublicResumeSnapshot(
    privateSnapshot.val(),
    resumeId
  );
  await set(ref(database, publicResumePath(userId, resumeId)), snapshot);
  await update(privateRef, {
    "metadata/shared": true,
    "metadata/lastPublishedAt": serverTimestamp(),
  });
  return snapshot;
};

export const unpublishResume = async (userId, resumeId) => {
  await remove(ref(database, publicResumePath(userId, resumeId)));
  await update(ref(database, resumePath(userId, resumeId)), {
    "metadata/shared": false,
    "metadata/lastPublishedAt": null,
  });
};

export const getPublishedResume = async (userId, resumeId) => {
  const snapshot = await get(
    ref(database, publicResumePath(userId, resumeId))
  );
  return snapshot.exists() ? snapshot.val() : null;
};
