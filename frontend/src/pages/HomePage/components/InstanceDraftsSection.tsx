import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { CircularProgress, Typography, Button } from '@mui/material';

import { instanceApi } from '../../../api/instance.api';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { InstanceCard } from './InstanceCard';
import {
  SectionPaper,
  CarouselWrapper,
  SectionLoadingContainer,
  SectionErrorText,
  SectionErrorContainer,
  RetryButton,
} from '../HomePage.styles';

export const InstanceDraftsSection = () => {
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
    queryKey: ['draftInstances'],
    queryFn: instanceApi.getDraftInstances,
  });

  const instances = data ?? [];
  const hasData = data !== undefined;
  const isError = Boolean(error);

  const deleteInstanceMutation = useMutation({
    mutationFn: (id: string) => instanceApi.deleteInstance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draftInstances'] });
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success(t('home.instanceDeleteSuccess'));
    },
    onError: () => {
      toast.error(t('home.instanceDeleteError'));
    },
  });

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteInstanceMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const errorMessage = isError ? t('errors.fetchDraftInstances') : null;

  return (
    <>
      <SectionPaper variant="outlined">
        <Typography variant="h6" color="secondary" gutterBottom>
          {t('home.instanceDrafts')}
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
        ) : instances.length === 0 ? (
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
              {t('home.emptyInstanceDrafts')}
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
              {instances.map((instance, index) => (
                <InstanceCard
                  key={instance._id}
                  instance={instance}
                  index={index}
                  onContinueFill={(instanceId) =>
                    navigate(`/instances/edit/${instanceId}`)
                  }
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
        description={t('home.confirmDeleteInstance')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
};
