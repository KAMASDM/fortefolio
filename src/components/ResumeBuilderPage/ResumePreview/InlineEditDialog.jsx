import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const InlineEditDialog = ({ open, onClose, onSave, editData }) => {
  const [value, setValue] = useState('');
  const [fieldType, setFieldType] = useState('text');

  useEffect(() => {
    if (editData) {
      setValue(editData.value || '');
      setFieldType(editData.multiline ? 'multiline' : 'text');
    }
  }, [editData]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  const handleClose = () => {
    setValue('');
    onClose();
  };

  if (!editData) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Edit {editData.label}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Double-click on any text in the preview to edit it quickly.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline={editData.multiline}
            rows={editData.multiline ? 4 : 1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={editData.placeholder || 'Enter text...'}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: editData.multiline ? '0.95rem' : '1rem',
              }
            }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{
            bgcolor: '#9D88D9',
            '&:hover': { bgcolor: '#7F68C9' },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InlineEditDialog;
