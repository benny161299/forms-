import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Alert,
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
} from "./InstancesListPage.styles";

export const InstancesListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    instances,
    loading: isLoading,
    error,
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

  if (error) {
    return (
      <PageContainer>
        <Alert severity="error">
          {t("errors.fetchSubmittedInstances")}
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

      <PageTitle variant="h4">
        {t("listPages.instancesTitle")}
      </PageTitle>

      {!instances || instances.length === 0 ? (
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
