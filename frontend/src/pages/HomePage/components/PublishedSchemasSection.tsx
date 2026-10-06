import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Typography, Button } from '@mui/material';

import { usePublishedSchemas } from '../../../hooks/usePublishedSchemas';
import { SchemaCard } from './SchemaCard';
import {
  SectionPaper,
  SectionHeader,
  CarouselWrapper,
  SectionLoadingContainer,
} from '../HomePage.styles';

export function PublishedSchemasSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { schemas, loading, error } = usePublishedSchemas();

  return (
    <SectionPaper variant="outlined">
      <SectionHeader>
        <Typography variant="h6" color="secondary" gutterBottom={false}>
          {t('home.publishedSchemas')}
        </Typography>
        <Button size="small" onClick={() => navigate('/schemas')}>
          {t('home.viewAll')}
        </Button>
      </SectionHeader>

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
          {t('home.emptyPublishedSchemas')}
        </Typography>
      ) : (
        <CarouselWrapper>
          {schemas.map((schema, index) => (
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
  );
}
