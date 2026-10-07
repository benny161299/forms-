import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Typography, Button } from '@mui/material';

import { useSubmittedInstances } from '../../../hooks/useSubmittedInstances';
import { InstanceCard } from './InstanceCard';
import { InstanceViewModal } from '../../InstancesListPage/InstanceViewModal';
import type { IInstance } from '../../../types/instance.types';
import {
  SectionPaper,
  SectionHeader,
  CarouselWrapper,
  SectionLoadingContainer,
} from '../HomePage.styles';

export const SubmittedInstancesSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { instances, loading, error } = useSubmittedInstances();
  const [selectedInstance, setSelectedInstance] = useState<IInstance | null>(null);

  return (
    <>
      <SectionPaper variant="outlined">
        <SectionHeader>
          <Typography variant="h6" color="secondary" gutterBottom={false}>
            {t('home.submittedInstances')}
          </Typography>
          <Button size="small" onClick={() => navigate('/instances')}>
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
        ) : !instances || instances.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('home.emptySubmittedInstances')}
          </Typography>
        ) : (
          <CarouselWrapper>
            {instances.map((instance, index) => (
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

      <InstanceViewModal
        instance={selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </>
  );
}
