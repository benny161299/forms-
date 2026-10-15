import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, Button } from '@mui/material';

export const PageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '75rem',
  margin: '0 auto',
  boxSizing: 'border-box',
  padding: theme.spacing(4),
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(25rem, 1fr))',
  gap: theme.spacing(3),
}));

export const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const CarouselWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  overflowX: 'auto',
  paddingBottom: theme.spacing(1),
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

export const SectionLoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '7.5rem',
});

export const SectionErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const SectionErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export const RetryButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

