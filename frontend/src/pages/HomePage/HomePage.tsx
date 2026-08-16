import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Typography, Button } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { toast } from 'react-toastify';

import { useHomeData } from '../../hooks/useHomeData';
import { schemaApi } from '../../api/schema.api';
import { instanceApi } from '../../api/instance.api';
import { SchemaCard, InstanceCard } from './components/index';
import * as S from './HomePage.styles';

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

  const handleDeleteSchema = async (id: string) => {
    const { confirmed } = await confirm({ description: t('home.confirmDeleteSchema') });
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
    const { confirmed } = await confirm({ description: t('home.confirmDeleteInstance') });
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
      <S.LoadingContainer>
        <CircularProgress />
      </S.LoadingContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.HeaderContainer>
        <Typography variant="h4" color="primary">
          {t('home.title')}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/schemas/create')}>
          {t('home.createNewSchema')}
        </Button>
      </S.HeaderContainer>

      {errorMessage && (
        <Typography color="error" gutterBottom>
          {errorMessage}
        </Typography>
      )}

      <S.GridContainer>
        <S.SectionPaper variant="outlined">
          <Typography variant="h6" color="secondary" gutterBottom>
            {t('home.schemaDrafts')}
          </Typography>
          {!schemaDrafts || schemaDrafts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('home.emptySchemaDrafts')}
            </Typography>
          ) : (
            <S.CarouselWrapper>
              {schemaDrafts.map((schema, index) => (
                <SchemaCard
                  key={schema._id}
                  schema={schema}
                  index={index}
                  onEdit={(id) => navigate(`/schemas/edit/${id}`)}
                  onDelete={handleDeleteSchema}
                />
              ))}
            </S.CarouselWrapper>
          )}
        </S.SectionPaper>

        <S.SectionPaper variant="outlined">
          <Typography variant="h6" color="secondary" gutterBottom>
            {t('home.publishedSchemas')}
          </Typography>
          {!publishedSchemas || publishedSchemas.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('home.emptyPublishedSchemas')}
            </Typography>
          ) : (
            <S.CarouselWrapper>
              {publishedSchemas.map((schema, index) => (
                <SchemaCard
                  key={schema._id}
                  schema={schema}
                  index={index}
                  onFill={(id) => navigate(`/instances/fill/${id}`)}
                />
              ))}




              
            </S.CarouselWrapper>
          )}
        </S.SectionPaper>

        <S.SectionPaper variant="outlined">
          <Typography variant="h6" color="secondary" gutterBottom>
            {t('home.instanceDrafts')}
          </Typography>
          {!instanceDrafts || instanceDrafts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('home.emptyInstanceDrafts')}
            </Typography>
          ) : (
            <S.CarouselWrapper>
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
            </S.CarouselWrapper>
          )}
        </S.SectionPaper>

        <S.SectionPaper variant="outlined">
          <Typography variant="h6" color="secondary" gutterBottom>
            {t('home.submittedInstances')}
          </Typography>
          {!submittedInstances || submittedInstances.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('home.emptySubmittedInstances')}
            </Typography>
          ) : (
            <S.CarouselWrapper>
              {submittedInstances.map((instance, index) => (
                <InstanceCard
                  key={instance._id}
                  instance={instance}
                  index={index}
                  onView={() => navigate('/instances')}
                />
              ))}
            </S.CarouselWrapper>
          )}
        </S.SectionPaper>
      </S.GridContainer>
    </S.PageContainer>
  );
}