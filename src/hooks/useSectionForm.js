import { useRef } from "react";

// The editor owns form data. Commit on every input, before navigation or saving.
export const useSectionForm = (
  data,
  defaults,
  updateData,
  normalize = (item) => item,
) => {
  const entries = Array.isArray(data) && data.length ? data : defaults;
  const value = entries.map((item, index) =>
    normalize({ ...item, id: item.id ?? index + 1 }),
  );
  const latest = useRef(value);
  latest.current = value;
  const setValue = (change) => {
    const next = typeof change === "function" ? change(latest.current) : change;
    latest.current = next;
    updateData(next);
  };
  return [value, setValue];
};
