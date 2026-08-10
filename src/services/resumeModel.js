export const DEFAULT_RESUME_DATA = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  references: [],
};

export const DEFAULT_SECTION_ORDER = [
  "education",
  "experience",
  "skills",
  "projects",
  "references",
];

export const DEFAULT_PRESENTATION = {
  template: "modern",
  colorScheme: "blue",
  fontFamily: "'Poppins', sans-serif",
  fontSize: 10,
  sectionOrder: DEFAULT_SECTION_ORDER,
  starredSections: [],
};

export const COLOR_SCHEME_KEYS = {
  purple: "lavender",
  lavender: "lavender",
  blue: "blue",
  teal: "teal",
  charcoal: "charcoal",
  burgundy: "burgundy",
  forest: "forest",
  midnight: "midnight",
  coral: "coral",
};

export const normalizePresentation = (metadata = {}) => {
  const legacyColor = metadata.colorScheme || metadata.color;
  const presentation = metadata.presentation || {};

  return {
    ...DEFAULT_PRESENTATION,
    ...presentation,
    template:
      presentation.template || metadata.template || DEFAULT_PRESENTATION.template,
    colorScheme:
      COLOR_SCHEME_KEYS[presentation.colorScheme || legacyColor] ||
      presentation.colorScheme ||
      legacyColor ||
      DEFAULT_PRESENTATION.colorScheme,
    sectionOrder: Array.isArray(presentation.sectionOrder)
      ? presentation.sectionOrder
      : DEFAULT_SECTION_ORDER,
    starredSections: Array.isArray(presentation.starredSections)
      ? presentation.starredSections
      : [],
  };
};

export const normalizeResumeRecord = (record, resumeId) => ({
  id: resumeId,
  resumeData: {
    ...DEFAULT_RESUME_DATA,
    ...(record?.resumeData || {}),
    personalInfo: {
      ...DEFAULT_RESUME_DATA.personalInfo,
      ...(record?.resumeData?.personalInfo || {}),
    },
  },
  metadata: {
    title: "Untitled Resume",
    createdAt: null,
    lastModified: null,
    shared: false,
    ...(record?.metadata || {}),
    presentation: normalizePresentation(record?.metadata),
  },
});

const cleanString = (value, maxLength = 5000) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : value;

const cleanObject = (value) => {
  if (Array.isArray(value)) {
    return value.slice(0, 100).map(cleanObject);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "id" || value.id !== undefined)
        .map(([key, child]) => [key, cleanObject(child)])
    );
  }
  return cleanString(value);
};

export const createPublicResumeSnapshot = (record, resumeId) => {
  const normalized = normalizeResumeRecord(record, resumeId);

  return {
    resumeData: cleanObject(normalized.resumeData),
    presentation: normalized.metadata.presentation,
    title: cleanString(normalized.metadata.title, 200),
    publishedAt: Date.now(),
  };
};
