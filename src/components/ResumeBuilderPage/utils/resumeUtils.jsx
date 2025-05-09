export const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

export const isSectionEmpty = (section, resumeData) => {
  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
  } = resumeData;

  switch (section) {
    case "personalInfo":
      return !personalInfo || Object.keys(personalInfo).length === 0;
    case "education":
      return !education || education.length === 0;
    case "experience":
      return !experience || experience.length === 0;
    case "skills":
      return !skills || skills.length === 0;
    case "projects":
      return !projects || projects.length === 0;
    default:
      return true;
  }
};

export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
