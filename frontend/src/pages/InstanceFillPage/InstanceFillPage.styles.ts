import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";

export * from "../../components/common/FormPage.styles";

export const SectionHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const RightActions = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
}));
