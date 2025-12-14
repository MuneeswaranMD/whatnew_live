import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',      // Modern blue
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#fff',
    },
    secondary: {
      main: '#64748b',      // Slate
      light: '#94a3b8',
      dark: '#334155',
      contrastText: '#fff',
    },
    success: {
      main: '#22c55e',
      contrastText: '#fff',
    },
    warning: {
      main: '#f59e0b',
      contrastText: '#fff',
    },
    error: {
      main: '#ef4444',
      contrastText: '#fff',
    },
    info: {
      main: '#3b82f6',
      contrastText: '#fff',
    },
    background: {
      default: '#f8fafc',
      paper: '#fff',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: [
      'Inter',
      'Poppins',
      'Space Grotesk',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 800,
      letterSpacing: '0.01em',
    },
    h5: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      borderRadius: 12,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(59,130,246,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(59,130,246,0.10)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 20,
        },
      },
    },
  },
});

export default theme;