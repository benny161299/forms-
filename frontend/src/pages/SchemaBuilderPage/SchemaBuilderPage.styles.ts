import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";

export * from "../../components/common/FormPage.styles";

export const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const SaveActions = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
}));

export const FormFieldSet = styled("fieldset")({
  border: "none",
  margin: 0,
  padding: 0,
});
