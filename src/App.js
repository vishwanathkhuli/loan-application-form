import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LoanApplicationPage from './pages/LoanApplicationPage';
import './styles/validation.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green for financial trust
      light: '#60ad5e',
      dark: '#005005',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1565c0', // Blue for professionalism
      light: '#5e92f3',
      dark: '#003c8f',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      marginBottom: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      marginBottom: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '8px 0 16px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '8px 24px',
          fontWeight: 500,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1b5e20',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&.Mui-required': {
            '&::after': {
              content: '" *"',
              color: '#f44336',
              fontWeight: 'bold',
              marginLeft: '4px',
              display: 'inline-block',
            },
            '& .MuiFormLabel-asterisk': {
              display: 'none',
            },
          },
        },
        asterisk: {
          display: 'none',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-required': {
            '&::after': {
              content: '" *"',
              color: '#f44336',
              fontWeight: 'bold',
              marginLeft: '4px',
              display: 'inline-block',
            },
            '& .MuiFormLabel-asterisk': {
              display: 'none',
            },
          },
        },
        asterisk: {
          display: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LoanApplicationPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 