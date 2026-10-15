import { useState } from "react";
import { CircularProgress, Typography, Alert, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

import { usePublishedSchemas } from "../../hooks/usePublishedSchemas";
import { SchemaCard } from "../HomePage/components/SchemaCard";
import { SchemaViewModal } from "./SchemaViewModal";
import { BackToHomeButton } from "../../components/BackToHomeButton";

import type { Ischema } from "../../types/schema.types";

import {
  PageContainer,
  LoadingContainer,
  PageTitle,
  EmptyState,
  CardsGrid,
  ErrorAlert,
} from "./SchemasListPage.styles";

export const SchemasListPage = () => {
  const { t } = useTranslation();

  const {
    schemas,
    loading: isLoading,
    error,
    isError,
    hasData,
    refetch,
  } = usePublishedSchemas();

  const [selectedSchema, setSelectedSchema] = useState<Ischema | null>(null);

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
        {t("listPages.schemasTitle")}
      </PageTitle>

      {schemas.length === 0 ? (
        <EmptyState elevation={0}>
          <Typography variant="body1">
            {t("listPages.schemasEmpty")}
          </Typography>
        </EmptyState>
      ) : (
        <CardsGrid>
          {schemas.map((schema, index) => (
            <SchemaCard
              key={schema._id}
              schema={schema}
              index={index}
              onView={() => setSelectedSchema(schema)}
            />
          ))}
        </CardsGrid>
      )}

      <SchemaViewModal
        schema={selectedSchema}
        onClose={() => setSelectedSchema(null)}
      />
    </PageContainer>
  );
};

export default SchemasListPage;
