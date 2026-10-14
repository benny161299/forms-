import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { CircularProgress, Typography, Button } from '@mui/material';

import { schemaApi } from '../../../api/schema.api';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { SchemaCard } from './SchemaCard';
import {
  SectionPaper,
  CarouselWrapper,
  SectionLoadingContainer,
  SectionErrorText,
  SectionErrorContainer,
  RetryButton,
} from '../HomePage.styles';

export const SchemaDraftsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['draftSchemas'],
    queryFn: schemaApi.getDraftSchemas,
  });

  const schemas = data ?? [];
  const hasData = data !== undefined;
  const isError = Boolean(error);

  const deleteSchemaMutation = useMutation({
    mutationFn: (id: string) => schemaApi.deleteSchema(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draftSchemas'] });
      queryClient.invalidateQueries({ queryKey: ['schemas'] });
      toast.success(t('home.schemaDeleteSuccess'));
    },
    onError: () => {
      toast.error(t('home.schemaDeleteError'));
    },
  });

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteSchemaMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const errorMessage = isError ? t('errors.fetchDraftSchemas') : null;

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
        ) : isError && !hasData ? (
          <>
            <SectionErrorText variant="body2">
              {errorMessage}
            </SectionErrorText>
            <RetryButton size="small" onClick={() => refetch()}>
              {t('common.retry')}
            </RetryButton>
          </>
        ) : schemas.length === 0 ? (
          <>
            {isError && (
              <SectionErrorContainer>
                <SectionErrorText variant="body2">
                  {errorMessage}
                </SectionErrorText>
                <Button size="small" onClick={() => refetch()}>
                  {t('common.retry')}
                </Button>
              </SectionErrorContainer>
            )}
            <Typography variant="body2" color="text.secondary">
              {t('home.emptySchemaDrafts')}
            </Typography>
          </>
        ) : (
          <>
            {isError && (
              <SectionErrorContainer>
                <SectionErrorText variant="body2">
                  {errorMessage}
                </SectionErrorText>
                <Button size="small" onClick={() => refetch()}>
                  {t('common.retry')}
                </Button>
              </SectionErrorContainer>
            )}
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
          </>
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
};
