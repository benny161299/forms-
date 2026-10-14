import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";

import { useSubmittedInstances } from "../../hooks/useSubmittedInstances";
import { InstanceCard } from "../HomePage/components/InstanceCard";
import { InstanceViewModal } from "./InstanceViewModal";

import type { IInstance } from "../../types/instance.types";

import {
  CardsGrid,
  EmptyState,
  HomeButton,
  LoadingContainer,
  PageContainer,
  PageTitle,
  ErrorAlert,
} from "./InstancesListPage.styles";

export const InstancesListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
        <HomeButton
          startIcon={<HomeIcon />}
          onClick={() => navigate("/")}
          variant="outlined"
          size="small"
        >
          {t("common.backToHome")}
        </HomeButton>
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
      <HomeButton
        startIcon={<HomeIcon />}
        onClick={() => navigate("/")}
        variant="outlined"
        size="small"
      >
        {t("common.backToHome")}
      </HomeButton>

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
