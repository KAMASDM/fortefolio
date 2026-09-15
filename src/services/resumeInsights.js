const text = (value) => (typeof value === "string" ? value.trim() : "");
export const hasSectionContent = (value) => {
  if (Array.isArray(value)) return value.some(hasSectionContent);
  if (value && typeof value === "object")
    return Object.entries(value).some(
      ([key, child]) =>
        !["id", "current"].includes(key) && hasSectionContent(child),
    );
  return Boolean(text(value));
};

export const SECTION_LABELS = {
  education: "Education",
  experience: "Experience",
  skills: "Skills",
  projects: "Projects",
  references: "References",
};

export const getResumeInsights = (data = {}) => {
  const info = data.personalInfo || {};
  const experience = (data.experience || []).filter(hasSectionContent);
  const projects = (data.projects || []).filter(hasSectionContent);
  const skills = (data.skills || [])
    .flatMap((group) => group.skills || [])
    .filter(Boolean);
  const checks = [
    {
      section: "personalInfo",
      label: "Add your name",
      done: Boolean(text(info.fullName)),
    },
    {
      section: "personalInfo",
      label: "Add a valid email",
      done: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(info.email)),
    },
    {
      section: "personalInfo",
      label: "Add a target role or professional title",
      done: Boolean(text(info.jobTitle)),
    },
    {
      section: "personalInfo",
      label: "Write a focused professional summary",
      done: text(info.summary).split(/\s+/).filter(Boolean).length >= 15,
    },
    {
      section: experience.length ? "experience" : "projects",
      label: "Describe your experience or a project",
      done:
        experience.some(
          (e) => hasSectionContent(e.responsibilities) || text(e.description),
        ) || projects.some((p) => text(p.description)),
    },
    {
      section: "skills",
      label: "Include at least three relevant skills",
      done: skills.length >= 3,
    },
    {
      section: "education",
      label: "Add education or training",
      done: (data.education || []).some(
        (e) => text(e.institution) && text(e.degree),
      ),
    },
  ];
  const suggestions = [];
  experience.forEach((entry, index) => {
    if (!text(entry.company) || !text(entry.position))
      suggestions.push({
        section: "experience",
        label: `Finish the company and role for experience ${index + 1}`,
      });
    if (
      entry.startDate &&
      entry.endDate &&
      !entry.current &&
      entry.endDate < entry.startDate
    )
      suggestions.push({
        section: "experience",
        label: `Check the dates for ${entry.company || "experience " + (index + 1)}`,
      });
    const bullets = Array.isArray(entry.responsibilities)
      ? entry.responsibilities
      : [entry.description || ""];
    if (bullets.some((b) => text(b)) && !bullets.some((b) => /\d/.test(b)))
      suggestions.push({
        section: "experience",
        label: `Consider a measurable result for ${entry.company || "experience " + (index + 1)} — only if accurate`,
      });
  });
  return {
    checks,
    suggestions,
    score: Math.round(
      (checks.filter((c) => c.done).length / checks.length) * 100,
    ),
  };
};

const STOP_WORDS = new Set(
  "the and with for from that this your you are our will have has work team role years year experience skills ability strong excellent required preferred about into using including looking responsibilities qualifications company candidate must can all we to of in on a an is as be or it at by do us their they who knowledge understanding working develop development support business position join such more related within across based".split(
    " ",
  ),
);
export const matchJobDescription = (data, description) => {
  const tokens = (description.toLowerCase().match(/[a-z][a-z0-9+#.-]*/g) || [])
    .map((t) => t.replace(/[.-]+$/, ""))
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
  const counts = tokens.reduce(
    (map, token) => map.set(token, (map.get(token) || 0) + 1),
    new Map(),
  );
  const keywords = [...counts]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([word]) => word);
  const resumeTokens = new Set(
    (
      JSON.stringify(data)
        .toLowerCase()
        .match(/[a-z][a-z0-9+#.-]*/g) || []
    ).map((t) => t.replace(/[.-]+$/, "")),
  );
  const matched = keywords.filter((word) => resumeTokens.has(word));
  return {
    matched,
    missing: keywords.filter((word) => !resumeTokens.has(word)),
    total: keywords.length,
  };
};
