import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Button } from '@mui/material';

import { useSubmittedInstances } from '../../../hooks/useSubmittedInstances';
import { InstanceCard } from './InstanceCard';
import { InstanceViewModal } from '../../InstancesListPage/InstanceViewModal';
import type { IInstance } from '../../../types/instance.types';
import {
  SectionPaper,
  SectionHeader,
} from '../HomePage.styles';
import { SectionBody } from './SectionBody';

export const SubmittedInstancesSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { instances, loading, error, isError, hasData, refetch } = useSubmittedInstances();
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

        <SectionBody
          loading={loading}
          isError={isError}
          hasData={hasData}
          errorMessage={error}
          emptyMessage={t('home.emptySubmittedInstances')}
          isEmpty={instances.length === 0}
          onRetry={() => refetch()}
        >
          {instances.map((instance, index) => (
            <InstanceCard
              key={instance._id}
              instance={instance}
              index={index}
              onView={() => setSelectedInstance(instance)}
            />
          ))}
        </SectionBody>
      </SectionPaper>

      <InstanceViewModal
        instance={selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </>
  );
};
