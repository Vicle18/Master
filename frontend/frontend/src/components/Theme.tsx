import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  palette: {
    primary: {
      light: "#cfd8dc",
      main: "#607d8b",
      dark: "#37474f",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#cfd8dc",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

export const themeLight = createMuiTheme({
  palette: {
    background: {
      default: "#e4f0e2"
    }
  },
});

export const themeDark = createMuiTheme({
  palette: {
    background: {
      default: "#222222",
    }
  },
});