
import { styled } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";

export const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1100,
  margin: "0 auto",
  padding: theme.spacing(4, 2),
  direction: "rtl",
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: theme.spacing(10),
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
}));

export const CardsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: theme.spacing(3),
}));

export const EmptyState = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${theme.palette.divider}`,
}));

export const ViewModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 780,
  maxHeight: "90vh",
  overflowY: "auto",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  direction: "rtl",
  outline: "none",
}));

export const ModalHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(2),
}));

export const ModalTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

export const ModalDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

export const SectionTitle = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const SectionDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));
