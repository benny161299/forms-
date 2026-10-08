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

export const ProgressWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(3),
}));

export const SectionHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const ActionsFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(4),
}));

export const RightActions = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
}));
