import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export * from "../../components/common/ListPages.styles";

export const ModalLoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(4),
}));
