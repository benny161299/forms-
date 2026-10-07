import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText,
  cancelText,
  confirmColor = 'error',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  const resolvedConfirmText = confirmText ?? t('common.confirm');
  const resolvedCancelText = cancelText ?? t('common.cancel');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{resolvedCancelText}</Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" autoFocus>
          {resolvedConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
