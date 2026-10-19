import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Button } from '@mui/material';

import { usePublishedSchemas } from '../../../hooks/usePublishedSchemas';
import { SchemaCard } from './SchemaCard';
import {
  SectionPaper,
  SectionHeader,
} from '../HomePage.styles';
import { SectionBody } from './SectionBody';

export const PublishedSchemasSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { schemas, loading, error, isError, hasData, refetch } = usePublishedSchemas();

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

      <SectionBody
        loading={loading}
        isError={isError}
        hasData={hasData}
        errorMessage={error}
        emptyMessage={t('home.emptyPublishedSchemas')}
        isEmpty={schemas.length === 0}
        onRetry={() => refetch()}
      >
        {schemas.map((schema, index) => (
          <SchemaCard
            key={schema._id}
            schema={schema}
            index={index}
            onFill={(id) => navigate(`/instances/fill/${id}`)}
          />
        ))}
      </SectionBody>
    </SectionPaper>
  );
};
