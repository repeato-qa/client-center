import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fff',
      paper: '#fff',
    },
    primary: {
      main: '#10a4da',
    },
    secondary: {
      main: '#10a4da',
    },
    success: {
      main: '#AED581',
    },
    error: {
      main: '#f44336',
    },
    text: {
      primary: 'rgba(6,6,6,0.87)',
    },
  },
});

export default theme;
