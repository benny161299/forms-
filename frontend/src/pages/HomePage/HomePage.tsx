import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Typography, Button } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { toast } from 'react-toastify';

import { useHomeData } from './hooks/useHomeData';
import { schemaApi } from '../../api/schema.api';
import { instanceApi } from '../../api/instance.api';
import { SchemaCard, InstanceCard } from './components/index';
import {
  PageContainer,
  LoadingContainer,
  HeaderContainer,
  GridContainer,
  SectionPaper,
  CarouselWrapper,
  SectionHeader,
} from './HomePage.styles';
import type { IInstance } from '../../types/instance.types';
import { InstanceViewModal } from '../InstancesListPage/InstanceViewModal';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const {
    schemaDrafts,
    publishedSchemas,
    instanceDrafts,
    submittedInstances,
    isLoading,
    errorMessage,
    refetchDraftSchemas,
    refetchDraftInstances,
  } = useHomeData();

  const [selectedInstance, setSelectedInstance] = useState<IInstance | null>(null);

  const handleDeleteSchema = async (id: string) => {
    const { confirmed } = await confirm({
      title: t('home.confirmDeleteTitle'),
      description: t('home.confirmDeleteSchema'),
      confirmationText: t('common.delete'),
      cancellationText: t('common.cancel'),
      confirmationButtonProps: { color: 'error' },
    });
    if (!confirmed) return;

    try {
      await schemaApi.deleteSchema(id);
      refetchDraftSchemas();
      toast.success(t('home.schemaDeleteSuccess'));
    } catch {
      toast.error(t('home.schemaDeleteError'));
    }
  };

  const handleDeleteInstance = async (id: string) => {
    const { confirmed } = await confirm({
      title: t('home.confirmDeleteTitle'),
      description: t('home.confirmDeleteInstance'),
      confirmationText: t('common.delete'),
      cancellationText: t('common.cancel'),
      confirmationButtonProps: { color: 'error' },
    });
    if (!confirmed) return;

    try {
      await instanceApi.deleteInstance(id);
      refetchDraftInstances();
      toast.success(t('home.instanceDeleteSuccess'));
    } catch {
      toast.error(t('home.instanceDeleteError'));
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderContainer>
        <Typography variant="h4" color="primary">
          {t('home.title')}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/schemas/create')}>
          {t('home.createNewSchema')}
        </Button>
      </HeaderContainer>

      {errorMessage && (
        <Typography color="error" gutterBottom>
          {errorMessage}
        </Typography>
      )}

      <GridContainer>
        <SectionPaper variant="outlined">
          <Typography variant="h6" color="secondary" gutterBottom>
            {t('home.schemaDrafts')}
          </Typography>
          {!schemaDrafts || schemaDrafts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('home.emptySchemaDrafts')}
            </Typography>
          ) : (
            <CarouselWrapper>
              {schemaDrafts.map((schema, index) => (
                <SchemaCard
                  key={schema._id}
                  schema={schema}
                  index={index}
                  onEdit={(id) => navigate(`/schemas/edit/${id}`)}
                  onDelete={handleDeleteSchema}
                />
              ))}
            </CarouselWrapper>
          )}
        </SectionPaper>

        <SectionPaper variant="outlined">
          <SectionHeader>
            <Typography variant="h6" color="secondary" gutterBottom={false}>
              {t('home.publishedSchemas')}
            </Typography>
            <Button size="small" onClick={() => navigate('/schemas')}>
              {t('home.viewAll')}
            </Button>
          </SectionHeader>
          {!publishedSchemas || publishedSchemas.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('home.emptyPublishedSchemas')}
            </Typography>
          ) : (
            <CarouselWrapper>
              {publishedSchemas.map((schema, index) => (
                <SchemaCard
                  key={schema._id}
                  schema={schema}
                  index={index}
                  onFill={(id) => navigate(`/instances/fill/${id}`)}
                />
              ))}
            </CarouselWrapper>
          )}
        </SectionPaper>

        <SectionPaper variant="outlined">
          <Typography variant="h6" color="secondary" gutterBottom>
            {t('home.instanceDrafts')}
          </Typography>
          {!instanceDrafts || instanceDrafts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('home.emptyInstanceDrafts')}
            </Typography>
          ) : (
            <CarouselWrapper>
              {instanceDrafts.map((instance, index) => (
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

        <SectionPaper variant="outlined">
          <SectionHeader>
            <Typography variant="h6" color="secondary" gutterBottom={false}>
              {t('home.submittedInstances')}
            </Typography>
            <Button size="small" onClick={() => navigate('/instances')}>
              {t('home.viewAll')}
            </Button>
          </SectionHeader>
          {!submittedInstances || submittedInstances.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('home.emptySubmittedInstances')}
            </Typography>
          ) : (
            <CarouselWrapper>
              {submittedInstances.map((instance, index) => (
                <InstanceCard
                  key={instance._id}
                  instance={instance}
                  index={index}
                  onView={() => setSelectedInstance(instance)}
                />
              ))}
            </CarouselWrapper>
          )}
        </SectionPaper>
      </GridContainer>

      <InstanceViewModal
        instance={selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </PageContainer>
  );
}