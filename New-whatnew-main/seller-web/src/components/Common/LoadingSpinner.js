import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

const LoadingSpinner = ({ text = "Loading..." }) => (
  <Paper
    elevation={3}
    sx={{
      minHeight: 220,
      minWidth: 320,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 3,
      background: 'linear-gradient(135deg, #f7f7fa 60%, #ffffffff 100%)',
      boxShadow: '0 4px 24px rgba(230,57,70,0.08)',
      p: 4,
      m: 'auto',
    }}
  >
    <CircularProgress
      color="primary"
      size={56}
      thickness={4.5}
      sx={{
        mb: 2,
        animationDuration: '1.2s',
        color: '#ffffffff',
        background: 'transparent',
      }}
    />
    <Typography
      variant="h6"
      color="primary"
      fontWeight={700}
      sx={{ letterSpacing: 1, mb: 0.5, textAlign: 'center' }}
    >
      {text}
    </Typography>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ textAlign: 'center' }}
    >
      Please wait while we process your request.
    </Typography>
  </Paper>
);

export default LoadingSpinner;
