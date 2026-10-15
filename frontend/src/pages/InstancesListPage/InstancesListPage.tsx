import { useState } from "react";
import {
  CircularProgress,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { useSubmittedInstances } from "../../hooks/useSubmittedInstances";
import { InstanceCard } from "../HomePage/components/InstanceCard";
import { InstanceViewModal } from "./InstanceViewModal";
import { BackToHomeButton } from "../../components/BackToHomeButton";

import type { IInstance } from "../../types/instance.types";

import {
  CardsGrid,
  EmptyState,
  LoadingContainer,
  PageContainer,
  PageTitle,
  ErrorAlert,
} from "./InstancesListPage.styles";

export const InstancesListPage = () => {
  const { t } = useTranslation();

  const {
    instances,
    loading: isLoading,
    error,
    isError,
    hasData,
    refetch,
  } = useSubmittedInstances();

  const [selectedInstance, setSelectedInstance] =
    useState<IInstance | null>(null);

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (isError && !hasData) {
    return (
      <PageContainer>
        <BackToHomeButton />
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              {t("common.retry")}
            </Button>
          }
        >
          {error}
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackToHomeButton />

      {isError && (
        <ErrorAlert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              {t("common.retry")}
            </Button>
          }
        >
          {error}
        </ErrorAlert>
      )}

      <PageTitle variant="h4">
        {t("listPages.instancesTitle")}
      </PageTitle>

      {instances.length === 0 ? (
        <EmptyState elevation={0}>
          <Typography variant="body1">
            {t("listPages.instancesEmpty")}
          </Typography>
        </EmptyState>
      ) : (
        <CardsGrid>
          {instances.map((instance, index) => (
            <InstanceCard
              key={instance._id}
              instance={instance}
              index={index}
              onView={() => setSelectedInstance(instance)}
            />
          ))}
        </CardsGrid>
      )}

      <InstanceViewModal
        instance={selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </PageContainer>
  );
};

export default InstancesListPage;
