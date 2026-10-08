import { styled } from "@mui/material/styles";
import { Box, Paper, Button } from "@mui/material";

export const HomeButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const PageContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "56.25rem",
  margin: "0 auto",
  boxSizing: "border-box",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const ActionsFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(4),
}));

export const SaveActions = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
}));