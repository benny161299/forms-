import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { usePublishedSchemas } from '../../../hooks/usePublishedSchemas';
import type { IInstance } from '../../../types/instance.types';
import {
  StyledCard,
  Content,
  CardNumber,
  CardTitle,
  ActionsContainer,
  ActionButton,
  DeleteButton,
} from './InstanceCard.styles';

interface InstanceCardProps {
  instance: IInstance;
  index: number;
  schemaTitle?: string;
  onContinueFill?: (instanceId: string) => void;
  onView?: (instanceId: string) => void;
  onDelete?: (instanceId: string) => void;
}

export const InstanceCard = ({
  instance,
  index,
  schemaTitle,
  onContinueFill,
  onView,
  onDelete,
}: InstanceCardProps) => {
  const { t } = useTranslation();
  const { schemas } = usePublishedSchemas();

  const title =
    schemaTitle ??
    schemas.find((schema) => schema._id === instance.schemaId)?.title;

  return (
    <StyledCard variant="outlined">
      <Content>
        <CardNumber variant="caption">
          {index + 1}
        </CardNumber>

        <CardTitle variant="h6" noWrap>
          {title || (instance.isDraft
            ? t('home.instanceInProcess')
            : t('home.instanceSubmitted'))}
        </CardTitle>

        {title && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {instance.isDraft
              ? t('home.instanceInProcess')
              : t('home.instanceSubmitted')}
          </Typography>
        )}
      </Content>

      <ActionsContainer>
        {onContinueFill && (
          <ActionButton
            size="small"
            variant="contained"
            onClick={() => onContinueFill(instance._id)}
          >
            {t('home.continueFill')}
          </ActionButton>
        )}

        {onView && (
          <ActionButton
            size="small"
            variant="outlined"
            onClick={() => onView(instance._id)}
          >
            {t('home.viewAnswers')}
          </ActionButton>
        )}

        {onDelete && (
          <DeleteButton
            size="small"
            onClick={() => onDelete(instance._id)}
          >
            {t('home.delete')}
          </DeleteButton>
        )}
      </ActionsContainer>
    </StyledCard>
  );
};
