import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Button } from '@mui/material';

import {
  SchemaDraftsSection,
  PublishedSchemasSection,
  InstanceDraftsSection,
  SubmittedInstancesSection,
} from './components/index';
import {
  PageContainer,
  HeaderContainer,
  GridContainer,
} from './HomePage.styles';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

      <GridContainer>
        <SchemaDraftsSection />
        <PublishedSchemasSection />
        <InstanceDraftsSection />
        <SubmittedInstancesSection />
      </GridContainer>
    </PageContainer>
  );
}