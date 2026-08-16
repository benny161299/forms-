import { styled } from '@mui/material/styles';
import { Card, CardActions, Typography, Button } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  width: 260,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

export const CardNumber = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  display: 'block',
  marginBottom: theme.spacing(0.5),
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