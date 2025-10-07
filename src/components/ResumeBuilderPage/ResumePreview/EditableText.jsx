import { Box } from '@mui/material';

/**
 * EditableText - A wrapper component that makes text editable on double-click
 * @param {Object} props
 * @param {React.ReactNode} props.children - The text content to display
 * @param {Function} props.onEdit - Callback when double-clicked
 * @param {boolean} props.disabled - Whether editing is disabled (e.g., during print/export)
 * @param {boolean} props.editMode - Whether edit mode is enabled
 */
const EditableText = ({ children, onEdit, disabled = false, editMode = false }) => {
  if (disabled || !editMode) {
    return <>{children}</>;
  }

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <Box
      component="span"
      onDoubleClick={handleDoubleClick}
      sx={{
        cursor: 'text',
        position: 'relative',
        display: 'inline-block',
        '&:hover': {
          backgroundColor: 'rgba(157, 136, 217, 0.1)',
          outline: '2px dashed rgba(157, 136, 217, 0.3)',
          outlineOffset: '2px',
          borderRadius: '4px',
        },
        '&:hover::after': {
          content: '"✎ Double-click to edit"',
          position: 'absolute',
          top: '-28px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#2E2152',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none',
          opacity: 0.9,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default EditableText;
