import type { ReactNode } from "react";
import { CircularProgress, Typography, Alert, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

import { BackToHomeButton } from "../BackToHomeButton";
import {
  PageContainer,
  LoadingContainer,
  PageTitle,
  EmptyState,
  CardsGrid,
  ErrorAlert,
} from "./ListPages.styles";

interface ListPageProps<T> {
  title: string;
  items: T[];
  loading: boolean;
  isError: boolean;
  hasData: boolean;
  error?: string | null;
  emptyMessage: string;
  onRetry: () => void;
  renderItem: (item: T, index: number) => ReactNode;
  modal?: ReactNode;
}

export const ListPage = <T,>({
  title,
  items,
  loading,
  isError,
  hasData,
  error,
  emptyMessage,
  onRetry,
  renderItem,
  modal,
}: ListPageProps<T>) => {
  const { t } = useTranslation();

  const retryButton = (
    <Button color="inherit" size="small" onClick={onRetry}>
      {t("common.retry")}
    </Button>
  );

  if (loading) {
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
        <Alert severity="error" action={retryButton}>
          {error}
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackToHomeButton />

      {isError && (
        <ErrorAlert severity="error" action={retryButton}>
          {error}
        </ErrorAlert>
      )}

      <PageTitle variant="h4">{title}</PageTitle>

      {items.length === 0 ? (
        <EmptyState elevation={0}>
          <Typography variant="body1">{emptyMessage}</Typography>
        </EmptyState>
      ) : (
        <CardsGrid>{items.map((item, index) => renderItem(item, index))}</CardsGrid>
      )}

      {modal}
    </PageContainer>
  );
};

