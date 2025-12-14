import React from 'react';
import { Alert as MuiAlert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const typeMap = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  error: 'error',
};

const Alert = ({ type = 'info', message, onClose, className = '', sx = {} }) => (
  <MuiAlert
    severity={typeMap[type] || 'info'}
    variant="filled"
    className={className}
    sx={{
      mb: 2,
      alignItems: 'center',
      ...sx,
    }}
    action={
      onClose ? (
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onClose}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      ) : null
    }
  >
    {message}
  </MuiAlert>
);

export default Alert;
