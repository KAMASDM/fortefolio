import {
  normalizeResumeRecord,
  createPublicResumeSnapshot,
} from "../../src/services/resumeModel";
const seed = {
  resumeData: {
    personalInfo: {
      fullName: "Alex Morgan",
      jobTitle: "Product Designer",
      email: "alex@example.com",
      phone: "+1 555 0100",
      location: "London",
      summary:
        "Product designer creating accessible digital experiences. Collaborates with engineering teams to translate customer research into clear, useful interfaces.",
      portfolio: "https://example.com/alex",
    },
    experience: [
      {
        id: 1,
        company: "Studio North",
        position: "Product Designer",
        startDate: "2022-01",
        current: true,
        responsibilities: [
          "Redesigned onboarding, reducing setup time by 30%.",
        ],
      },
    ],
    education: [
      {
        id: 1,
        institution: "Design University",
        degree: "BA",
        field: "Design",
        startDate: "2018-09",
        endDate: "2021-06",
      },
    ],
    skills: [
      { id: 1, name: "Design", skills: ["Figma", "Research", "Prototyping"] },
    ],
    projects: [
      {
        id: 1,
        title: "Community Toolkit",
        description:
          "Built an accessible design toolkit for local organizations.",
        link: "https://example.com/toolkit",
      },
    ],
    references: [
      {
        id: 1,
        name: "Jordan Lee",
        position: "Design Lead",
        company: "Studio North",
        email: "jordan@example.com",
        phone: "+1 555 0123",
      },
    ],
  },
  metadata: {
    title: "Product Designer Resume",
    createdAt: 1,
    lastModified: 1,
    shared: false,
    presentation: { template: "modern", colorScheme: "lavender" },
  },
};
const records = JSON.parse(
  sessionStorage.getItem("test:records") || "null",
) || { demo: seed };
const publicRecords = JSON.parse(sessionStorage.getItem("test:public") || "{}");
const listeners = new Set();
const notify = () => {
  sessionStorage.setItem("test:records", JSON.stringify(records));
  sessionStorage.setItem("test:public", JSON.stringify(publicRecords));
  listeners.forEach((fn) => fn());
};
export const subscribeToResume = (_uid, id, callback) => {
  const fn = () =>
    callback(records[id] ? normalizeResumeRecord(records[id], id) : null);
  listeners.add(fn);
  fn();
  return () => listeners.delete(fn);
};
export const subscribeToResumes = (_uid, callback) => {
  const fn = () =>
    callback(
      Object.entries(records).map(([id, data]) =>
        normalizeResumeRecord(data, id),
      ),
    );
  listeners.add(fn);
  fn();
  return () => listeners.delete(fn);
};
export const saveResume = async (
  _uid,
  id,
  { resumeData, title, presentation },
) => {
  records[id] = {
    resumeData,
    metadata: {
      ...records[id]?.metadata,
      title,
      presentation,
      lastModified: Date.now(),
    },
  };
  notify();
};
export const createResume = async (_uid, options) => {
  const id = `resume-${Date.now()}`;
  records[id] = {
    resumeData: options.resumeData || seed.resumeData,
    metadata: {
      title: options.title,
      createdAt: Date.now(),
      lastModified: Date.now(),
      presentation: {
        template: options.template,
        colorScheme: options.colorScheme,
      },
    },
  };
  notify();
  return id;
};
export const duplicateResume = async (_uid, id) => {
  const next = `copy-${Date.now()}`;
  records[next] = JSON.parse(JSON.stringify(records[id]));
  records[next].metadata.shared = false;
  records[next].metadata.title += " (Copy)";
  notify();
  return next;
};
export const deleteResume = async (_uid, id) => {
  delete records[id];
  delete publicRecords[id];
  notify();
};
export const publishResume = async (_uid, id, sharing = {}) => {
  publicRecords[id] = createPublicResumeSnapshot(records[id], id, sharing);
  records[id].metadata = { ...records[id].metadata, shared: true, sharing };
  notify();
  return publicRecords[id];
};
export const unpublishResume = async (_uid, id) => {
  delete publicRecords[id];
  records[id].metadata.shared = false;
  notify();
};
export const getPublishedResume = async (_uid, id) => publicRecords[id] || null;
