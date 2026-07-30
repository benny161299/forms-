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
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#10b981",
    },
    warning: {
      main: "#f59e0b",
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