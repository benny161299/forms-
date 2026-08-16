import { useTranslation } from 'react-i18next';
import type { IInstance } from '../../../types/instance.types';
import * as S from './InstanceCard.styles';

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
    <S.StyledCard variant="outlined">
      <S.Content>
        <S.CardNumber variant="caption">
          {index + 1}
        </S.CardNumber>

        <S.CardTitle variant="body1">
          {isDraft
            ? t('home.instanceInProcess')
            : t('home.instanceSubmitted')}
        </S.CardTitle>


      </S.Content>

      <S.ActionsContainer>
        {onContinueFill && (
          <S.ActionButton
            size="small"
            variant="contained"
            onClick={() => onContinueFill(instance._id)}
          >
            {t('home.continueFill')}
          </S.ActionButton>
        )}

        {onView && (
          <S.ActionButton
            size="small"
            variant="outlined"
            onClick={() => onView(instance._id)}
          >
            {t('home.viewAnswers')}
          </S.ActionButton>
        )}

        {onDelete && (
          <S.DeleteButton
            size="small"
            onClick={() => onDelete(instance._id)}
          >
            {t('home.delete')}
          </S.DeleteButton>
        )}
      </S.ActionsContainer>
    </S.StyledCard> 
  );
}