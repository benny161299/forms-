import { styled } from "@mui/material/styles";
import { Paper, Box, IconButton, FormControl } from "@mui/material";

export const CardContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

export const ControlsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

export const RightControls = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const QuestionTypeFormControl = styled(FormControl)({
  minWidth: 180,
});
export const OptionsList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const OptionItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const ScaleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
}));

export const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: theme.spacing(2),
  gap: theme.spacing(2),
}));

export const InputsContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

export const QuestionsWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));