import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';

import { useDraftInstances } from '../../../hooks/useDraftInstances';
import { InstanceCard } from './InstanceCard';
import {
  SectionPaper,
  CarouselWrapper,
  SectionLoadingContainer,
} from '../HomePage.styles';

export function InstanceDraftsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { instances, loading, error, deleteInstance } = useDraftInstances();

  const handleDeleteInstance = async (id: string) => {
    const { confirmed } = await confirm({
      title: t('home.confirmDeleteTitle'),
      description: t('home.confirmDeleteInstance'),
      confirmationText: t('common.delete'),
      cancellationText: t('common.cancel'),
      confirmationButtonProps: { color: 'error' },
    });
    if (!confirmed) return;

    deleteInstance(id);
  };

  return (
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
              onDelete={handleDeleteInstance}
            />
          ))}
        </CarouselWrapper>
      )}
    </SectionPaper>
  );
}
