import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

/**
 * EditableText - makes a single scalar text field truly inline-editable
 * (real contenteditable, not a modal) when double-clicked in preview mode.
 * Scope this to leaf text fields only (name, title, contact info, a single
 * bullet/summary) - never wrap array/section blocks or computed/derived
 * text (formatted dates, initials) in this component.
 */
const EditableText = ({
  value,
  onCommit,
  children,
  disabled = false,
  editMode = false,
  multiline = false,
  placeholder = "Click to add",
  component = "span",
  sx = {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef(null);
  const finished = useRef(false);
  const displayValue = value ?? "";

  useEffect(() => {
    if (!isEditing || !ref.current) return;
    finished.current = false;
    ref.current.focus();
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, [isEditing]);

  if (disabled || !editMode) {
    return children ?? <>{displayValue}</>;
  }

  const commit = () => {
    if (finished.current) return;
    finished.current = true;
    const next = (ref.current?.innerText ?? "").replace(/\n+$/, "");
    setIsEditing(false);
    if (next !== displayValue) {
      onCommit?.(next);
    }
  };

  const cancel = () => { finished.current = true; setIsEditing(false); };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      commit();
    }
  };

  if (isEditing) {
    return (
      <Box
        component={component}
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label={placeholder}
        aria-multiline={multiline}
        onPaste={e => { e.preventDefault(); document.execCommand("insertText", false, e.clipboardData.getData("text/plain")); }}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        sx={{
          display: multiline ? "block" : "inline-block",
          whiteSpace: multiline ? "pre-wrap" : "nowrap",
          minWidth: "2ch",
          outline: "2px solid #9D88D9",
          outlineOffset: "2px",
          borderRadius: "4px",
          backgroundColor: "rgba(157, 136, 217, 0.08)",
          ...sx,
        }}
      >
        {displayValue}
      </Box>
    );
  }

  return (
    <Box
      component={component}
      tabIndex={0}
      role="button"
      aria-label={`Edit ${placeholder}`}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsEditing(true); } }}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
      }}
      sx={{
        cursor: "text",
        display: "inline-block",
        borderRadius: "4px",
        color: displayValue ? "inherit" : "text.disabled",
        fontStyle: displayValue ? "inherit" : "italic",
        "&:hover": {
          backgroundColor: "rgba(157, 136, 217, 0.1)",
          outline: "1px dashed rgba(157, 136, 217, 0.5)",
          outlineOffset: "2px",
        },
        ...sx,
      }}
    >
      {children ?? (displayValue || placeholder)}
    </Box>
  );
};

export default EditableText;
