import { useEffect, useMemo, useState } from "react";
import { subscribeToResumes } from "../services/resumeService";

const hasContent = (value) =>
  Array.isArray(value)
    ? value.length > 0
    : value &&
      typeof value === "object" &&
      Object.values(value).some(
        (item) => item != null && String(item).trim() !== ""
      );

export const useDashboardResumes = (
  currentUser,
  { searchTerm, sortBy, sortDirection }
) => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setResumes([]);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    setError("");
    return subscribeToResumes(
      currentUser.uid,
      (records) => {
        setResumes(
          records.map(({ id, resumeData, metadata }) => {
            const sections = {
              hasPersonalInfo: hasContent(resumeData.personalInfo),
              hasEducation: hasContent(resumeData.education),
              hasExperience: hasContent(resumeData.experience),
              hasSkills: hasContent(resumeData.skills),
              hasProjects: hasContent(resumeData.projects),
              hasReferences: hasContent(resumeData.references),
            };
            const completed = Object.values(sections).filter(Boolean).length;

            return {
              id,
              title: metadata.title,
              lastModified: metadata.lastModified,
              createdAt: metadata.createdAt,
              template: metadata.presentation.template,
              colorScheme: metadata.presentation.colorScheme,
              shared: metadata.shared || false,
              completionPercentage: Math.round(
                (completed / Object.keys(sections).length) * 100
              ),
              sections,
            };
          })
        );
        setIsLoading(false);
      },
      (subscriptionError) => {
        console.error("Error fetching resumes:", subscriptionError);
        setError("Could not load your resumes. Please try again later.");
        setIsLoading(false);
      }
    );
  }, [currentUser]);

  const filteredResumes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const results = resumes.filter(
      (resume) => !search || resume.title.toLowerCase().includes(search)
    );

    return results.sort((left, right) => {
      if (sortBy === "title") {
        const comparison = left.title.localeCompare(right.title);
        return sortDirection === "asc" ? comparison : -comparison;
      }
      const leftValue =
        sortBy === "completion"
          ? left.completionPercentage
          : left[sortBy] || 0;
      const rightValue =
        sortBy === "completion"
          ? right.completionPercentage
          : right[sortBy] || 0;
      return sortDirection === "asc"
        ? leftValue - rightValue
        : rightValue - leftValue;
    });
  }, [resumes, searchTerm, sortBy, sortDirection]);

  const stats = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      total: resumes.length,
      recent: resumes.filter(
        (resume) => resume.lastModified && resume.lastModified > oneWeekAgo
      ).length,
      completed: resumes.filter(
        (resume) => resume.completionPercentage === 100
      ).length,
    };
  }, [resumes]);

  const refresh = () => {
    setError("");
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 500);
  };

  return {
    resumes,
    filteredResumes,
    stats,
    isLoading,
    error,
    refresh,
  };
};
