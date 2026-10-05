import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Typography, Alert } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";

import { usePublishedSchemas } from "../../hooks/usePublishedSchemas";
import { SchemaCard } from "../HomePage/components/SchemaCard";
import { SchemaViewModal } from "./SchemaViewModal";

import type { Ischema } from "../../types/schema.types";

import * as S from "./SchemasListPage.styles";

export default function SchemasListPage() {
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
          {t("errors.fetchPublishedSchemas")}
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
        {t("listPages.schemasTitle")}
      </S.PageTitle>

      {!schemas || schemas.length === 0 ? (
        <S.EmptyState elevation={0}>
          <Typography variant="body1">
            {t("listPages.schemasEmpty")}
          </Typography>
        </S.EmptyState>
      ) : (
        <S.CardsGrid>
          {schemas.map((schema, index) => (
            <SchemaCard
              key={schema._id}
              schema={schema}
              index={index}
              onView={() => setSelectedSchema(schema)}
            />
          ))}
        </S.CardsGrid>
      )}

      <SchemaViewModal
        schema={selectedSchema}
        onClose={() => setSelectedSchema(null)}
      />
    </S.PageContainer>
  );
}
