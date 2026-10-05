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

import * as S from "./InstancesListPage.styles";

export default function InstancesListPage() {
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
      <S.PageContainer>
        <S.LoadingContainer>
          <CircularProgress />
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  if (error) {
    return (
      <S.PageContainer>
        <Alert severity="error">
          {t("errors.fetchSubmittedInstances")}
        </Alert>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.HomeButton
        startIcon={<HomeIcon />}
        onClick={() => navigate("/")}
        variant="outlined"
        size="small"
      >
        {t("common.backToHome")}
      </S.HomeButton>

      <S.PageTitle variant="h4">
        {t("listPages.instancesTitle")}
      </S.PageTitle>

      {!instances || instances.length === 0 ? (
        <S.EmptyState elevation={0}>
          <Typography variant="body1">
            {t("listPages.instancesEmpty")}
          </Typography>
        </S.EmptyState>
      ) : (
        <S.CardsGrid>
          {instances.map((instance, index) => (
            <InstanceCard
              key={instance._id}
              instance={instance}
              index={index}
              onView={() => setSelectedInstance(instance)}
            />
          ))}
        </S.CardsGrid>
      )}

      <InstanceViewModal
        instance={selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </S.PageContainer>
  );
}
