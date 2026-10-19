import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

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

export const ActionsFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(4),
}));
