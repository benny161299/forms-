import { useTranslation } from 'react-i18next';
import type { Ischema } from '../../../types/schema.types';
import * as S from './SchemaCard.styles';

interface SchemaCardProps {
  schema: Ischema;
  index: number;
  onEdit?: (id: string) => void;
  onFill?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SchemaCard({ schema, index, onEdit, onFill, onDelete }: SchemaCardProps) {
  const { t } = useTranslation();

  return (
    <S.StyledCard variant="outlined">
      <div>
        <S.CardNumber variant="caption">{index + 1}</S.CardNumber>
        <S.CardTitle variant="h6" noWrap>
          {schema.title}
        </S.CardTitle>
      </div>

      <S.ActionsContainer>
        {onEdit && (
          <S.ActionButton
            size="small"
            variant="outlined"
            onClick={() => onEdit(schema._id)}
          >
            {t('home.edit')}
          </S.ActionButton>
        )}
        {onFill && (
          <S.ActionButton
            size="small"
            variant="contained"
            onClick={() => onFill(schema._id)}
          >
            {t('home.fill')}
          </S.ActionButton>
        )}
        {onDelete && (
          <S.DeleteButton size="small" onClick={() => onDelete(schema._id)}>
            {t('home.delete')}
          </S.DeleteButton>
        )}
      </S.ActionsContainer>
    </S.StyledCard>
  );
}