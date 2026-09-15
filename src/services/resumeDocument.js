import { normalizeResumeData, normalizePresentation } from "./resumeModel";
import { hasSectionContent, SECTION_LABELS } from "./resumeInsights";

export const safeUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";
  const url = value.trim();
  try {
    const parsed = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(url) ? url : `https://${url}`,
    );
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
};
export const documentData = (input, presentation = {}) => {
  const data = normalizeResumeData(input);
  const hidden = new Set(presentation.hiddenSections || []);
  const info = { ...data.personalInfo };
  for (const key of ["linkedin", "github", "portfolio", "website"])
    info[key] = safeUrl(info[key]);
  return {
    ...data,
    personalInfo: info,
    ...Object.fromEntries(
      Object.keys(SECTION_LABELS).map((key) => [
        key,
        hidden.has(key)
          ? []
          : data[key]
              .filter(hasSectionContent)
              .map((item) =>
                key === "projects"
                  ? {
                      ...item,
                      link: safeUrl(item.link),
                      url: safeUrl(item.link),
                    }
                  : item,
              ),
      ]),
    ),
  };
};
const date = (value) => {
  if (!value) return "";
  if (/^\d{4}$/.test(value)) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
};
const duration = (item) =>
  [date(item.startDate), item.current ? "Present" : date(item.endDate)]
    .filter(Boolean)
    .join(" – ");
export const getDocumentSections = (input, presentation = {}) => {
  const data = documentData(input, presentation);
  return normalizePresentation({ presentation })
    .sectionOrder.map((key) => ({
      key,
      title: SECTION_LABELS[key],
      items: data[key].map((item) => {
        switch (key) {
          case "experience":
            return {
              title: item.position,
              subtitle: [item.company, item.location]
                .filter(Boolean)
                .join(" · "),
              meta: duration(item),
              lines: [
                ...(item.responsibilities || []).filter(Boolean),
                ...(item.description &&
                !(item.responsibilities || []).includes(item.description)
                  ? [item.description]
                  : []),
              ],
            };
          case "education":
            return {
              title: [item.degree, item.field].filter(Boolean).join(" · "),
              subtitle: [item.institution, item.location]
                .filter(Boolean)
                .join(" · "),
              meta: duration(item),
              lines: [item.description].filter(Boolean),
            };
          case "projects":
            return {
              title: item.title,
              subtitle: item.technologies,
              meta: duration(item),
              lines: [item.description].filter(Boolean),
              link: item.link,
            };
          case "skills":
            return {
              title: item.name,
              lines: [(item.skills || []).filter(Boolean).join(", ")].filter(
                Boolean,
              ),
            };
          case "references":
            return {
              title: item.name,
              subtitle: [item.position, item.company]
                .filter(Boolean)
                .join(" · "),
              lines: [
                [item.email, item.phone].filter(Boolean).join(" · "),
                item.relationship,
              ].filter(Boolean),
            };
          default:
            return {};
        }
      }),
    }))
    .filter((section) => section.items.length);
};
