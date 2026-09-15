import { normalizeResumeRecord, DEFAULT_RESUME_DATA } from "./resumeModel";

const string = (value) =>
  typeof value === "string" ? value.slice(0, 10000) : "";
const fields = (object, keys) =>
  Object.fromEntries(keys.map((key) => [key, string(object?.[key])]));
const rows = (value, keys, extra = () => ({})) =>
  (Array.isArray(value) ? value : [])
    .slice(0, 100)
    .filter((v) => v && typeof v === "object" && !Array.isArray(v))
    .map((row, i) => ({ ...fields(row, keys), ...extra(row), id: i + 1 }));
const strings = (value) =>
  (Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\n|,/)
      : []
  )
    .filter((v) => typeof v === "string")
    .map((v) => v.trim().slice(0, 5000))
    .filter(Boolean)
    .slice(0, 100);

export const sanitizeImportedResume = (input) => {
  const data = input?.resumeData || input;
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !data.personalInfo ||
    typeof data.personalInfo !== "object" ||
    Array.isArray(data.personalInfo)
  )
    throw new Error(
      "This file doesn't contain a valid resume. Choose a ForteFolio backup or paste your resume text.",
    );
  return {
    ...DEFAULT_RESUME_DATA,
    personalInfo: {
      ...fields(data.personalInfo, [
        "fullName",
        "jobTitle",
        "email",
        "phone",
        "location",
        "summary",
        "linkedin",
        "github",
        "website",
        "portfolio",
      ]),
      portfolio: string(
        data.personalInfo.portfolio || data.personalInfo.website,
      ),
    },
    education: rows(data.education, [
      "institution",
      "degree",
      "field",
      "location",
      "startDate",
      "endDate",
      "description",
    ]),
    experience: rows(
      data.experience,
      [
        "company",
        "position",
        "location",
        "startDate",
        "endDate",
        "description",
      ],
      (row) => ({
        current: row.current === true,
        responsibilities: strings(row.responsibilities || row.description),
      }),
    ),
    skills: rows(data.skills, ["name"], (row) => ({
      skills: strings(row.skills),
    })),
    projects: rows(
      data.projects,
      ["title", "link", "technologies", "startDate", "endDate", "description"],
      (row) => ({ current: row.current === true }),
    ),
    references: rows(
      data.references,
      [
        "name",
        "position",
        "company",
        "phone",
        "contact",
        "email",
        "relationship",
      ],
      (row) => ({
        phone: string(row.contact || row.phone),
        contact: string(row.contact || row.phone),
      }),
    ),
  };
};

export const parseResumeBackup = (content) => {
  if (content.length > 1000000)
    throw new Error("Choose a backup smaller than 1 MB.");
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("This is not a valid JSON backup.");
  }
  const resumeData = sanitizeImportedResume(parsed);
  return normalizeResumeRecord(
    {
      resumeData,
      metadata: {
        title:
          string(parsed.title || parsed.metadata?.title) || "Imported Resume",
        presentation: parsed.presentation || parsed.metadata?.presentation,
      },
    },
    "import",
  );
};

export const createResumeBackup = (resumeData, metadata, presentation) =>
  JSON.stringify(
    {
      format: "fortefolio",
      version: 1,
      title: metadata.title,
      resumeData: sanitizeImportedResume(resumeData),
      presentation,
    },
    null,
    2,
  );
