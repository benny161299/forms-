import { styled } from '@mui/material/styles';
import {
  Button,
  Card,
  CardActions,
  Typography,
} from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  width: 260,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

export const Content = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

export const CardNumber = styled(Typography)(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spacing(0.5),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

export const CardTitle = styled(Typography)({
  fontWeight: 600,
});

export const ActionsContainer = styled(CardActions)({
  padding: 0,
});

export const ActionButton = styled(Button)({
  flex: 1,
});

export const DeleteButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
}));