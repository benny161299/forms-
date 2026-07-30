import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#2563eb",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#64748b",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Rubik, Arial, sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
});