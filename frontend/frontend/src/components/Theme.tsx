import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  palette: {
    primary: {
      light: "#cfd8dc",
      main: "#1855b8",
      dark: "#37474f",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#ffffff",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

const themeLight = createMuiTheme({
  palette: {
    background: {
      default: "#e4f0e2"
    }
  },
});

const themeDark = createMuiTheme({
  palette: {
    background: {
      default: "#222222",
    }
  },
});