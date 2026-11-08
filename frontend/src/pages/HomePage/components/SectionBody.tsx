import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CircularProgress, Typography, Button } from "@mui/material";
import {
  CarouselWrapper,
  SectionLoadingContainer,
  SectionErrorText,
  SectionErrorContainer,
  RetryButton,
} from "../HomePage.styles";

interface SectionBodyProps {
  loading: boolean;
  isError: boolean;
  hasData: boolean;
  errorMessage?: string | null;
  emptyMessage: string;
  isEmpty: boolean;
  onRetry: () => void;
  children: ReactNode;
}

export const SectionBody = ({
  loading,
  isError,
  hasData,
  errorMessage,
  emptyMessage,
  isEmpty,
  onRetry,
  children,
}: SectionBodyProps) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <SectionLoadingContainer>
        <CircularProgress size={32} />
      </SectionLoadingContainer>
    );
  }

  if (isError && !hasData) {
    return (
      <>
        <SectionErrorText variant="body2">{errorMessage}</SectionErrorText>
        <RetryButton size="small" onClick={onRetry}>
          {t("common.retry")}
        </RetryButton>
      </>
    );
  }

  return (
    <>
      {isError && (
        <SectionErrorContainer>
          <SectionErrorText variant="body2">{errorMessage}</SectionErrorText>
          <Button size="small" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        </SectionErrorContainer>
      )}
      {isEmpty ? (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      ) : (
        <CarouselWrapper>{children}</CarouselWrapper>
      )}
    </>
  );
};
