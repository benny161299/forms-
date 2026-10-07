import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Typography, Alert } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";

import { usePublishedSchemas } from "../../hooks/usePublishedSchemas";
import { SchemaCard } from "../HomePage/components/SchemaCard";
import { SchemaViewModal } from "./SchemaViewModal";

import type { Ischema } from "../../types/schema.types";

import {
  PageContainer,
  LoadingContainer,
  HomeButton,
  PageTitle,
  EmptyState,
  CardsGrid,
} from "./SchemasListPage.styles";

export const SchemasListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    schemas,
    loading: isLoading,
    error,
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

  if (error) {
    return (
      <PageContainer>
        <Alert severity="error">
          {t("errors.fetchPublishedSchemas")}
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
        {t("listPages.schemasTitle")}
      </PageTitle>

      {!schemas || schemas.length === 0 ? (
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
