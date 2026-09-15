export const printText = (title, content) => {
  const popup = window.open("", "_blank", "width=900,height=700");
  if (!popup) throw new Error("Allow pop-ups to open the print preview.");
  popup.document.write(
    '<!doctype html><html><head><meta charset="utf-8"><style>body{font:12pt/1.6 sans-serif;margin:36px}pre{font:inherit;white-space:pre-wrap;overflow-wrap:anywhere}@page{margin:18mm}</style></head><body></body></html>',
  );
  popup.document.close();
  popup.document.title = title;
  const heading = popup.document.createElement("h1");
  heading.textContent = title;
  const body = popup.document.createElement("pre");
  body.textContent = content;
  popup.document.body.append(heading, body);
  popup.focus();
  setTimeout(() => popup.print(), 250);
};
export const escapeHtml = (value) =>
  String(value || "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
