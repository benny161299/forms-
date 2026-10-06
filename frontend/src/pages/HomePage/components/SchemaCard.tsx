import { useTranslation } from 'react-i18next';
import type { Ischema } from '../../../types/schema.types';
import {
  StyledCard,
  CardNumber,
  CardTitle,
  ActionsContainer,
  ActionButton,
  DeleteButton,
} from './SchemaCard.styles';

interface SchemaCardProps {
  schema: Ischema;
  index: number;
  onEdit?: (id: string) => void;
  onFill?: (id: string) => void;
  onView?: () => void;
  onDelete?: (id: string) => void;
}

export function SchemaCard({ schema, index, onEdit, onFill, onView, onDelete }: SchemaCardProps) {
  const { t } = useTranslation();

  return (
    <StyledCard variant="outlined">
      <div>
        <CardNumber variant="caption">{index + 1}</CardNumber>
        <CardTitle variant="h6" noWrap>
          {schema.title}
        </CardTitle>
      </div>

      <ActionsContainer>
        {onEdit && (
          <ActionButton
            size="small"
            variant="outlined"
            onClick={() => schema._id && onEdit(schema._id)}
          >
            {t('home.edit')}
          </ActionButton>
        )}
        {onFill && (
          <ActionButton
            size="small"
            variant="contained"
            onClick={() => schema._id && onFill(schema._id)}
          >
            {t('home.fill')}
          </ActionButton>
        )}
        {onView && (
          <ActionButton
            size="small"
            variant="outlined"
            onClick={onView}
          >
            {t('listPages.view')}
          </ActionButton>
        )}
        {onDelete && (
          <DeleteButton size="small" onClick={() => schema._id && onDelete(schema._id)}>
            {t('home.delete')}
          </DeleteButton>
        )}
      </ActionsContainer>
    </StyledCard>
  );
}