import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export * from "../../components/common/ListPages.styles";

export const ChipsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));
