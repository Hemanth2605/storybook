import { createTheme } from '@mui/material/styles';

/**
 * Shared MUI v7 theme used by the app and by every custom component.
 * Kept intentionally light so component stories reflect real app styling.
 */
export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: { main: '#4f46e5' },
    secondary: { main: '#db2777' },
    success: { main: '#16a34a' },
    warning: { main: '#d97706' },
    error: { main: '#dc2626' },
    info: { main: '#0284c7' },
    background: { default: '#f8fafc', paper: '#ffffff' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid rgba(15, 23, 42, 0.08)' },
      },
    },
  },
});

export default theme;
