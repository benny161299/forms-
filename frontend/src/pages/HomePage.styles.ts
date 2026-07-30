import {
  Box,
  Card ,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  direction: "rtl",
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between", 
  alignItems: "center",           
  marginBottom: theme.spacing(4),
}));

export const MainGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
}));

export const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));
export const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
})) as typeof Typography;

export const CarouselWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  overflowX: "auto",
  paddingBottom: theme.spacing(1),
}));

export const ItemCard = styled(Card)(({ theme }) => ({
  width: 270,
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between", 
  padding: theme.spacing(2),
}));


export const CardFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));


export const EmptyStateBox = styled(Paper)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
}));


export const StateMessageBox = styled(Box)<{ isError?: boolean }>(
  ({ theme, isError }) => ({
    textAlign: "center",
    padding: theme.spacing(4),
    color: isError ? theme.palette.error.main : theme.palette.text.primary,
  })
);