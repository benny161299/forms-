import { useTranslation } from 'react-i18next';
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
  onContinueFill?: (instanceId: string) => void;
  onView?: (instanceId: string) => void;
  onDelete?: (instanceId: string) => void;
}

export function InstanceCard({
  instance,
  index,
  onContinueFill,
  onView,
  onDelete,
}: InstanceCardProps) {
  const { t } = useTranslation();
  const isDraft = instance.isDraft;

  return (
    <StyledCard variant="outlined">
      <Content>
        <CardNumber variant="caption">
          {index + 1}
        </CardNumber>

        <CardTitle variant="body1">
          {isDraft
            ? t('home.instanceInProcess')
            : t('home.instanceSubmitted')}
        </CardTitle>


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
}