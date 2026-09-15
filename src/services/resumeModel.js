import { constants } from "../components/ResumeBuilderPage/ResumePreview/constants";
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
  hiddenSections: [],
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
    template: Object.values(constants.TEMPLATES).includes(
      presentation.template || metadata.template,
    )
      ? presentation.template || metadata.template
      : DEFAULT_PRESENTATION.template,
    fontFamily: Object.values(constants.FONTS).includes(presentation.fontFamily)
      ? presentation.fontFamily
      : DEFAULT_PRESENTATION.fontFamily,
    fontSize: Math.max(8, Math.min(16, Number(presentation.fontSize) || 10)),
    hiddenSections: (Array.isArray(presentation.hiddenSections)
      ? presentation.hiddenSections
      : []
    ).filter((key) => DEFAULT_SECTION_ORDER.includes(key)),
    colorScheme:
      COLOR_SCHEME_KEYS[presentation.colorScheme || legacyColor] ||
      presentation.colorScheme ||
      legacyColor ||
      DEFAULT_PRESENTATION.colorScheme,
    sectionOrder: Array.isArray(presentation.sectionOrder)
      ? [
          ...new Set([
            ...presentation.sectionOrder.filter((key) =>
              DEFAULT_SECTION_ORDER.includes(key),
            ),
            ...DEFAULT_SECTION_ORDER,
          ]),
        ]
      : DEFAULT_SECTION_ORDER,
    starredSections: Array.isArray(presentation.starredSections)
      ? presentation.starredSections.filter((key) =>
          DEFAULT_SECTION_ORDER.includes(key),
        )
      : [],
  };
};

const scalarText = (value) =>
  typeof value === "string"
    ? value
    : typeof value === "number"
      ? String(value)
      : "";

export const normalizeResumeData = (input = {}) => {
  const data = input && typeof input === "object" ? input : {};
  const info = {
    ...DEFAULT_RESUME_DATA.personalInfo,
    ...(data.personalInfo || {}),
  };
  for (const key of [
    "fullName",
    "jobTitle",
    "summary",
    "email",
    "phone",
    "location",
    "linkedin",
    "github",
    "portfolio",
    "website",
  ]) {
    if (key in info) info[key] = scalarText(info[key]);
  }
  info.website = Object.hasOwn(data.personalInfo || {}, "portfolio")
    ? info.portfolio
    : info.website || "";
  info.portfolio = info.website;
  const list = (key) =>
    (Array.isArray(data[key]) ? data[key] : [])
      .filter((item) => item && typeof item === "object")
      .map((item, index) => ({
        ...item,
        ...Object.fromEntries(
          [
            "name",
            "title",
            "company",
            "position",
            "institution",
            "degree",
            "field",
            "description",
            "location",
            "startDate",
            "endDate",
            "email",
            "phone",
            "contact",
            "relationship",
            "link",
            "url",
            "technologies",
          ]
            .filter((key) => key in item)
            .map((key) => [key, scalarText(item[key])]),
        ),
        id: Number.isFinite(Number(item.id)) ? Number(item.id) : index + 1,
      }));
  return {
    ...data,
    personalInfo: info,
    education: list("education"),
    references: list("references").map((item) => ({
      ...item,
      contact: item.contact || item.phone || "",
      phone: item.contact || item.phone || "",
    })),
    experience: list("experience").map((item) => ({
      ...item,
      responsibilities: Array.isArray(item.responsibilities)
        ? item.responsibilities.map(scalarText)
        : scalarText(item.responsibilities || item.description || "").split(
            "\n",
          ),
    })),
    skills: list("skills").map((item) => ({
      ...item,
      skills: Array.isArray(item.skills)
        ? item.skills.map(scalarText)
        : scalarText(item.skills || "")
            .split(",")
            .filter(Boolean),
    })),
    projects: list("projects").map((item) => ({
      ...item,
      title: item.title || item.name || "",
      link: item.link || item.url || "",
    })),
  };
};

export const normalizeResumeRecord = (record, resumeId) => ({
  id: resumeId,
  resumeData: normalizeResumeData(record?.resumeData),
  metadata: {
    createdAt: null,
    lastModified: null,
    shared: false,
    ...(record?.metadata || {}),
    title: scalarText(record?.metadata?.title) || "Untitled Resume",
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
        .map(([key, child]) => [key, cleanObject(child)]),
    );
  }
  return cleanString(value);
};

export const createPublicResumeSnapshot = (record, resumeId, sharing = {}) => {
  const normalized = normalizeResumeRecord(record, resumeId);

  const data = cleanObject(
    Object.fromEntries(
      ["personalInfo", ...DEFAULT_SECTION_ORDER].map((key) => [
        key,
        normalized.resumeData[key],
      ]),
    ),
  );
  data.personalInfo = Object.fromEntries(
    [
      "fullName",
      "jobTitle",
      "summary",
      "email",
      "phone",
      "location",
      "linkedin",
      "github",
      "portfolio",
      "website",
      "profilePhoto",
    ]
      .filter((key) => data.personalInfo[key] !== undefined)
      .map((key) => [key, data.personalInfo[key]]),
  );
  delete data.id;
  if (sharing.email === false) delete data.personalInfo.email;
  if (sharing.phone !== true) delete data.personalInfo.phone;
  if (sharing.location === false) delete data.personalInfo.location;
  if (sharing.references !== true) data.references = [];
  for (const key of normalized.metadata.presentation.hiddenSections || [])
    data[key] = [];
  return {
    resumeData: data,
    presentation: normalized.metadata.presentation,
    title: cleanString(normalized.metadata.title, 200),
    publishedAt: Date.now(),
  };
};
