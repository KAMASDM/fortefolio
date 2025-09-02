import React, { useEffect, useState } from "react";
import { CircularProgress, Skeleton } from "@mui/material";

// Simple component to fetch job matches for a resume title from a backend
// Endpoint expected: GET /api/jobs?query=<query>
// The server created in /server returns mock data by default and has notes
// on how to enable the Google Cloud Talent Solution integration.

const JobSearch = ({ resumeTitle }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const providerEndpoint = import.meta.env.VITE_GOOGLE_JOBS_ENDPOINT || "";
  const apiKey = import.meta.env.VITE_GOOGLE_JOBS_API_KEY || "";
  const gcpProject = import.meta.env.VITE_GOOGLE_TALENT_PROJECT || "";
  const gcpTenant = import.meta.env.VITE_GOOGLE_TALENT_TENANT || "";
  const useGoogleTalent = !!(gcpProject && gcpTenant && apiKey);

  useEffect(() => {
    if (!resumeTitle) return;
    const controller = new AbortController();

    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        // If Google Talent v4 env vars are present, call the official searchJobs endpoint.
        if (useGoogleTalent) {
          // Endpoint: POST https://jobs.googleapis.com/v4/projects/{projectId}/tenants/{tenantId}:searchJobs?key=API_KEY
          const url = `https://jobs.googleapis.com/v4/projects/${encodeURIComponent(gcpProject)}/tenants/${encodeURIComponent(gcpTenant)}:searchJobs?key=${encodeURIComponent(apiKey)}`;
          const body = {
            requestMetadata: {
              domain: window.location.hostname,
              sessionId: `session-${Math.random().toString(36).slice(2, 10)}`,
              userId: 'anonymous',
            },
            searchMode: 'JOB_SEARCH',
            query: resumeTitle,
            pageSize: 10,
          };

          try {
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
              signal: controller.signal,
            });
            if (!res.ok) {
              const text = await res.text();
              throw new Error(text || `HTTP ${res.status}`);
            }
            const payload = await res.json();
            // Google Talent returns matchingJobs in response; try common fields
            const items = payload.matchingJobs || payload.jobs || payload.results || [];
            const jobsList = items.map((it, i) => {
              const job = it.job || it; // matchingJobs may wrap job object
              return {
                id: job.name || job.jobId || `job-${i}`,
                title: job.title || job.jobTitle || '',
                company: (job.companyDisplayName || (job.employer && job.employer.name)) || '',
                location: (job.addresses && job.addresses[0]) || job.address || '',
                url: job.applicationInfo?.uris?.[0] || job.incentives || '#',
                description: job.description || job.titleSnippet || '',
              };
            });
            setJobs(jobsList);
          } catch (err) {
            throw err; // rethrow to be handled by outer catch
          }
        } else if (providerEndpoint && apiKey) {
          const separator = providerEndpoint.includes("?") ? "&" : "?";
          const url = `${providerEndpoint}${separator}query=${encodeURIComponent(resumeTitle)}&key=${encodeURIComponent(apiKey)}`;
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `HTTP ${res.status}`);
          }
          const payload = await res.json();
          const jobsList = payload.jobs || payload.results || [];
          setJobs(jobsList.map((it, i) => ({
            id: it.id || it.jobId || `job-${i}`,
            title: it.title || it.jobTitle || it.name || '',
            company: it.companyName || it.company || '',
            location: it.location || it.address || '',
            url: it.url || it.applyUrl || it.jobUrl || '#',
            description: it.description || it.snippet || it.summary || '',
          })));
        } else {
          // Fallback mock data
          setJobs([
            { id: 'mock-1', title: `${resumeTitle} Engineer`, company: 'Acme', location: 'Remote', url: '#', description: `Work on ${resumeTitle}` },
            { id: 'mock-2', title: `${resumeTitle} Specialist`, company: 'Example LLC', location: 'NY', url: '#', description: `Build ${resumeTitle}` },
          ]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    return () => controller.abort();
  }, [resumeTitle, providerEndpoint, apiKey]);

  return (
    <div>
      <h3>Jobs matching: "{resumeTitle}"</h3>
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CircularProgress size={20} />
          <div>Loading jobs…</div>
        </div>
      )}
      {error && <div style={{ color: 'crimson' }}>Error: {error}</div>}
      {!loading && !error && jobs.length === 0 && <div>No jobs found.</div>}
      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {loading
          ? [1, 2, 3].map((i) => (
              <li key={i} style={{ margin: '12px 0', paddingBottom: 8 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="rectangular" width="100%" height={48} />
              </li>
            ))
          : jobs.map((job) => (
              <li key={job.id || job.url} style={{ margin: '12px 0', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                <a href={job.url || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ fontWeight: 600 }}>{job.title}</div>
                  <div style={{ color: '#555' }}>{job.company} — {job.location}</div>
                  {job.description && <p style={{ marginTop: 6 }}>{job.description}</p>}
                </a>
              </li>
            ))}
      </ul>
      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
        <strong>Note:</strong> Calling third-party APIs from the browser may require CORS and exposes your API key to end users. For production, prefer a backend proxy.
      </div>
    </div>
  );
};

export default JobSearch;
