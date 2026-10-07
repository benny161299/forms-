import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Typography } from '@mui/material';

import { useDraftSchemas } from '../../../hooks/useDraftSchemas';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { SchemaCard } from './SchemaCard';
import {
  SectionPaper,
  CarouselWrapper,
  SectionLoadingContainer,
} from '../HomePage.styles';

export function SchemaDraftsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { schemas, loading, error, deleteSchema } = useDraftSchemas();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteSchema(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <SectionPaper variant="outlined">
        <Typography variant="h6" color="secondary" gutterBottom>
          {t('home.schemaDrafts')}
        </Typography>

        {loading ? (
          <SectionLoadingContainer>
            <CircularProgress size={32} />
          </SectionLoadingContainer>
        ) : error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : !schemas || schemas.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('home.emptySchemaDrafts')}
          </Typography>
        ) : (
          <CarouselWrapper>
            {schemas.map((schema, index) => (
              <SchemaCard
                key={schema._id}
                schema={schema}
                index={index}
                onEdit={(id) => navigate(`/schemas/edit/${id}`)}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </CarouselWrapper>
        )}
      </SectionPaper>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title={t('home.confirmDeleteTitle')}
        description={t('home.confirmDeleteSchema')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
}
