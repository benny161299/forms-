import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Typography } from '@mui/material';

import { useDraftInstances } from '../../../hooks/useDraftInstances';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { InstanceCard } from './InstanceCard';
import {
  SectionPaper,
  CarouselWrapper,
  SectionLoadingContainer,
} from '../HomePage.styles';

export const InstanceDraftsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { instances, loading, error, deleteInstance } = useDraftInstances();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteInstance(deleteId);
      setDeleteId(null);
    }
  };

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
        ) : error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : !instances || instances.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('home.emptyInstanceDrafts')}
          </Typography>
        ) : (
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
}
